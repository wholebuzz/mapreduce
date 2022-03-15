import { handleAsyncFunctionCallback } from '@wholebuzz/fs/lib/stream'
import { readShardFilenames, shardedFilename } from '@wholebuzz/fs/lib/util'
import { dbcp } from 'dbcp'
import level from 'level'
import { LevelUp } from 'levelup'
import { Transform } from 'stream'
import { factoryConstruct, getObjectClassName } from './plugins'
import { Configuration, Key, KeyGetter, Mapper, MapReduceJobConfig, Reducer, Value } from './types'

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
  const sourceGetKey = args.inputKeyGetter ?? ((x) => x[keyProperty])
  const targetShards = args.outputShards || 1
  const localDirectories = new Array(targetShards)
    .fill(localDirectory)
    .map((x, i) => x + `${localTempDirectoryPrefix}${i}`)

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
    const options = {
      ...args.inputSource,
      sourceFiles: [
        {
          url: shardedFilename(args.inputPaths[0], shard),
        },
      ],
      sourceFormat: args.inputFormat,
      targetFile: shuffleDirectory + `${shuffleFilenameFormat}.${inputshard}.${shuffleFormat}`,
      targetShards,
      externalSortBy: [keyProperty],
      shardBy: keyProperty,
      tempDirectories: localDirectories,
    }
    if (args.logger) {
      args.logger.info(
        `mapReduce ${getObjectClassName(mapper) || 'map'} ${JSON.stringify(options)}`
      )
    }
    await dbcp({
      ...options,
      fileSystem: args.fileSystem,
      sourceFiles: options.sourceFiles.map((x) => ({
        ...x,
        transformInputObjectStream: () =>
          mapTransform(mapper, {
            configuration: args.configuration,
            keyProperty,
            getInputKey: sourceGetKey,
          }),
      })),
    })
    if (mapper.cleanup) {
      await mapper.cleanup(immutableContext(args.configuration))
    }
  }

  // shuffle phase

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
      group: true,
      groupLabels: true,
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

export const mapAndCombineWithLevelDbTransform = (
  mapper: Mapper,
  leveldb: level.LevelDB | LevelUp,
  args: {
    configuration?: Configuration
    getInputKey?: KeyGetter
    keyProperty: string
    combiner?: Reducer
    transform?: (value: Value) => Value
  }
) =>
  new Transform({
    objectMode: true,
    transform(data, _, callback) {
      const output: Value[] = []
      const running = mapper.map(args?.getInputKey?.(data) ?? '', data, {
        configuration: args.configuration,
        write: (key: Key, value: any) =>
          output.push(
            mappedObject(key, value, {
              keyProperty: mapper.keyProperty ?? args.keyProperty,
              transform: args.transform,
            })
          ),
      })
      handleAsyncFunctionCallback(running, () => {
        new Promise<void>(async (resolve, _reject) => {
          for (const out of output) {
            const combinerOutput: Value[] = []
            const combineKey = out[args.keyProperty]
            const current = (await leveldb.get(combineKey)) || []
            current.push(out)
            if (current.length > 1 && args.combiner) {
              const combinerRunning = args.combiner.reduce(combineKey, current, {
                configuration: args.configuration,
                write: (key: Key, value: any) => {
                  if (key !== combineKey) throw new Error(`Combiner can't change key`)
                  combinerOutput.push(value)
                },
              })
              if ((combinerRunning as any).then) await combinerRunning
            }
            await leveldb.put(combineKey, args.combiner ? combinerOutput : current)
          }
          resolve()
        })
          .then(() => callback())
          .catch((err) => callback(err))
      })
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
