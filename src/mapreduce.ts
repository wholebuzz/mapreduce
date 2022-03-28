import { writeJSON } from '@wholebuzz/fs/lib/json'
import { handleAsyncFunctionCallback } from '@wholebuzz/fs/lib/stream'
import {
  isShardedFilename,
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
  Context,
  Item,
  MapContext,
  Mapper,
  MapperImplementation,
  MapReduceJobConfig,
  ReduceContext,
  Reducer,
} from './types'

export const defaultDiretory = './'
export const defaultKeyProperty = 'key'
export const defaultValueProperty = 'value'
export const defaultShuffleFormat = 'jsonl.gz'
export const shuffleFilenameFormat = 'shuffle-SSSS-of-NNNN'
export const inputshardFilenameFormat = 'inputshard-SSSS-of-NNNN'
export const synchronizeMapFilenameFormat = 'map-done-SSSS-of-NNNN.json'
export const synchronizeReduceFilenameFormat = 'reduce-done-SSSS-of-NNNN.json'
export const localTempDirectoryPrefix = 'maptmp'

export async function mapReduce<Key, Value>(args: MapReduceJobConfig<Key, Value>) {
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
  const inputShards: string[] = []
  for (const path of args.inputPaths) {
    if (isShardedFilename(path)) {
      const numShards = (await readShardFilenames(args.fileSystem, path)).numShards
      for (let i = 0; i < numShards; i++) {
        inputShards.push(shardedFilename(args.inputPaths[0], { index: i, modulus: numShards }))
      }
    } else {
      inputShards.push(path)
    }
  }

  // map phase
  let skippedMapper = !!args.skipMapper
  const runMapper = args.runMapper !== false && !skippedMapper
  for (let inputShard = 0; runMapper && inputShard < inputShards.length; inputShard++) {
    if (args.inputShardFilter && !args.inputShardFilter(inputShard)) continue
    const shard = { index: inputShard, modulus: inputShards.length }
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
              url: inputShards[inputShard],
            },
          ],
      outputFile: shuffleDirectory + `${shuffleFilenameFormat}.${inputshard}.${shuffleFormat}`,
      outputShards,
      tempDirectories: localDirectories,
    }

    if (!args.mapperClass) throw new Error('No mapper')
    const mapper = factoryConstruct(args.mapperClass)
    if (getObjectClassName(mapper) === 'IdentityMapper' && inputShards.length === outputShards) {
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
          inputShards: inputShards.length,
        },
      ],
      outputFile: shardedFilename(args.outputPath, shard),
    }

    const waitForUrl = args.synchronizeMap
      ? shuffleDirectory + synchronizeMapFilenameFormat
      : options.inputFiles[0].url
    console.log(`Wait for ${waitForUrl}@${inputShards}`)
    await waitForCompleteShardedInput(args.fileSystem, waitForUrl, {
      shards: inputShards.length,
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
    await runCleanupPhase(shuffleDirectory, shuffleFormat, inputShards.length, outputShards, args)
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
  configuration: configuration ?? {},
  currentItem: {},
  keyProperty: '',
  valueProperty: '',
  write: () => {
    throw new Error()
  },
})

export function mappedObject<Key, Value>(
  key: Key,
  value: any,
  context: Context<Key, Value>,
  transform?: (value: Item) => Item
): Item {
  const output: Item = typeof value === 'object' ? { ...value } : { [context.valueProperty]: value }
  if (context.keyProperty) output[context.keyProperty] = key
  return transform ? transform(output) : output
}

export function mapTransform<Key, Value>(
  mapper: Mapper<Key, Value>,
  args?: {
    configuration?: Configuration
    transform?: (value: Item) => Item
  }
) {
  let transform!: Transform
  const configuration = args?.configuration ?? {}
  const keyProperty = configuration?.keyProperty ?? defaultKeyProperty
  const valueProperty = configuration?.valueProperty ?? defaultKeyProperty
  const context: MapContext<Key, Value> = {
    configuration,
    currentItem: {},
    currentValue: undefined!,
    inputKeyProperty: configuration.inputKeyProperty ?? keyProperty,
    inputValueProperty: configuration.inputValueProperty,
    keyProperty,
    valueProperty,
    write: (key: Key, value: any) =>
      transform.push(mappedObject(key, value, context, args?.transform)),
  }
  const getInputItemKey = context.inputKeyProperty
    ? (x: Item) => x[context.inputKeyProperty!]
    : () => undefined
  transform = new Transform({
    objectMode: true,
    transform(data, _, callback) {
      context.currentItem = data
      context.currentKey = getInputItemKey(context.currentItem)
      context.currentValue = context.inputValueProperty ? data[context.inputValueProperty] : data
      const running = mapper.map(context.currentKey!, context.currentValue, context)
      handleAsyncFunctionCallback(running, callback)
    },
  })
  return transform
}

export function reduceTransform<Key, Value>(
  reducer: Reducer<Key, Value>,
  args: { configuration?: Configuration }
) {
  let transform!: Transform
  const configuration = args?.configuration ?? {}
  const context: ReduceContext<Key, Value> = {
    configuration,
    currentItem: [],
    currentValue: [],
    keyProperty: configuration.keyProperty ?? defaultKeyProperty,
    valueProperty: configuration.valueProperty ?? defaultValueProperty,
    write: (key: Key, value: Value) => {
      if (key !== context.currentKey) throw new Error(`Reducer can't change key`)
      transform.push(value)
    },
  }
  transform = new Transform({
    objectMode: true,
    transform(data, _, callback) {
      context.currentItem = Array.isArray(data)
        ? data.map((x: { source: string; value: Record<string, any> }) => x.value)
        : [data]
      context.currentKey = context.currentItem[0][context.keyProperty]
      context.currentValue = context.currentItem as any
      const running = reducer.reduce(context.currentKey!, context.currentValue, context)
      handleAsyncFunctionCallback(running, callback)
    },
  })
  return transform
}

export async function runReducePhase<Key, Value>(
  reducer: Reducer<Key, Value>,
  args: MapReduceJobConfig<Key, Value>,
  options: DatabaseCopyOptions
) {
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
    transformObjectStream: () => reduceTransform(reducer, { configuration: args.configuration }),
  })
}

export async function runMapPhaseWithExternalSorting<Key, Value>(
  mapper: Mapper<Key, Value>,
  combiner: Reducer<Key, Value> | undefined,
  args: MapReduceJobConfig<Key, Value>,
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
    args.logger.info(
      `runMapPhaseWithExternalSorting ${getObjectClassName(mapper) || 'map'} ${JSON.stringify(
        options
      )}`
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
        }),
    })),
  })
}

export async function runCleanupPhase<Key, Value>(
  shuffleDirectory: string,
  shuffleFormat: string,
  inputShards: number,
  outputShards: number,
  args: MapReduceJobConfig<Key, Value>
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
