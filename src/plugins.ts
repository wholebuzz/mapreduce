import { FileSystem } from '@wholebuzz/fs/lib/fs'
import { readableToString } from '@wholebuzz/fs/lib/stream'
import parseKeyValue from 'parse-key-value-pair'
import path from 'path'

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
    out[key === 'default' ? path.parse(url).name : key] = factory
  }
  return out
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
