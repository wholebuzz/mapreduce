import { FileSystem } from '@wholebuzz/fs/lib/fs'
import { handleAsyncFunctionCallback } from '@wholebuzz/fs/lib/stream'
import { Logger } from '@wholebuzz/fs/lib/util'
import { Transform } from 'stream'
import {
  Factory,
  factoryConstruct,
  getSubPropertyAccessor,
  getSubPropertySetter,
  loadPlugin,
  loadPluginFiles,
} from './plugins'
import {
  Configuration,
  Item,
  MapContext,
  Mapper,
  MapReduceJobConfig,
  MapReduceRuntimeConfig,
  Plugin,
  ReduceContext,
  Reducer,
} from './types'

export const defaultDiretory = './'
export const defaultKeyProperty = 'key'
export const defaultValueProperty = '' // Empty string means the underlying object itself
export const unknownWriteProperty = 'value'
export const defaultShuffleFormat = 'jsonl.gz'
export const shuffleFilenameFormat = 'shuffle-SSSS-of-NNNN'
export const inputshardFilenameFormat = 'inputshard-SSSS-of-NNNN'
export const synchronizeMapFilenameFormat = 'map-done-SSSS-of-NNNN.json'
export const synchronizeReduceFilenameFormat = 'reduce-done-SSSS-of-NNNN.json'
export const localTempDirectoryPrefix = 'maptmp'

export function newJobId(name?: string) {
  return getName(name) + `-${formatNumberForUtf8Sort(new Date().getTime(), true)}`
}

export function getName(name?: string) {
  return name || 'mr-job'
}

export function getUser(user?: string) {
  return user || process.env.USER || 'mr-user'
}

export function getWorkDirectory(user: string, jobid: string) {
  return `taskTracker/${user}/jobcache/${jobid}/work/`
}

export function getConfigurationValue<X>(
  configuration: Configuration | undefined,
  key: string,
  type?: string
): X {
  const val = configuration?.[key]
  console.log('wtf', key, val, type, typeof val)
  if (type && typeof val !== type) {
    throw new Error(`getConfiguration ${key} got ${typeof val} expected ${type}`)
  }
  return val
}

export function getShardFilter(workerIndex: number, numWorkers: number) {
  return numWorkers > 1 ? (index: number) => index % numWorkers === workerIndex : undefined
}

export const getItemKeyAccessor = (inputKeyProperty?: string) =>
  inputKeyProperty ? getSubPropertyAccessor(inputKeyProperty) : () => undefined

export const getItemValueAccessor = (inputValueProperty?: string) =>
  inputValueProperty ? getSubPropertyAccessor(inputValueProperty) : (x: any) => x

// maxIntegerDigits == '9007199254740991'.length == 16
export const maxIntegerDigits = Number.MAX_SAFE_INTEGER.toString().length

export const formatNumberForUtf8Sort = (value: number, reverse?: boolean) =>
  (reverse ? Number.MAX_SAFE_INTEGER - value : value).toString().padStart(maxIntegerDigits, '0')

export async function prepareRuntime<Key, Value>(
  fileSystem: FileSystem,
  logger: Logger,
  args: MapReduceJobConfig
) {
  const plugins = loadPlugin<Plugin<Key, Value>>(require('./mappers'), 'mappers')
  loadPlugin<Plugin<Key, Value>>(require('./reducers'), 'reducers', plugins)
  for (const pluginFile of args.plugins ?? []) {
    await loadPluginFiles<Plugin<Key, Value>>(fileSystem, pluginFile, plugins)
  }

  const mapperPlugin = args.map ? plugins[args.map] : plugins.IdentityMapper
  const mapperClass: Factory<Mapper<Key, Value>> | undefined =
    mapperPlugin && 'map' in factoryConstruct<Plugin<Key, Value>>(mapperPlugin)
      ? (mapperPlugin as Factory<Mapper<Key, Value>>)
      : undefined

  const reducerPlugin = args.reduce ? plugins[args.reduce] : plugins.IdentityReducer
  const reducerClass: Factory<Reducer<Key, Value>> | undefined =
    reducerPlugin && 'reduce' in factoryConstruct<Plugin<Key, Value>>(reducerPlugin)
      ? (reducerPlugin as Factory<Reducer<Key, Value>>)
      : undefined

  const combinerPlugin = args.combine ? plugins[args.combine] : undefined
  const combinerClass: Factory<Reducer<Key, Value>> | undefined =
    combinerPlugin && 'reduce' in factoryConstruct<Plugin<Key, Value>>(combinerPlugin)
      ? (combinerPlugin as Factory<Reducer<Key, Value>>)
      : undefined

  if (!mapperClass) {
    throw new Error(`Unknown mapper: ${args.map}`)
  }
  if (!reducerClass) {
    throw new Error(`Unknown reducer: ${args.reduce}`)
  }
  if (!combinerClass && args.combine) {
    throw new Error(`Unknown combiner: ${args.combine}`)
  }

  const shardFilter = getShardFilter(args.workerIndex, args.numWorkers)
  const options: MapReduceRuntimeConfig<Key, Value> = {
    ...args,
    combinerClass,
    fileSystem,
    inputShardFilter: shardFilter,
    logger,
    mapperClass,
    outputShardFilter: shardFilter,
    reducerClass,
  }
  return options
}

export const immutableContext = (configuration?: Configuration) => ({
  configuration: configuration ?? {},
  currentItem: {},
  keyProperty: configuration?.keyProperty ?? defaultKeyProperty,
  valueProperty: configuration?.valueProperty ?? defaultValueProperty,
  write: () => {
    throw new Error()
  },
})

export function mappedObject<Key, _Value>(
  key: Key,
  value: any,
  keySetter: ((output: Record<string, any>, value: any) => void) | undefined,
  nonObjectValueSetter: (output: Record<string, any>, value: any) => void,
  transform?: (value: Item) => Item
): Item {
  const output: Item = typeof value === 'object' ? { ...value } : nonObjectValueSetter({}, value)
  if (keySetter) keySetter(output, key)
  return transform ? transform(output) : output
}

export function mapTransform<Key, Value>(
  mapper: Mapper<Key, Value>,
  args?: {
    configuration?: Configuration
    logger?: Logger
    transform?: (value: Item) => Item
  }
) {
  let transform!: Transform
  let warnedReadFalsyKey = false
  let warnedReadFalsyValue = false
  let warnedWroteFalsyKey = false
  let warnedWroteFalsyValue = false
  const configuration = args?.configuration ?? {}
  const keyProperty = configuration?.keyProperty ?? defaultKeyProperty
  const valueProperty = configuration?.valueProperty ?? defaultValueProperty
  const setItemKey = keyProperty ? getSubPropertySetter(keyProperty) : undefined
  const setItemValue = getSubPropertySetter(valueProperty || unknownWriteProperty)
  const context: MapContext<Key, Value> = {
    configuration,
    currentItem: {},
    currentValue: undefined!,
    inputKeyProperty: configuration.inputKeyProperty ?? keyProperty,
    inputValueProperty: configuration.inputValueProperty ?? valueProperty,
    keyProperty,
    valueProperty,
    write: (key: Key, value: any) => {
      if (!key && !warnedWroteFalsyKey) {
        warnedWroteFalsyKey = true
        if (args?.logger) args.logger.error('WARNING: Wrote falsy Mapper key')
      }
      if (!value && !warnedWroteFalsyValue) {
        warnedWroteFalsyValue = true
        if (args?.logger) args.logger.error('WARNING: Wrote falsy Mapper value')
      }
      transform.push(mappedObject(key, value, setItemKey, setItemValue, args?.transform))
    },
  }
  const getItemKey = getItemKeyAccessor(context.inputKeyProperty)
  const getItemValue = getItemValueAccessor(context.inputValueProperty)
  transform = new Transform({
    objectMode: true,
    transform(data: Item, _, callback) {
      context.currentItem = data
      context.currentKey = getItemKey(context.currentItem)
      context.currentValue = getItemValue(context.currentItem)
      if (!context.currentKey && !warnedReadFalsyKey) {
        warnedReadFalsyKey = true
        if (args?.logger) args.logger.error('WARNING: Read falsy Mapper key')
      }
      if (!context.currentValue && !warnedReadFalsyValue) {
        warnedReadFalsyValue = true
        if (args?.logger) args.logger.error('WARNING: Read falsy Mapper value')
      }
      const running = mapper.map(context.currentKey!, context.currentValue, context)
      handleAsyncFunctionCallback(running, callback)
    },
  })
  return transform
}

export function reduceTransform<Key, Value>(
  reducer: Reducer<Key, Value>,
  args: { configuration?: Configuration; logger?: Logger; transform?: (value: Item) => Item }
) {
  let transform!: Transform
  let warnedReadFalsyKey = false
  let warnedReadFalsyValue = false
  let warnedWroteFalsyValue = false
  const configuration = args?.configuration ?? {}
  const keyProperty = configuration.keyProperty ?? defaultKeyProperty
  const valueProperty = configuration.valueProperty ?? defaultValueProperty
  const setItemKey = keyProperty ? getSubPropertySetter(keyProperty) : undefined
  const setItemValue = getSubPropertySetter(valueProperty || unknownWriteProperty)
  const context: ReduceContext<Key, Value> = {
    configuration,
    currentItem: [],
    currentValue: [],
    keyProperty,
    valueProperty,
    write: (key: Key, value: any) => {
      if (key !== context.currentKey) throw new Error(`Reducer can't change key`)
      if (!value && !warnedWroteFalsyValue) {
        warnedWroteFalsyValue = true
        if (args?.logger) args.logger.error('WARNING: Wrote falsy Reducer value')
      }
      transform.push(mappedObject(key, value, setItemKey, setItemValue, args?.transform))
    },
  }
  const getItemKey = getItemKeyAccessor(context.keyProperty)
  const getItemValue = getItemValueAccessor(context.valueProperty)
  transform = new Transform({
    objectMode: true,
    transform(data, _, callback) {
      if (Array.isArray(data)) {
        context.currentItem = []
        context.currentItemSource = []
        for (const x of data) {
          context.currentItem.push(x.value)
          context.currentItemSource.push(x.source)
        }
      } else {
        context.currentItem = [data]
        context.currentItemSource = undefined
      }
      context.currentKey = getItemKey(context.currentItem[0])
      context.currentValue = context.currentItem.map(getItemValue)
      if (!context.currentKey && !warnedReadFalsyKey) {
        warnedReadFalsyKey = true
        if (args?.logger) args.logger.error('WARNING: Read falsy Reducer key')
      }
      if ((!context.currentValue.length || !context.currentValue[0]) && !warnedReadFalsyValue) {
        warnedReadFalsyValue = true
        if (args?.logger) args.logger.error('WARNING: Read falsy Reducer value')
      }
      const running = reducer.reduce(context.currentKey!, context.currentValue, context)
      handleAsyncFunctionCallback(running, callback)
    },
  })
  return transform
}
