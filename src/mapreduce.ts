export type Key = string
export type Value = Record<string, any>
export type GetKey = ((value: Value) => Key)
export type MapSync = (key: Key, value: Value, context: Context) => void
export type MapAsync = (key: Key, value: Value, context: Context) => Promise<void>
export type ReduceSync = (key: Key, values: Value[], context: Context) => void
export type ReduceAsync = (key: Key, values: Value[], context: Context) => Promise<void>

export interface Context {
  write: (value: Value) => void
}

export interface Mapper {
  isAsync?: boolean
  map: MapSync | MapAsync
}

export interface Reducer {
  isAsync?: boolean
  reduce: ReduceSync | ReduceAsync
}

export type MapperFactory = () => Mapper
export type ReducerFactory = () => Reducer

export interface KeyFunction {
  orderBy?: string
  geyKey?: GetKey
}

export interface MapReduceInput {
  filename: string
  keyFunction: KeyFunction
  sourceShards?: number
  sourceShardFilter?: (index: number) => boolean
}

export interface MapReduceOutput {
  filename: string
  keyFunction: KeyFunction
  targetShards?: number
}

export async function mapReduce(args: {
  input: MapReduceInput,
  output: MapReduceOutput,
  mapperClass: MapperFactory,
  reducerClass: ReducerFactory,
  workDirectory: string,
}) {
  const sourceShards = args.input.sourceShards || findNumShards(args.input.filename)
  const targetShards = args.output.targetShards || 1
  // map phase
  for (let sourceShard = 0; sourceShard < sourceShards; sourceShard++) {
    
  }

  // shuffle phase()
 
  // reduce phase
  for (let targetShard = 0; targetShard < targetShards; targetShard++) {
    
  }
}

export async function findNumShards(_url: string) {
  // XXX inspect filesystem 
  return 1
}
