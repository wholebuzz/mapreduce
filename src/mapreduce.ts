import { writeJSON } from '@wholebuzz/fs/lib/json'
import { handleAsyncFunctionCallback } from '@wholebuzz/fs/lib/stream'
import {
  readShardFilenames,
  shardedFilename,
  waitForCompleteShardedInput,
} from '@wholebuzz/fs/lib/util'
import { assignDatabaseCopyOutputProperties, DatabaseCopyOptions, dbcp } from 'dbcp'
import { inputIsSqlDatabase } from 'dbcp/dist/format'
import { updateObjectProperties } from 'dbcp/dist/util'
import { Transform } from 'stream'
import { runMapPhaseWithLevelDb } from './leveldb'
import { factoryConstruct, getObjectClassName } from './plugins'
import {
  Configuration,
  Key,
  KeyGetter,
  Mapper,
  MapperImplementation,
  MapReduceJobConfig,
  Reducer,
  Value,
} from './types'

export const defaultKeyProperty = '_key'
export const defaultShuffleFormat = 'jsonl.gz'
export const shuffleFilenameFormat = 'shuffle-SSSS-of-NNNN'
export const inputshardFilenameFormat = 'inputshard-SSSS-of-NNNN'
export const synchronizeMapFilenameFormat = 'map-done-SSSS-of-NNNN.json'
export const synchronizeReduceFilenameFormat = 'reduce-done-SSSS-of-NNNN.json'
export const localTempDirectoryPrefix = 'maptmp'
export const defaultDiretory = './'

export async function mapReduce(args: MapReduceJobConfig) {
  const keyProperty = args.configuration?.keyProperty || defaultKeyProperty
  const shuffleFormat = defaultShuffleFormat
  const user = getUser(args.configuration?.user)
  const jobid = args.jobid || newJobId(args.configuration?.name)
  const subdir = getWorkDirectory(user, jobid)
  const localDirectory = (args.localDirectory ?? defaultDiretory) + subdir
  const shuffleDirectory = (args.shuffleDirectory ?? defaultDiretory) + subdir
  const outputShards = args.outputShards || 1
  const runMapPhase = getMapperImplementation(args.mapperImplementation, !!args.combinerClass)

  // Validate input
  if (!localDirectory.endsWith('/')) throw new Error('localDirectory should end with slash')
  if (!shuffleDirectory.endsWith('/')) throw new Error('shuffleDirectory should end with slash')
  if (args.inputPaths.length !== 1) {
    throw new Error('Only one (sharded) input is currently supported')
  }
  if (args.logger) {
    args.logger.info(`mapReduce configuration ${JSON.stringify(args.configuration ?? {})}`)
  }

  // Since local file show partial writes they need extra synchronization
  const isCloudStorageUrl =
    shuffleDirectory.startsWith('s3://') || shuffleDirectory.startsWith('gs://')
  if (args.synchronizeMap === undefined && !isCloudStorageUrl) {
    args.synchronizeMap = true
  }
  if (args.synchronizeReduce === undefined && !isCloudStorageUrl) {
    args.synchronizeReduce = true
  }

  // Find input shards
  const inputShards = (await readShardFilenames(args.fileSystem, args.inputPaths[0])).numShards

  // map phase
  let skippedMapper = !!args.skipMapper
  const runMapper = args.runMapper !== false && !skippedMapper
  for (let inputShard = 0; runMapper && inputShard < inputShards; inputShard++) {
    if (args.inputShardFilter && !args.inputShardFilter(inputShard)) continue
    const shard = { index: inputShard, modulus: inputShards }
    const inputshard = shardedFilename(inputshardFilenameFormat, shard)
    const localDirectories = new Array(outputShards)
      .fill(localDirectory)
      .map((x, i) => x + `${localTempDirectoryPrefix}-input${inputShard}-output${i}/`)
    const options: DatabaseCopyOptions = {
      ...assignDatabaseCopyOutputProperties(args, undefined),
      shardBy: keyProperty,
      inputFiles: inputIsSqlDatabase(args.inputType)
        ? undefined
        : [
            {
              url: shardedFilename(args.inputPaths[0], shard),
            },
          ],
      outputFile: shuffleDirectory + `${shuffleFilenameFormat}.${inputshard}.${shuffleFormat}`,
      outputShards,
      tempDirectories: localDirectories,
    }

    if (!args.mapperClass) throw new Error('No mapper')
    const mapper = factoryConstruct(args.mapperClass)
    if (getObjectClassName(mapper) === 'IdentityMapper' && inputShards === outputShards) {
      if (args.skipMapper || args.autoSkipMapper) {
        skippedMapper = true
        break
      } else {
        args.logger?.info(`Using IdentityMapper with equal input and output shards`)
        args.logger?.info(`Consider using skipMapper or autoSkipMapper`)
      }
    }
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
  const skippedReducer = !!args.skipReducer
  const runReducer = args.runReducer !== false && !skippedReducer
  for (let outputShard = 0; runReducer && outputShard < outputShards; outputShard++) {
    if (args.outputShardFilter && !args.outputShardFilter(outputShard)) continue
    const shard = { index: outputShard, modulus: outputShards }
    const options = {
      ...assignDatabaseCopyOutputProperties({}, args),
      orderBy: [keyProperty],
      inputFiles: [
        {
          url:
            shuffleDirectory +
            shardedFilename(shuffleFilenameFormat, shard) +
            `.${inputshardFilenameFormat}.${shuffleFormat}`,
          inputShards,
        },
      ],
      outputFile: shardedFilename(args.outputPath, shard),
    }

    const waitForUrl = args.synchronizeMap
      ? shuffleDirectory + synchronizeMapFilenameFormat
      : options.inputFiles[0].url
    console.log(`Wait for ${waitForUrl}@${inputShards}`)
    await waitForCompleteShardedInput(args.fileSystem, waitForUrl, {
      shards: inputShards,
    })
    console.log(`Found ${waitForUrl}`)

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
    await runCleanupPhase(shuffleDirectory, shuffleFormat, inputShards, outputShards, args)
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

export const immutableContext = (configuration?: Configuration) => ({
  configuration,
  write: () => {
    throw new Error()
  },
})

export function mappedObject(
  key: Key,
  value: any,
  args: {
    keyProperty?: string
    transform?: (value: Value) => Value
  }
): Value {
  const output: Value = typeof value === 'object' ? { ...value } : { value }
  if (args.keyProperty) output[args.keyProperty] = key
  return args?.transform ? args.transform(output) : output
}

export const mapTransform = (
  mapper: Mapper,
  args?: {
    configuration?: Configuration
    getInputKey?: KeyGetter
    keyProperty?: string
    transform?: (value: Value) => Value
  }
) =>
  new Transform({
    objectMode: true,
    transform(data, _, callback) {
      const running = mapper.map(args?.getInputKey?.(data) ?? '', data, {
        configuration: args?.configuration,
        write: (key: Key, value: any) =>
          this.push(
            mappedObject(key, value, {
              keyProperty: mapper.keyProperty ?? args?.keyProperty,
              transform: args?.transform,
            })
          ),
      })
      handleAsyncFunctionCallback(running, callback)
    },
  })

export const reduceTransform = (
  reducer: Reducer,
  args: { configuration?: Configuration; keyProperty: string }
) =>
  new Transform({
    objectMode: true,
    transform(data, _, callback) {
      const reduceKey = data[0].value[args.keyProperty]
      const running = reducer.reduce(
        reduceKey,
        data.map((x: { source: string; value: Record<string, any> }) => x.value),
        {
          configuration: args.configuration,
          write: (key: Key, value: Value) => {
            if (key !== reduceKey) throw new Error(`Reducer can't change key`)
            this.push(value)
          },
        }
      )
      handleAsyncFunctionCallback(running, callback)
    },
  })

export async function runReducePhase(
  reducer: Reducer,
  args: MapReduceJobConfig,
  options: DatabaseCopyOptions
) {
  const keyProperty = options.orderBy![0]
  options = {
    ...options,
    group: true,
    groupLabels: true,
  }
  if (args.logger) {
    args.logger.info(
      `mapReduce ${getObjectClassName(reducer) || 'reduce'} ${JSON.stringify(options)}`
    )
  }
  await dbcp({
    ...options,
    fileSystem: args.fileSystem,
    transformObjectStream: () =>
      reduceTransform(reducer, { configuration: args.configuration, keyProperty }),
  })
}

export async function runMapPhaseWithExternalSorting(
  mapper: Mapper,
  combiner: Reducer | undefined,
  args: MapReduceJobConfig,
  options: DatabaseCopyOptions
) {
  const keyProperty = options.shardBy!
  options = {
    ...options,
    externalSortBy: [keyProperty],
  }
  if (combiner) {
    throw new Error(`MapperImplementation.externalSorting doesn't support combiners`)
  }
  if (args.logger) {
    args.logger.info(`mapReduce ${getObjectClassName(mapper) || 'map'} ${JSON.stringify(options)}`)
  }
  await dbcp({
    ...options,
    fileSystem: args.fileSystem,
    inputFiles: updateObjectProperties(options.inputFiles, (x) => ({
      ...x,
      transformInputObjectStream: () =>
        mapTransform(mapper, {
          configuration: args.configuration,
          keyProperty,
          getInputKey: args.inputKeyGetter ?? ((v) => v[keyProperty]),
        }),
    })),
  })
}

export async function runCleanupPhase(
  shuffleDirectory: string,
  shuffleFormat: string,
  inputShards: number,
  outputShards: number,
  args: MapReduceJobConfig
) {
  for (let outputShard = 0; outputShard < outputShards; outputShard++) {
    if (args.outputShardFilter && !args.outputShardFilter(outputShard)) continue
    const shard = { index: outputShard, modulus: outputShards }
    for (let inputShard = 0; inputShard < inputShards; inputShard++) {
      await args.fileSystem.removeFile(
        shuffleDirectory +
          shardedFilename(shuffleFilenameFormat, shard) +
          '.' +
          shardedFilename(inputshardFilenameFormat, {
            index: inputShard,
            modulus: inputShards,
          }) +
          `.${shuffleFormat}`
      )
    }
  }

  if (!args.outputShardFilter || args.outputShardFilter(0)) {
    if (args.synchronizeReduce) {
      await waitForCompleteShardedInput(
        args.fileSystem,
        shuffleDirectory + synchronizeReduceFilenameFormat,
        {
          shards: outputShards,
        }
      )
      for (let inputShard = 0; inputShard < inputShards; inputShard++) {
        const shard = { index: inputShard, modulus: inputShards }
        await args.fileSystem.removeFile(
          shardedFilename(shuffleDirectory + synchronizeMapFilenameFormat, shard)
        )
      }
    }
    if (args.synchronizeMap) {
      for (let outputShard = 0; outputShard < outputShards; outputShard++) {
        const shard = { index: outputShard, modulus: outputShards }
        await args.fileSystem.removeFile(
          shardedFilename(shuffleDirectory + synchronizeReduceFilenameFormat, shard)
        )
      }
    }
  }
}

export function newJobId(name?: string) {
  return (name || 'mr-job') + `-${new Date().getTime()}`
}

export function getUser(user?: string) {
  return user || process.env.USER || 'mr-user'
}

export function getWorkDirectory(user: string, jobid: string) {
  return `taskTracker/${user}/jobcache/${jobid}/work/`
}

export function getShardFilter(workerIndex: number, numWorkers: number) {
  return numWorkers > 1 ? (index: number) => index % numWorkers === workerIndex : undefined
}
