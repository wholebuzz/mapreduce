import { FileSystem } from '@wholebuzz/fs/lib/fs'
import { readShardFilenames, shardedFilename } from '@wholebuzz/fs/lib/util'
import { DatabaseCopyFormats, dbcp } from 'dbcp'
import { Transform } from 'stream'

export const keyProperty = '_key'
export const shuffleFormat = 'jsonl.gz'
export const inputshardFilenameFormat = 'inputshard-SSSS-of-NNNN'
export const shuffleFilenameFormat = 'shuffle-SSSS-of-NNNN'
export const mapTempDirectoryPrefix = 'maptmp'
export const defaultDiretory = './'

export type Key = string
export type Value = Record<string, any>
export type KeyGetter = (value: Value) => Key
export type MappedValue = Value & { [keyProperty]: Key }

export interface Context {
  write: (key: Key, value: Value) => void
}

export interface Mapper {
  map: (key: Key, value: Value, context: Context) => void | Promise<void>
}

export interface Reducer {
  reduce: (key: Key, values: Value[], context: Context) => void | Promise<void>
}

export interface BaseClass {
  setup?: (context: Context) => Promise<void>
  cleanup?: (context: Context) => Promise<void>
}

export interface MapperClass {
  createMapper: () => BaseClass & Mapper
}

export interface ReducerClass {
  createReducer: () => BaseClass & Reducer
}

export interface MapReduceJobConfig {
  name?: string
  user?: string
  jobid?: string
  fileSystem: FileSystem
  inputPaths: string[]
  inputFormat?: DatabaseCopyFormats
  inputKeyGetter?: KeyGetter
  inputShardFilter?: (index: number) => boolean
  outputPath: string
  outputFormat?: DatabaseCopyFormats
  outputShards?: number
  outputShardFilter?: (index: number) => boolean
  mapperClass: MapperClass
  reducerClass: ReducerClass
  combinerClass?: ReducerClass
  localDirectory?: string
  shuffleDirectory?: string
}

export async function mapReduce(args: MapReduceJobConfig) {
  if (args.inputPaths.length !== 1)
    throw new Error('Only one (sharded) input is currently supported')
  const user = args.user || process.env.USER || 'mr-user'
  const jobid = args.jobid || (args.name || 'mr-job') + `-${new Date().getTime()}`
  const subdir = `taskTracker/${user}/jobcache/${jobid}/work/`
  const localDirectory = (args.localDirectory ?? defaultDiretory) + subdir
  const shuffleDirectory = (args.shuffleDirectory ?? defaultDiretory) + subdir
  const sourceShards = (await readShardFilenames(args.fileSystem, args.inputPaths[0])).numShards
  const sourceGetKey = args.inputKeyGetter ?? ((x) => x._key)
  const targetShards = args.outputShards || 1
  const localDirectories = new Array(targetShards)
    .fill(localDirectory)
    .map((x, i) => x + `${mapTempDirectoryPrefix}${i}`)
  for (const directory of localDirectories) await args.fileSystem.ensureDirectory(directory)

  // map phase
  for (let sourceShard = 0; sourceShard < sourceShards; sourceShard++) {
    if (args.inputShardFilter && !args.inputShardFilter(sourceShard)) continue
    const shard = { index: sourceShard, modulus: sourceShards }
    const inputshard = shardedFilename(inputshardFilenameFormat, shard)
    const mapper = args.mapperClass.createMapper()
    if (mapper.setup) {
      await mapper.setup({
        write: () => {
          throw new Error()
        },
      })
    }
    const options = {
      externalSortBy: [keyProperty],
      shardBy: keyProperty,
      sourceFiles: [
        {
          url: shardedFilename(args.inputPaths[0], shard),
        },
      ],
      targetFile: shuffleDirectory + `${shuffleFilenameFormat}.${inputshard}.${shuffleFormat}`,
      targetShards,
      tempDirectories: localDirectories,
    }
    console.log('map', options)
    await dbcp({
      ...options,
      fileSystem: args.fileSystem,
      sourceFiles: options.sourceFiles.map((x) => ({
        ...x,
        transformInputObjectStream: () =>
          new Transform({
            objectMode: true,
            transform(data, _, callback) {
              const running = mapper.map(sourceGetKey(data), data, {
                write: (key: Key, value: Value) => this.push({ ...value, [keyProperty]: key }),
              })
              handleTransformCallback(callback, running)
            },
          }),
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
    const reducer = args.reducerClass.createReducer()
    if (reducer.setup) {
      await reducer.setup({
        write: () => {
          throw new Error()
        },
      })
    }
    const options = {
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
    console.log('reduce', options)
    await dbcp({
      ...options,
      fileSystem: args.fileSystem,
      transformObjectStream: () =>
        new Transform({
          objectMode: true,
          transform(data, _, callback) {
            const reduceKey = data[0].value._key
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
            handleTransformCallback(callback, running)
          },
        }),
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

export function handleTransformCallback(callback: () => void, running: void | Promise<void>) {
  if (running && running.then) {
    running
      .then(() => callback())
      .catch((err) => {
        throw err
      })
  } else {
    callback()
  }
}
