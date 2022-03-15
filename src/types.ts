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
  cleanup?: boolean
}
