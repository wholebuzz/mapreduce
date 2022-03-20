import type { FileSystem } from '@wholebuzz/fs/lib/fs'
import type { Logger } from '@wholebuzz/fs/lib/util'
import type { DatabaseCopySource, DatabaseCopyTarget } from 'dbcp'
import type { DatabaseCopyFormat } from 'dbcp/dist/format'
import type { Factory } from './plugins'

export type Key = string
export type Value = Record<string, any>
export type KeyGetter = (value: Value) => Key
export type MapperClass = Factory<Mapper>
export type ReducerClass = Factory<Reducer>

export interface Configuration extends Record<string, any> {
  name?: string
  user?: string
  keyProperty?: string
}

export interface Context {
  configuration?: Configuration
  write: (key: Key, value: any) => void
}

export interface Base {
  configure?: (config: MapReduceJobConfig) => void
  setup?: (context: Context) => Promise<void>
  cleanup?: (context: Context) => Promise<void>
}

export interface Mapper extends Base {
  map: (key: Key, value: Value, context: Context) => void | Promise<void>
  getInputKey?: KeyGetter
  keyProperty?: string
}

export interface Reducer extends Base {
  reduce: (key: Key, values: Value[], context: Context) => void | Promise<void>
}

export enum MapperImplementation {
  externalSorting = 'externalSorting',
  leveldb = 'leveldb',
  // memory = 'memory',
}

export interface MapReduceJobConfig {
  autoSkipMapper?: boolean
  autoSkipReducer?: boolean
  cleanup?: boolean
  combinerClass?: ReducerClass
  configuration?: Configuration
  fileSystem: FileSystem
  jobid?: string
  inputFormat?: DatabaseCopyFormat
  inputKeyGetter?: KeyGetter
  inputPaths: string[]
  inputShardFilter?: (index: number) => boolean
  inputSource?: DatabaseCopySource
  localDirectory?: string
  logger?: Logger
  mapperClass?: MapperClass
  mapperImplementation?: MapperImplementation
  outputFormat?: DatabaseCopyFormat
  outputPath: string
  outputShards?: number
  outputShardFilter?: (index: number) => boolean
  outputTarget?: DatabaseCopyTarget
  reducerClass?: ReducerClass
  runMapper?: boolean
  runReducer?: boolean
  shuffleDirectory?: string
  skipMapper?: boolean
  skipReducer?: boolean
  synchronizeCleanup?: boolean
  synchronizeMap?: boolean
  synchronizeReduce?: boolean
}
