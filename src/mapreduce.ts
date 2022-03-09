import { FileSystem } from '@wholebuzz/fs/lib/fs'
import { readShardFilenames, shardedFilename } from '@wholebuzz/fs/lib/util'
import { dbcp } from 'dbcp'
import { Transform } from 'stream'

export const keyProperty = '_key'
export const shuffleFormat = 'jsonl.gz'
export const inputshardFormat = 'inputshard-SSSS-of-NNNN'
export const shuffleFileFormat = 'shuffle-SSSS-of-NNNN'
export const mapTempDirectoryPrefix = 'maptmp'

export type Key = string
export type Value = Record<string, any>
export type GetKey = (value: Value) => Key
export type MappedValue = Value & { [keyProperty]: Key }
export type MapSync = (key: Key, value: Value, context: Context) => void
export type MapAsync = (key: Key, value: Value, context: Context) => Promise<void>
export type ReduceSync = (key: Key, values: Value[], context: Context) => void
export type ReduceAsync = (key: Key, values: Value[], context: Context) => Promise<void>

export interface Context {
  write: (key: Key, value: Value) => void
}

export interface Mapper {
  map: MapSync | MapAsync
}

export interface Reducer {
  reduce: ReduceSync | ReduceAsync
}

export interface MapperClass {
  createMapper: () => Mapper
}

export interface ReducerClass {
  createReducer: () => Reducer
}

export interface MapReduceInput {
  filename: string
  getKey: GetKey
  sourceShards?: number
  sourceShardFilter?: (index: number) => boolean
}

export interface MapReduceOutput {
  filename: string
  targetShards?: number
}

export async function mapReduce(args: {
  fileSystem: FileSystem
  input: MapReduceInput
  output: MapReduceOutput
  mapperClass: MapperClass
  reducerClass: ReducerClass
  mapDirectory?: string
  shuffleDirectory?: string
}) {
  const mapDirectory = args.mapDirectory ?? './'
  const shuffleDirectory = args.shuffleDirectory ?? './'
  const sourceShards =
    args.input.sourceShards || (await findNumShards(args.fileSystem, args.input.filename))
  const sourceGetKey = args.input.getKey ?? ((x) => x._key)
  const targetShards = args.output.targetShards || 1
  const mapDirectories = new Array(targetShards)
    .fill(mapDirectory)
    .map((x, i) => x + `${mapTempDirectoryPrefix}${i}`)
  for (const directory of mapDirectories) await args.fileSystem.ensureDirectory(directory)

  // map phase
  for (let sourceShard = 0; sourceShard < sourceShards; sourceShard++) {
    if (args.input.sourceShardFilter && !args.input.sourceShardFilter(sourceShard)) continue
    const shard = { index: sourceShard, modulus: sourceShards }
    const inputshard = shardedFilename(inputshardFormat, shard)
    const mapper = args.mapperClass.createMapper()
    const options = {
      externalSortBy: [keyProperty],
      shardBy: keyProperty,
      sourceFiles: [
        {
          url: shardedFilename(args.input.filename, shard),
        },
      ],
      targetFile: shuffleDirectory + `${shuffleFileFormat}.${inputshard}.${shuffleFormat}`,
      targetShards,
      tempDirectories: mapDirectories,
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
              const ret = mapper.map(sourceGetKey(data), data, {
                write: (key: Key, value: Value) => this.push({ ...value, [keyProperty]: key }),
              })
              if (ret && ret.then) {
                ret
                  .then(() => callback())
                  .catch((err) => {
                    throw err
                  })
              } else {
                callback()
              }
            },
          }),
      })),
    })
  }

  // shuffle phase

  // reduce phase
  for (let targetShard = 0; targetShard < targetShards; targetShard++) {
    const shard = { index: targetShard, modulus: targetShards }
    const options = {
      group: true,
      groupLabels: true,
      sourceFiles: [
        {
          url:
            shuffleDirectory +
            shardedFilename(shuffleFileFormat, shard) +
            `.${inputshardFormat}.${shuffleFormat}`,
          sourceShards,
        },
      ],
      targetFile: shardedFilename(args.output.filename, shard),
    }
    console.log('reduce', options)
    await dbcp({
      fileSystem: args.fileSystem,
      ...options,
    })
  }
}

export async function findNumShards(fileSystem: FileSystem, url: string) {
  const shards = await readShardFilenames(fileSystem, url)
  return shards.numShards
}
