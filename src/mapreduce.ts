import { FileSystem } from '@wholebuzz/fs/lib/fs'
import { handleAsyncFunctionCallback } from '@wholebuzz/fs/lib/stream'
import { Logger, readShardFilenames, shardedFilename } from '@wholebuzz/fs/lib/util'
import { DatabaseCopySource, DatabaseCopyTarget, dbcp } from 'dbcp'
import { DatabaseCopyFormat } from 'dbcp/dist/format'
import { Transform } from 'stream'
import { Factory, factoryConstruct, getObjectClassName } from './plugins'

export const defaultKeyProperty = '_key'
export const defaultShuffleFormat = 'jsonl.gz'
export const shuffleFilenameFormat = 'shuffle-SSSS-of-NNNN'
export const inputshardFilenameFormat = 'inputshard-SSSS-of-NNNN'
export const localTempDirectoryPrefix = 'maptmp'
export const defaultDiretory = './'

export type Key = string
export type Value = Record<string, any>
export type KeyGetter = (value: Value) => Key
export type MappedValue = Value & { [defaultKeyProperty]: Key }
export type MapperClass = Factory<Mapper>
export type ReducerClass = Factory<Reducer>

export interface Configuration extends Record<string, any> {
  name?: string
  user?: string
  keyProperty?: string
}

export interface Context {
  configuration?: Configuration
  write: (key: Key, value: Value) => void
}

export interface Base {
  configure?: (config: MapReduceJobConfig) => void
  setup?: (context: Context) => Promise<void>
  cleanup?: (context: Context) => Promise<void>
}

export interface Mapper extends Base {
  map: (key: Key, value: Value, context: Context) => void | Promise<void>
}

export interface Reducer extends Base {
  reduce: (key: Key, values: Value[], context: Context) => void | Promise<void>
}

export interface MapReduceJobConfig {
  configuration?: Configuration
  fileSystem: FileSystem
  jobid?: string
  inputPaths: string[]
  inputFormat?: DatabaseCopyFormat
  inputSource?: DatabaseCopySource
  inputKeyGetter?: KeyGetter
  inputShardFilter?: (index: number) => boolean
  logger?: Logger
  outputPath: string
  outputFormat?: DatabaseCopyFormat
  outputTarget?: DatabaseCopyTarget
  outputShards?: number
  outputShardFilter?: (index: number) => boolean
  mapperClass: MapperClass
  reducerClass: ReducerClass
  combinerClass?: ReducerClass
  localDirectory?: string
  shuffleDirectory?: string
}

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
        transformInputObjectStream: () => mapTransform(mapper, keyProperty, sourceGetKey),
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
  for (let targetShard = 0; targetShard < targetShards; targetShard++) {
    if (args.outputShardFilter && !args.outputShardFilter(targetShard)) continue
    for (let sourceShard = 0; sourceShard < sourceShards; sourceShard++) {
      if (args.inputShardFilter && !args.inputShardFilter(sourceShard)) continue
      await args.fileSystem.removeFile(
        shuffleDirectory +
          shardedFilename(shuffleFilenameFormat, { index: targetShard, modulus: targetShards }) +
          '.' +
          shardedFilename(inputshardFilenameFormat, { index: sourceShard, modulus: sourceShards }) +
          `.${shuffleFormat}`
      )
    }
  }
}

export const mapTransform = (mapper: Mapper, keyProperty: string, getKey: KeyGetter) =>
  new Transform({
    objectMode: true,
    transform(data, _, callback) {
      const running = mapper.map(getKey(data), data, {
        write: (key: Key, value: Value) => this.push({ ...value, [keyProperty]: key }),
      })
      handleAsyncFunctionCallback(running, callback)
    },
  })

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
