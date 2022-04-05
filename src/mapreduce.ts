import { writeJSON } from '@wholebuzz/fs/lib/json'
import { handleAsyncFunctionCallback } from '@wholebuzz/fs/lib/stream'
import {
  isShardedFilename,
  readShardFilenames,
  shardedFilename,
  waitForCompleteShardedInput,
} from '@wholebuzz/fs/lib/util'
import { assignDatabaseCopyOutputProperties, DatabaseCopyOptions, dbcp } from 'dbcp'
import { DatabaseCopyShardFunction, inputIsSqlDatabase } from 'dbcp/dist/format'
import { updateObjectProperties } from 'dbcp/dist/util'
import { Transform } from 'stream'
import { runMapPhaseWithLevelDb } from './leveldb'
import { factoryConstruct, getObjectClassName, getSubPropertyAccessor } from './plugins'
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
export const defaultValueProperty = ''
export const unknownWriteProperty = 'value'
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
  if (args.logger) {
    args.logger.info(`mapReduce configuration ${JSON.stringify(args.configuration ?? {})}`)
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
  const inputSplits: string[] = []
  for (const path of args.inputPaths) {
    if (isShardedFilename(path)) {
      const numShards = (await readShardFilenames(args.fileSystem, path)).numShards
      for (let i = 0; i < numShards; i++) {
        inputSplits.push(shardedFilename(args.inputPaths[0], { index: i, modulus: numShards }))
      }
    } else {
      inputSplits.push(path)
    }
  }
  await args.fileSystem.ensureDirectory(shuffleDirectory)

  // map phase
  const runMap = args.runMap !== false && !args.unpatchMap
  for (let inputSplit = 0; runMap && inputSplit < inputSplits.length; inputSplit++) {
    if (args.inputShardFilter && !args.inputShardFilter(inputSplit)) continue
    const shard = { index: inputSplit, modulus: inputSplits.length }
    const inputshard = shardedFilename(inputshardFilenameFormat, shard)
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
              url: inputSplits[inputSplit],
            },
          ],
      // dir/shuffle-SSSS-of-NNNN.inputshard-0000-of-0004.jsonl.gz
      outputFile:
        (args.unpatchReduce ? args.outputPath : shuffleDirectory + `${shuffleFilenameFormat}`) +
        `.${inputshard}.${shuffleFormat}`,
      outputShards,
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
        ? inputSplits.map((x) => ({
            url: x,
          }))
        : [
            {
              url:
                shuffleDirectory +
                shardedFilename(shuffleFilenameFormat, shard) +
                `.${inputshardFilenameFormat}.${shuffleFormat}`,
              inputShards: inputSplits.length,
            },
          ],
      outputFile: shardedFilename(args.outputPath, shard),
    }

    const waitForUrl = args.synchronizeMap
      ? shuffleDirectory + synchronizeMapFilenameFormat
      : options.inputFiles[0].url
    args.logger?.debug(`Wait for ${waitForUrl}@${inputSplits}`)
    await waitForCompleteShardedInput(args.fileSystem, waitForUrl, {
      shards: inputSplits.length,
    })
    args.logger?.debug(`Found ${waitForUrl}`)

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
        inputShards: inputSplits.length,
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
  const output: Item =
    typeof value === 'object'
      ? { ...value }
      : { [context.valueProperty || unknownWriteProperty]: value }
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
  const valueProperty = configuration?.valueProperty ?? defaultValueProperty
  const context: MapContext<Key, Value> = {
    configuration,
    currentItem: {},
    currentValue: undefined!,
    inputKeyProperty: configuration.inputKeyProperty ?? keyProperty,
    inputValueProperty: configuration.inputValueProperty ?? valueProperty,
    keyProperty,
    valueProperty,
    write: (key: Key, value: any) =>
      transform.push(mappedObject(key, value, context, args?.transform)),
  }
  const getItemKey = getItemKeyAccessor(context.inputKeyProperty)
  const getItemValue = getItemValueAccessor(context.inputValueProperty)
  transform = new Transform({
    objectMode: true,
    transform(data: Item, _, callback) {
      context.currentItem = data
      context.currentKey = getItemKey(context.currentItem)
      context.currentValue = getItemValue(context.currentItem)
      const running = mapper.map(context.currentKey!, context.currentValue, context)
      handleAsyncFunctionCallback(running, callback)
    },
  })
  return transform
}

export function reduceTransform<Key, Value>(
  reducer: Reducer<Key, Value>,
  args: { configuration?: Configuration; transform?: (value: Item) => Item }
) {
  let transform!: Transform
  const configuration = args?.configuration ?? {}
  const context: ReduceContext<Key, Value> = {
    configuration,
    currentItem: [],
    currentValue: [],
    keyProperty: configuration.keyProperty ?? defaultKeyProperty,
    valueProperty: configuration.valueProperty ?? defaultValueProperty,
    write: (key: Key, value: any) => {
      if (key !== context.currentKey) throw new Error(`Reducer can't change key`)
      transform.push(mappedObject(key, value, context, args?.transform))
    },
  }
  const getItemKey = getItemKeyAccessor(context.keyProperty)
  const getItemValue = getItemValueAccessor(context.valueProperty)
  transform = new Transform({
    objectMode: true,
    transform(data, _, callback) {
      context.currentItem = Array.isArray(data)
        ? data.map((x: { source: string; value: Record<string, any> }) => x.value)
        : [data]
      context.currentKey = getItemKey(context.currentItem[0])
      context.currentValue = context.currentItem.map(getItemValue)
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
      `runReducePhase ${getObjectClassName(reducer) || 'reduce'} ${JSON.stringify(options)}`
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
  args: {
    inputShards: number
    outputShards: number
    runMap: boolean
    runReduce: boolean
    shuffleDirectory: string
    shuffleFormat: string
  },
  options: MapReduceJobConfig<Key, Value>
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

export const getItemKeyAccessor = (inputKeyProperty?: string) =>
  inputKeyProperty ? getSubPropertyAccessor(inputKeyProperty) : () => undefined

export const getItemValueAccessor = (inputValueProperty?: string) =>
  inputValueProperty ? getSubPropertyAccessor(inputValueProperty) : (x: any) => x
