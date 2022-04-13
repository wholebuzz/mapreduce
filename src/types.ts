import type { FileSystem } from '@wholebuzz/fs/lib/fs'
import type { Logger } from '@wholebuzz/fs/lib/util'
import {
  Configuration,
  InputSplit,
  MapperImplementation,
  MapReduceBaseConfig,
  MapReduceJobConfig,
} from './config'
import type { Factory } from './plugins'

export { Configuration, InputSplit, MapperImplementation, MapReduceBaseConfig, MapReduceJobConfig }

export interface Item {
  [key: string]: any
}

export type MapperClass<Key, Value> = Factory<Mapper<Key, Value>>
export type ReducerClass<Key, Value> = Factory<Reducer<Key, Value>>

export interface Base<Key, Value> {
  configure?: (config: MapReduceRuntimeConfig<Key, Value>) => void
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

export type Plugin<Key, Value> = Mapper<Key, Value> | Reducer<Key, Value>

export interface MapReduceRuntimeConfig<Key, Value> extends MapReduceBaseConfig {
  combinerClass?: ReducerClass<Key, Value>
  fileSystem: FileSystem
  inputShardFilter?: (index: number) => boolean
  logger?: Logger
  mapperClass?: MapperClass<Key, Value>
  mapperImplementation?: MapperImplementation
  outputShardFilter?: (index: number) => boolean
  reducerClass?: ReducerClass<Key, Value>
}
