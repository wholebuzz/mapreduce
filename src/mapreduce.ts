import { writeJSON } from '@wholebuzz/fs/lib/json'
import { openNullWritable } from '@wholebuzz/fs/lib/stream'
import { Shard, shardedFilename, waitForCompleteShardedInput } from '@wholebuzz/fs/lib/util'
import { assignDatabaseCopyOutputProperties, DatabaseCopyOptions, dbcp } from 'dbcp'
import { DatabaseCopyShardFunction, inputIsSqlDatabase } from 'dbcp/dist/format'
import { updateObjectProperties } from 'dbcp/dist/util'
import { runMapPhaseWithLevelDb } from './leveldb'
import { factoryConstruct, getObjectClassName } from './plugins'
import {
  defaultDiretory,
  defaultKeyProperty,
  defaultShuffleFormat,
  getUser,
  getWorkDirectory,
  immutableContext,
  inputshardFilenameFormat,
  localTempDirectoryPrefix,
  mapTransform,
  newJobId,
  reduceTransform,
  shuffleFilenameFormat,
  synchronizeMapFilenameFormat,
  synchronizeReduceFilenameFormat,
} from './runtime'
import { getSplits } from './splits'
import { InputSplit, Mapper, MapperImplementation, MapReduceRuntimeConfig, Reducer } from './types'

export async function mapReduce<Key, Value>(args: MapReduceRuntimeConfig<Key, Value>) {
  const keyProperty = args.configuration?.keyProperty || defaultKeyProperty
  const shuffleFormat = defaultShuffleFormat
  const user = getUser(args.configuration?.user)
  const jobid = args.jobid || newJobId(args.configuration?.name)
  const subdir = getWorkDirectory(user, jobid)
  const localDirectory = (args.localDirectory ?? defaultDiretory) + subdir
  const shuffleDirectory = (args.shuffleDirectory ?? defaultDiretory) + subdir
  const outputShards = args.outputShards || 1
  const isNullOutput = args.outputPath === '/dev/null'
  const runMapPhase = getMapperImplementation(args.mapperImplementation, !!args.combinerClass)

  // Validate input
  if (!localDirectory.endsWith('/')) throw new Error('localDirectory should end with slash')
  if (!shuffleDirectory.endsWith('/')) throw new Error('shuffleDirectory should end with slash')
  if (isNullOutput) {
    if (outputShards !== 1) throw new Error(`null output with outputShards ${outputShards}`)
    if (!args.unpatchMap && !args.unpatchReduce) {
      throw new Error(`null output without unpatchMap or unpatchReduce`)
    }
  }
  if (args.logger) {
    args.logger.info(`mapReduce configuration ${JSON.stringify(args.configuration ?? {})}`)
    if ((args.inputShardFilter || args.outputShardFilter) && !args.shuffleDirectory) {
      args.logger.info(`WARNING: no shuffleDirectory specified`)
    }
  }

  // Since local files show partial writes they need extra synchronization
  const isCloudStorageUrl =
    shuffleDirectory.startsWith('s3://') || shuffleDirectory.startsWith('gs://')
  if (args.synchronizeMap === undefined && !isCloudStorageUrl) {
    args.synchronizeMap = true
  }
  if (args.synchronizeReduce === undefined && !isCloudStorageUrl) {
    args.synchronizeReduce = true
  }

  // Find input splits
  if (!args.inputSplits) {
    args.inputSplits = inputIsSqlDatabase(args.inputType)
      ? new Array(args.inputShards || 1).fill({ url: '' })
      : await getSplits(args.fileSystem, args.inputPaths, args.inputSplitSize)
  }
  await args.fileSystem.ensureDirectory(shuffleDirectory)
  if (args.unpatchMap && args.logger) {
    args.logger.info(`Unpatching Mapper with inputSplits=${JSON.stringify(args.inputSplits)}`)
  }

  // map phase
  const runMap = args.runMap !== false && !args.unpatchMap
  for (let inputSplit = 0; runMap && inputSplit < args.inputSplits.length; inputSplit++) {
    if (args.inputShardFilter && !args.inputShardFilter(inputSplit)) continue
    const shard = { index: inputSplit, modulus: args.inputSplits.length }
    const inputshard = shardedFilename(inputshardFilenameFormat, shard)
    const currentSplit = args.inputSplits[inputSplit]
    const localDirectories = new Array(outputShards)
      .fill(localDirectory)
      .map((x, i) => x + `${localTempDirectoryPrefix}-input${inputSplit}-output${i}/`)
    const options: DatabaseCopyOptions = {
      ...assignDatabaseCopyOutputProperties(args, undefined),
      shardBy: keyProperty,
      inputFiles: inputIsSqlDatabase(args.inputType)
        ? undefined
        : [
            {
              url: currentSplit.url,
              fileOptions: currentSplit.parquetRowGroupRange
                ? {
                    rowGroupRange: currentSplit.parquetRowGroupRange,
                  }
                : currentSplit.byteOffsetRange
                ? {
                    byteOffset: currentSplit.byteOffsetRange[0],
                    byteLength: currentSplit.byteOffsetRange[1] - currentSplit.byteOffsetRange[0],
                  }
                : undefined,
            },
          ],
      inputShardIndex: inputSplit,
      orderBy: args.inputShardBy ? [args.inputShardBy] : undefined,
      // dir/shuffle-SSSS-of-NNNN.inputshard-0000-of-0004.jsonl.gz
      outputFile: isNullOutput
        ? undefined
        : (args.unpatchReduce ? args.outputPath : shuffleDirectory + `${shuffleFilenameFormat}`) +
          `.${inputshard}.${shuffleFormat}`,
      outputShards,
      outputStream: isNullOutput ? [openNullWritable()] : undefined,
      tempDirectories: localDirectories,
    }

    if (!args.mapperClass) throw new Error('No mapper')
    const mapper = factoryConstruct(args.mapperClass)
    if (mapper.configure) mapper.configure(args)
    if (mapper.setup) {
      await mapper.setup(immutableContext(args.configuration))
    }

    const combiner = args.combinerClass ? factoryConstruct(args.combinerClass) : undefined
    if (combiner?.configure) combiner.configure(args)
    if (combiner?.setup) {
      await combiner?.setup(immutableContext(args.configuration))
    }

    for (const directory of localDirectories) await args.fileSystem.ensureDirectory(directory)
    await runMapPhase(mapper, combiner, args, options)
    for (const directory of localDirectories) {
      await args.fileSystem.removeDirectory(directory, { recursive: true })
    }

    if (combiner?.cleanup) {
      await combiner.cleanup(immutableContext(args.configuration))
    }
    if (mapper.cleanup) {
      await mapper.cleanup(immutableContext(args.configuration))
    }
    if (args.synchronizeMap) {
      const filename = shardedFilename(shuffleDirectory + synchronizeMapFilenameFormat, shard)
      await writeJSON(args.fileSystem, filename, {
        success: true,
      })
      args.logger?.info(`Synchronize Mapper wrote ${filename}`)
    }
  }

  // reduce phase
  const runReduce = args.runReduce !== false && !args.unpatchReduce
  for (let outputShard = 0; runReduce && outputShard < outputShards; outputShard++) {
    if (args.outputShardFilter && !args.outputShardFilter(outputShard)) continue
    const shard = { index: outputShard, modulus: outputShards }
    const options = {
      ...assignDatabaseCopyOutputProperties({}, args),
      orderBy: [keyProperty],
      inputFiles: args.unpatchMap
        ? getMatchingInputSplits(args.inputSplits, shard).map((x) => ({
            url: x.url,
          }))
        : [
            {
              url:
                shuffleDirectory +
                shardedFilename(shuffleFilenameFormat, shard) +
                `.${inputshardFilenameFormat}.${shuffleFormat}`,
              inputShards: args.inputSplits.length,
            },
          ],
      outputFile: shardedFilename(args.outputPath, shard),
    }

    if (!args.unpatchMap) {
      const waitForUrl = args.synchronizeMap
        ? shuffleDirectory + synchronizeMapFilenameFormat
        : options.inputFiles[0].url
      args.logger?.debug(`Wait for ${waitForUrl}@${args.inputSplits.map((x) => x.url)}`)
      await waitForCompleteShardedInput(args.fileSystem, waitForUrl, {
        shards: args.inputSplits.length,
      })
      args.logger?.debug(`Found ${waitForUrl}`)
    }

    if (!args.reducerClass) throw new Error('No reducer')
    const reducer = factoryConstruct(args.reducerClass)
    if (reducer.configure) reducer.configure(args)
    if (reducer.setup) {
      await reducer.setup(immutableContext(args.configuration))
    }
    await runReducePhase(reducer, args, options)
    if (reducer.cleanup) {
      await reducer.cleanup(immutableContext(args.configuration))
    }
    if (args.synchronizeReduce) {
      const filename = shardedFilename(shuffleDirectory + synchronizeReduceFilenameFormat, shard)
      await writeJSON(args.fileSystem, filename, {
        success: true,
      })
      args.logger?.info(`Synchronize Reducer wrote ${filename}`)
    }
  }

  // cleanup phase
  if (args.cleanup !== false) {
    await runCleanupPhase(
      {
        inputShards: args.inputSplits.length,
        outputShards,
        runMap,
        runReduce,
        shuffleDirectory,
        shuffleFormat,
      },
      args
    )
  }
}

export function getMapperImplementation(type?: MapperImplementation, hasCombiner?: boolean) {
  switch (type) {
    case MapperImplementation.externalSorting:
      return runMapPhaseWithExternalSorting
    case MapperImplementation.leveldb:
      return runMapPhaseWithLevelDb
    default:
      return hasCombiner ? runMapPhaseWithLevelDb : runMapPhaseWithExternalSorting
  }
}

export function getMatchingInputSplits(inputSplits: InputSplit[], outputShard: Shard) {
  return inputSplits.filter((inputSplit) => {
    if (!inputSplit.numShards || inputSplit.shardIndex === undefined) return true
    if (outputShard.modulus === inputSplit.numShards) {
      return inputSplit.shardIndex === outputShard.index
    }
    if (
      inputSplit.numShards % outputShard.modulus !== 0 &&
      outputShard.modulus % inputSplit.numShards !== 0
    ) {
      throw new Error(
        `Can't match ${JSON.stringify(inputSplit)} with ${JSON.stringify(outputShard)}}`
      )
    }
    if (inputSplit.numShards < outputShard.modulus) {
      const N = outputShard.modulus / inputSplit.numShards
      for (let i = 0; i < N; i++) {
        if (outputShard.index === inputSplit.shardIndex + i * inputSplit.numShards) return true
      }
    } else {
      const N = inputSplit.numShards / outputShard.modulus
      for (let i = 0; i < N; i++) {
        if (inputSplit.shardIndex === outputShard.index + i * outputShard.modulus) return true
      }
    }
    return false
  })
}

export async function runReducePhase<Key, Value>(
  reducer: Reducer<Key, Value>,
  args: MapReduceRuntimeConfig<Key, Value>,
  options: DatabaseCopyOptions
) {
  options = {
    ...options,
    group: true,
    groupLabels: true,
    outputShards: undefined,
  }
  if (args.logger) {
    args.logger.info(
      `runReducePhase ${getObjectClassName(reducer) || 'reduce'} ${JSON.stringify({
        ...options,
        fileSystem: {},
      })}`
    )
  }
  await dbcp({
    ...options,
    fileSystem: args.fileSystem,
    transformObjectStream: () =>
      reduceTransform(reducer, { configuration: args.configuration, logger: args.logger }),
  })
}

export async function runMapPhaseWithExternalSorting<Key, Value>(
  mapper: Mapper<Key, Value>,
  combiner: Reducer<Key, Value> | undefined,
  args: MapReduceRuntimeConfig<Key, Value>,
  options: DatabaseCopyOptions
) {
  const keyProperty = options.shardBy!
  const dontSort =
    args.unpatchReduce &&
    (args.outputShardFunction === DatabaseCopyShardFunction.random ||
      args.outputShardFunction === DatabaseCopyShardFunction.roundrobin)
  options = {
    ...options,
    externalSortBy: dontSort ? undefined : [keyProperty],
  }
  if (combiner) {
    throw new Error(`MapperImplementation.externalSorting doesn't support combiners`)
  }
  if (args.logger) {
    args.logger.info(
      `runMapPhaseWithExternalSorting ${getObjectClassName(mapper) || 'map'} ${JSON.stringify({
        ...options,
        fileSystem: {},
      })}`
    )
  }
  await dbcp({
    ...options,
    fileSystem: args.fileSystem,
    inputFiles: updateObjectProperties(options.inputFiles, (x) => ({
      ...x,
      transformInputObjectStream: () =>
        mapTransform(mapper, {
          configuration: args.configuration,
          logger: args.logger,
        }),
    })),
  })
}

export async function runCleanupPhase<Key, Value>(
  args: {
    inputShards: number
    outputShards: number
    runMap: boolean
    runReduce: boolean
    shuffleDirectory: string
    shuffleFormat: string
  },
  options: MapReduceRuntimeConfig<Key, Value>
) {
  if (!options.unpatchMap && !options.unpatchReduce) {
    for (let outputShard = 0; outputShard < args.outputShards; outputShard++) {
      if (options.outputShardFilter && !options.outputShardFilter(outputShard)) continue
      const shard = { index: outputShard, modulus: args.outputShards }
      for (let inputShard = 0; inputShard < args.inputShards; inputShard++) {
        await options.fileSystem.removeFile(
          args.shuffleDirectory +
            shardedFilename(shuffleFilenameFormat, shard) +
            '.' +
            shardedFilename(inputshardFilenameFormat, {
              index: inputShard,
              modulus: args.inputShards,
            }) +
            `.${args.shuffleFormat}`
        )
      }
    }
  }

  if (!options.outputShardFilter || options.outputShardFilter(0)) {
    if (args.runReduce && options.synchronizeReduce) {
      await waitForCompleteShardedInput(
        options.fileSystem,
        args.shuffleDirectory + synchronizeReduceFilenameFormat,
        {
          shards: args.outputShards,
        }
      )
    } else if (options.unpatchReduce && args.runMap && options.synchronizeMap) {
      await waitForCompleteShardedInput(
        options.fileSystem,
        args.shuffleDirectory + synchronizeMapFilenameFormat,
        {
          shards: args.inputShards,
        }
      )
    }

    if (args.runMap && options.synchronizeMap) {
      for (let inputShard = 0; inputShard < args.inputShards; inputShard++) {
        const shard = { index: inputShard, modulus: args.inputShards }
        await options.fileSystem.removeFile(
          shardedFilename(args.shuffleDirectory + synchronizeMapFilenameFormat, shard)
        )
      }
    }
    if (args.runReduce && options.synchronizeReduce) {
      for (let outputShard = 0; outputShard < args.outputShards; outputShard++) {
        const shard = { index: outputShard, modulus: args.outputShards }
        await options.fileSystem.removeFile(
          shardedFilename(args.shuffleDirectory + synchronizeReduceFilenameFormat, shard)
        )
      }
    }
  }
}
