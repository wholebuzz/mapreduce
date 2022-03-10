import { FileSystem } from '@wholebuzz/fs/lib/fs'
import { readableToString } from '@wholebuzz/fs/lib/stream'
import path from 'path'

export const requireFromString = require('require-from-string')

export async function loadPluginFiles<X>(
  fileSystem: FileSystem,
  url: string,
  out: Record<string, () => X> = {}
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
  out: Record<string, () => X> = {}
) {
  const plugin = requireFromString(
    await readableToString((await fileSystem.openReadableFile(url)).finish())
  )
  return loadPlugin(plugin, url, out)
}

export function loadPlugin<X>(
  plugin: Record<string, any>,
  url: string,
  out: Record<string, () => X> = {}
) {
  for (const key of Object.keys(plugin)) {
    const factory: any = plugin[key]
    out[key === 'default' ? path.parse(url).name : key] = loadPluginItem(factory)
  }
  return out
}

export function loadPluginItem(factory: any) {
  const isConstructor = !!factory.prototype && !!factory.prototype.constructor.name
  return isConstructor ? () => new factory() : () => factory()
}
