import { handleAsyncFunctionCallback } from '@wholebuzz/fs/lib/stream'
import { readShardFilenames, shardedFilename } from '@wholebuzz/fs/lib/util'
import { dbcp } from 'dbcp'
import { Transform } from 'stream'
import { factoryConstruct, getObjectClassName } from './plugins'
import { Key, KeyGetter, Mapper, MapReduceJobConfig, Reducer, Value } from './types'

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
      await mapper.setup({
        write: () => {
          throw new Error()
        },
      })
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
          mapTransform(mapper, { keyProperty, getInputKey: sourceGetKey }),
      })),
    })
    if (mapper.cleanup) {
      await mapper.cleanup({
        write: () => {
          throw new Error()
        },
      })
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
      await reducer.setup({
        write: () => {
          throw new Error()
        },
      })
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
      transformObjectStream: () => reduceTransform(reducer, keyProperty),
    })
    if (reducer.cleanup) {
      await reducer.cleanup({
        write: () => {
          throw new Error()
        },
      })
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

export const mapTransform = (
  mapper: Mapper,
  args?: {
    keyProperty?: string
    getInputKey?: KeyGetter
    transform?: (value: Value) => Value
  }
) =>
  new Transform({
    objectMode: true,
    transform(data, _, callback) {
      const running = mapper.map(args?.getInputKey?.(data) ?? '', data, {
        write: (key: Key, value: Value) => {
          const output = { ...value }
          const keyProp = mapper.keyProperty ?? args?.keyProperty
          if (keyProp) output[keyProp] = key
          this.push(args?.transform ? args.transform(output) : output)
        },
      })
      handleAsyncFunctionCallback(running, callback)
    },
  })

/*
export const mapAndCombineWithLevelDbTransform = (
  leveldb: LevelDB,
  mapper: Mapper,
  keyProperty: string,
  getKey: KeyGetter,
  combiner?: Reducer
) =>
  new Transform({
    objectMode: true,
    transform(data, _, callback) {
      const output: Value[] = []
      const running = mapper.map(getKey(data), data, {
        write: (key: Key, value: Value) => output.push({ ...value, [keyProperty]: key }),
      })
      handleAsyncFunctionCallback(running, () => {
        new Promise<void>(async (resolve, _reject) => {
          for (const out of output) {
            const key = out[keyProperty]
            const current = (await leveldb.get(key)) || []
            current.push(out)
            await leveldb.put(key, current)
          }
          resolve()
        }).then(() => callback())
      })
    },
  })
  */

export const reduceTransform = (reducer: Reducer, keyProperty: string) =>
  new Transform({
    objectMode: true,
    transform(data, _, callback) {
      const reduceKey = data[0].value[keyProperty]
      const running = reducer.reduce(
        reduceKey,
        data.map((x: { source: string; value: Record<string, any> }) => x.value),
        {
          write: (key: Key, value: Value) => {
            if (key !== reduceKey) throw new Error(`Reducer can't change key`)
            this.push(value)
          },
        }
      )
      handleAsyncFunctionCallback(running, callback)
    },
  })
