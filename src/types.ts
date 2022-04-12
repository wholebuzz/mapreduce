import type { FileSystem } from '@wholebuzz/fs/lib/fs'
import type { Logger } from '@wholebuzz/fs/lib/util'
import type { DatabaseCopyInput, DatabaseCopyOutput } from 'dbcp'
import type { Factory } from './plugins'

export interface Item {
  [key: string]: any
}

export type MapperClass<Key, Value> = Factory<Mapper<Key, Value>>
export type ReducerClass<Key, Value> = Factory<Reducer<Key, Value>>

export interface Configuration extends Record<string, any> {
  name?: string
  user?: string
  inputKeyProperty?: string
  inputValueProperty?: string
  keyProperty?: string
  valueProperty?: string
}

export interface Base<Key, Value> {
  configure?: (config: MapReduceJobConfig<Key, Value>) => void
  setup?: (context: Context<Key, Value>) => Promise<void>
  cleanup?: (context: Context<Key, Value>) => Promise<void>
}

export interface Context<Key, _Value> {
  configuration: Configuration
  currentKey?: Key
  keyProperty: string
  valueProperty: string
  write: (key: Key, value: any) => void
}

export interface MapContext<Key, Value> extends Context<Key, Value> {
  currentItem: Item
  currentValue: Value
  inputKeyProperty?: string
  inputValueProperty?: string
}

export interface ReduceContext<Key, Value> extends Context<Key, Value> {
  currentItem: Item[]
  currentValue: Value[]
}

export interface Mapper<Key, Value> extends Base<Key, Value> {
  map: (key: Key, value: Value, context: MapContext<Key, Value>) => void | Promise<void>
}

export interface Reducer<Key, Value> extends Base<Key, Value> {
  reduce: (key: Key, values: Value[], context: ReduceContext<Key, Value>) => void | Promise<void>
}

export enum MapperImplementation {
  externalSorting = 'externalSorting',
  leveldb = 'leveldb',
  // memory = 'memory',
}

export interface MapReduceJobConfig<Key, Value> extends DatabaseCopyInput, DatabaseCopyOutput {
  cleanup?: boolean
  combinerClass?: ReducerClass<Key, Value>
  configuration?: Configuration
  fileSystem: FileSystem
  jobid?: string
  inputPaths: string[]
  inputShardFilter?: (index: number) => boolean
  inputOptions?: DatabaseCopyInput
  localDirectory?: string
  logger?: Logger
  mapperClass?: MapperClass<Key, Value>
  mapperImplementation?: MapperImplementation
  outputPath: string
  outputShardFilter?: (index: number) => boolean
  reducerClass?: ReducerClass<Key, Value>
  runMap?: boolean
  runReduce?: boolean
  shuffleDirectory?: string
  synchronizeMap?: boolean
  synchronizeReduce?: boolean
  unpatchMap?: boolean
  unpatchReduce?: boolean
}
