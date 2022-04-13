import type { DatabaseCopyInput, DatabaseCopyOutput } from 'dbcp'

export interface Configuration extends Record<string, any> {
  name?: string
  user?: string
  inputKeyProperty?: string
  inputValueProperty?: string
  keyProperty?: string
  valueProperty?: string
}

export interface InputSplit {
  url: string
}

export enum MapperImplementation {
  externalSorting = 'externalSorting',
  leveldb = 'leveldb',
  // memory = 'memory',
}

export interface MapReduceBaseConfig extends DatabaseCopyInput, DatabaseCopyOutput {
  cleanup?: boolean
  configuration?: Configuration
  jobid?: string
  inputPaths: string[]
  inputOptions?: DatabaseCopyInput
  inputSplits?: InputSplit[]
  localDirectory?: string
  mapperImplementation?: MapperImplementation
  outputPath: string
  runMap?: boolean
  runReduce?: boolean
  shuffleDirectory?: string
  synchronizeMap?: boolean
  synchronizeReduce?: boolean
  unpatchMap?: boolean
  unpatchReduce?: boolean
}

export interface MapReduceJobConfig extends MapReduceBaseConfig {
  combine?: string
  config?: string[]
  map?: string
  numWorkers: number
  plugins?: string[]
  reduce?: string
  workerIndex: number
}
