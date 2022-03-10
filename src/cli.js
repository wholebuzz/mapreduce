#!/usr/bin/env node

const {
  AnyFileSystem,
  GoogleCloudFileSystem,
  HTTPFileSystem,
  LocalFileSystem,
  S3FileSystem,
  SMBFileSystem,
} = require('@wholebuzz/fs')
const {
  DatabaseCopyFormat,
  DatabaseCopySourceType,
  DatabaseCopyTargetType,
  DatabaseCopySchema,
} = require('dbcp/dist/format')
const dotenv = require('dotenv')
const yargs = require('yargs')
const { mapReduce } = require('./mapreduce')
const { loadPlugin, loadPluginFiles } = require('./plugins')

dotenv.config()
// tslint:disable-next-line:no-console
process.on('uncaughtException', (err) => console.error('unhandled exception', err))

async function main() {
  const formats = Object.values(DatabaseCopyFormat)
  const args = yargs.strict().options({
    config: {
      description: 'Configuration',
      type: 'string',
    },
    inputFormat: {
      choices: formats,
    },
    inputKey: {
      description: 'Source file',
      type: 'string',
    },
    inputPaths: {
      description: 'Source file',
      required: true,
      type: 'array',
    },
    map: {
      description: 'Mapper name',
      type: 'string',
    },
    outputFormat: {
      choices: formats,
    },
    outputPath: {
      description: 'Target file',
      required: true,
      type: 'string',
    },
    outputShards: {
      description: 'Target shards',
      type: 'number',
    },
    plugins: {
      description: 'Plugins file or directory',
      type: 'array',
    },
    reduce: {
      description: 'Reducer name',
      type: 'string',
    },
  }).argv

  const httpFileSystem = new HTTPFileSystem()
  const fileSystem = new AnyFileSystem([
    { urlPrefix: 'gs://', fs: new GoogleCloudFileSystem() },
    { urlPrefix: 's3://', fs: new S3FileSystem() },
    { urlPrefix: 'http://', fs: httpFileSystem },
    { urlPrefix: 'https://', fs: httpFileSystem },
    { urlPrefix: '', fs: new LocalFileSystem() },
  ])

  const plugins = loadPlugin(require('./mappers'), 'mappers')
  loadPlugin(require('./reducers'), 'reducers', plugins)
  for (const pluginFile of args.plugins ?? []) {
    await loadPluginFiles(fileSystem, pluginFile, plugins)
  }

  const mapperClass = args.map ? plugins[args.map] : plugins.IdentityMapper
  const reducerClass = args.reduce ? plugins[args.reduce] : plugins.IdentityReducer
  if (!mapperClass) throw new Error(`Unknown mapper: ${args.map}`)
  if (!reducerClass) throw new Error(`Unknown mapper: ${args.reduce}`)

  const options = {
    ...args,
    configuration: args.config ? JSON.parse(args.config) : undefined,
    fileSystem,
    inputKeyGetter: args.inputKey ? (x) => x[args.inputKey] : undefined,
    mapperClass,
    reducerClass,
  }

  try {
    await mapReduce(options)
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.log(err.message)
    process.exit(-1)
  }

  // tslint:disable-next-line:no-console
  console.log('done')
}

// tslint:disable-next-line
main()
