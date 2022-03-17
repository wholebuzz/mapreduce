import { handleAsyncFunctionCallback } from '@wholebuzz/fs/lib/stream'
import { readShardFilenames, shardedFilename } from '@wholebuzz/fs/lib/util'
import { DatabaseCopyOptions, dbcp } from 'dbcp'
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
export const localTempDirectoryPrefix = 'maptmp'
export const defaultDiretory = './'

export async function mapReduce(args: MapReduceJobConfig) {
  const keyProperty = args.configuration?.keyProperty || defaultKeyProperty
  const shuffleFormat = defaultShuffleFormat
  const user = args.configuration?.user || process.env.USER || 'mr-user'
  const jobid = args.jobid || (args.configuration?.name || 'mr-job') + `-${new Date().getTime()}`
  const subdir = `taskTracker/${user}/jobcache/${jobid}/work/`
  const localDirectory = (args.localDirectory ?? defaultDiretory) + subdir
  const shuffleDirectory = (args.shuffleDirectory ?? defaultDiretory) + subdir
  const targetShards = args.outputShards || 1
  const localDirectories = new Array(targetShards)
    .fill(localDirectory)
    .map((x, i) => x + `${localTempDirectoryPrefix}${i}/`)
  const runMapPhase = getMapperImplementation(args.mapperImplementation)

  // Validate input
  if (!localDirectory.endsWith('/')) throw new Error('localDirectory should end with slash')
  if (!shuffleDirectory.endsWith('/')) throw new Error('shuffleDirectory should end with slash')
  if (args.inputPaths.length !== 1) {
    throw new Error('Only one (sharded) input is currently supported')
  }
  if (args.logger) {
    args.logger.info(`mapReduce configuration ${JSON.stringify(args.configuration ?? {})}`)
  }

  // Find source shards and prepare temp directories
  const sourceShards = (await readShardFilenames(args.fileSystem, args.inputPaths[0])).numShards
  for (const directory of localDirectories) await args.fileSystem.ensureDirectory(directory)

  // map phase
  for (let sourceShard = 0; sourceShard < sourceShards; sourceShard++) {
    if (args.inputShardFilter && !args.inputShardFilter(sourceShard)) continue
    const shard = { index: sourceShard, modulus: sourceShards }
    const inputshard = shardedFilename(inputshardFilenameFormat, shard)
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
    const options: DatabaseCopyOptions = {
      ...args.inputSource,
      shardBy: keyProperty,
      sourceFiles: [
        {
          url: shardedFilename(args.inputPaths[0], shard),
        },
      ],
      sourceFormat: args.inputFormat,
      targetFile: shuffleDirectory + `${shuffleFilenameFormat}.${inputshard}.${shuffleFormat}`,
      targetShards,
      tempDirectories: localDirectories,
    }
    await runMapPhase(mapper, combiner, args, options)
    if (combiner?.cleanup) {
      await combiner.cleanup(immutableContext(args.configuration))
    }
    if (mapper.cleanup) {
      await mapper.cleanup(immutableContext(args.configuration))
    }
  }

  // reduce phase
  for (let targetShard = 0; targetShard < targetShards; targetShard++) {
    if (args.outputShardFilter && !args.outputShardFilter(targetShard)) continue
    const shard = { index: targetShard, modulus: targetShards }
    const reducer = factoryConstruct(args.reducerClass)
    if (reducer.configure) reducer.configure(args)
    if (reducer.setup) {
      await reducer.setup(immutableContext(args.configuration))
    }
    const options = {
      ...args.outputTarget,
      orderBy: [keyProperty],
      sourceFiles: [
        {
          url:
            shuffleDirectory +
            shardedFilename(shuffleFilenameFormat, shard) +
            `.${inputshardFilenameFormat}.${shuffleFormat}`,
          sourceShards,
        },
      ],
      targetFile: shardedFilename(args.outputPath, shard),
    }
    await runReducePhase(reducer, args, options)

    if (reducer.cleanup) {
      await reducer.cleanup(immutableContext(args.configuration))
    }
  }

  // cleanup phase
  if (args.cleanup !== false) {
    for (let targetShard = 0; targetShard < targetShards; targetShard++) {
      if (args.outputShardFilter && !args.outputShardFilter(targetShard)) continue
      for (let sourceShard = 0; sourceShard < sourceShards; sourceShard++) {
        if (args.inputShardFilter && !args.inputShardFilter(sourceShard)) continue
        await args.fileSystem.removeFile(
          shuffleDirectory +
            shardedFilename(shuffleFilenameFormat, { index: targetShard, modulus: targetShards }) +
            '.' +
            shardedFilename(inputshardFilenameFormat, {
              index: sourceShard,
              modulus: sourceShards,
            }) +
            `.${shuffleFormat}`
        )
      }
    }
  }
}

export function getMapperImplementation(type?: MapperImplementation) {
  switch (type) {
    case MapperImplementation.externalSorting:
    default:
      return runMapPhaseWithExternalSorting
    case MapperImplementation.leveldb:
      return runMapPhaseWithLevelDb
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
    sourceFiles: updateObjectProperties(options.sourceFiles, (x) => ({
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
