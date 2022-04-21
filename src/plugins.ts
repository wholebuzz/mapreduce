import { FileSystem } from '@wholebuzz/fs/lib/fs'
import { readJSON } from '@wholebuzz/fs/lib/json'
import { readableToString } from '@wholebuzz/fs/lib/stream'
import parseKeyValue from 'parse-key-value-pair'
import { parse as pathParse } from 'path'
import yargs from 'yargs'
import { Configuration } from './types'

export const requireFromString = require('require-from-string')

export type ClassFactory<X> = new () => X
export type ObjectFactory<X> = () => X
export type Factory<X> = ClassFactory<X> | ObjectFactory<X>

export const getObjectClassName = (x: any) => x?.constructor?.name

export function factoryConstruct<X>(factory: Factory<X>): X {
  if (factory.prototype && factory.prototype.constructor.name) {
    return new (factory as ClassFactory<X>)()
  } else {
    return (factory as ObjectFactory<X>)()
  }
}

export async function loadPluginFiles<X>(
  fileSystem: FileSystem,
  url: string,
  out: Record<string, Factory<X>> = {}
) {
  if (url.endsWith('/')) {
    const files = await fileSystem.readDirectory(url)
    for (const file of files) await loadPluginFile(fileSystem, file.url, out)
    return out
  } else {
    return loadPluginFile(fileSystem, url, out)
  }
}

export async function loadPluginFile<X>(
  fileSystem: FileSystem,
  url: string,
  out: Record<string, Factory<X>> = {}
) {
  const plugin = requireFromString(
    await readableToString((await fileSystem.openReadableFile(url)).finish())
  )
  return loadPlugin(plugin, url, out)
}

export function loadPlugin<X>(
  plugin: Record<string, any>,
  url: string,
  out: Record<string, Factory<X>> = {}
) {
  for (const key of Object.keys(plugin)) {
    const factory: any = plugin[key]
    if (typeof factory === 'function') {
      out[key === 'default' ? pathParse(url).name : key] = factory
    }
  }
  return out
}

export function loadConfigurationCode(configuration: Configuration, suffix = 'Code') {
  for (const key of Object.keys(configuration)) {
    if (!key.endsWith(suffix)) continue
    // tslint:disable-next-line
    const fn = eval(configuration[key])
    if (typeof fn !== 'function') throw new Error(`loadConfigurationCode`)
    configuration[key.substring(0, key.length - suffix.length)] = fn
  }
  return configuration
}

export function parseConfiguration(input?: string | string[]) {
  const ret: Record<string, any> = {}
  for (const text of !input ? [] : Array.isArray(input) ? input : [input]) {
    if (text.length > 0 && text[0] === '{') {
      const obj: Record<string, any> = JSON.parse(text)
      for (const [key, value] of Object.entries(obj)) ret[key] = value
    } else {
      const pair = parseKeyValue(text)
      if (pair) {
        const keyPath = pair[0].split('.')
        for (let obj = ret, i = 0; i < keyPath.length; i++) {
          const key = keyPath[i].trim()
          if (i === keyPath.length - 1) obj[key] = pair[1]
          else {
            if (!obj[key]) obj[key] = {}
            obj = obj[key]
          }
        }
      }
    }
  }
  return ret
}

export async function applyJobConfigToYargs(fileSystem: FileSystem, args: Record<string, any>) {
  args = deduplicateYargs(args)
  const jobConfig = args.jobConfig
    ? JSON.parse(args.jobConfig)
    : args.jobConfigFile
    ? await readJSON(fileSystem, args.jobConfigFile)
    : undefined
  const options = (yargs as any).getOptions()
  for (const [key, value] of Object.entries(jobConfig || {})) {
    if (args[key] && isProcessArgument(key)) continue
    const valueType = Array.isArray(value) ? 'array' : typeof value
    if (options.key[key] && !options[valueType]?.includes(key)) {
      throw new Error(`jobConfig ${key} type mismatches ${valueType}`)
    }
    args[key] = value
  }
  return args
}

export function deduplicateYargs(args: Record<string, any>) {
  const dedupArgs: Record<string, any> = {}
  const options = (yargs as any).getOptions()
  const aliasSet = new Set()
  for (const aliases of Object.values(options.alias ?? {})) {
    if (Array.isArray(aliases)) for (const alias of aliases) aliasSet.add(alias)
  }
  for (const [key, value] of Object.entries(args)) {
    if (options.key[key] && !aliasSet.has(key)) dedupArgs[key] = value
  }
  return dedupArgs
}

function isProcessArgument(option: string) {
  return process.argv.indexOf(`-${option}`) >= 0 || process.argv.indexOf(`--${option}`) >= 0
}

export function getSubPropertyWithPath(x: Record<string, any>, path?: string) {
  return getSubProperty(x, path?.split('.'))
}

export function getSubProperty(x: Record<string, any>, path?: string[]): any {
  for (const key of path ?? []) {
    x = x[key]
    if (!x) break
  }
  return x
}

export function setSubProperty(x: Record<string, any>, path: string[], value: any) {
  const input = x
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]
    if (!x[key]) x[key] = {}
    x = x[key]
  }
  x[path[path.length - 1]] = value
  return input
}

export function getSubPropertyAccessor(path: string): (_: Record<string, any>) => any {
  const nested = path?.split('.')
  if (nested.length === 0) {
    return (x) => x
  } else if (nested.length === 1) {
    return (x) => x[nested[0]]
  } else {
    return (x) => getSubProperty(x, nested)
  }
}

export function getSubPropertySetter(path: string): (_: Record<string, any>, value: any) => any {
  const nested = path?.split('.')
  if (nested.length === 0) {
    throw new Error()
  } else if (nested.length === 1) {
    return (x, value) => {
      const key = nested[0]
      if (key) x[key] = value
      return x
    }
  } else {
    return (x, value) => setSubProperty(x, nested, value)
  }
}
