import { FileSystem } from '@wholebuzz/fs/lib/fs'
import { readableToString } from '@wholebuzz/fs/lib/stream'
import path from 'path'

export const requireFromString = require('require-from-string')

export type ClassFactory<X> = new () => X
export type ObjectFactory<X> = () => X
export type Factory<X> = ClassFactory<X> | ObjectFactory<X>

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
