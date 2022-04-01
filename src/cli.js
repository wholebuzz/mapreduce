#!/usr/bin/env node

const {
  AnyFileSystem,
  GoogleCloudFileSystem,
  HTTPFileSystem,
  LocalFileSystem,
  S3FileSystem,
  SMBFileSystem,
} = require('@wholebuzz/fs')
const { logger } = require('@wholebuzz/fs/lib/util')
const {
  DatabaseCopyFormat,
  DatabaseCopyInputType,
  DatabaseCopyOutputType,
  DatabaseCopySchema,
  DatabaseCopyShardFunction,
} = require('dbcp/dist/format')
const dotenv = require('dotenv')
const yargs = require('yargs')
const { getShardFilter, getUser, getWorkDirectory, mapReduce, newJobId } = require('./mapreduce')
const { loadPlugin, loadPluginFiles, parseConfiguration } = require('./plugins')
const { MapperImplementation } = require('./types')

dotenv.config()
// tslint:disable-next-line:no-console
process.on('uncaughtException', (err) => console.error('unhandled exception', err))

async function main() {
  let returnValue
  let configuration = {}
  const formats = Object.values(DatabaseCopyFormat)
  const httpFileSystem = new HTTPFileSystem()
  const fileSystem = new AnyFileSystem([
    { urlPrefix: 'gs://', fs: new GoogleCloudFileSystem() },
    { urlPrefix: 's3://', fs: new S3FileSystem() },
    { urlPrefix: 'http://', fs: httpFileSystem },
    { urlPrefix: 'https://', fs: httpFileSystem },
    { urlPrefix: '', fs: new LocalFileSystem() },
  ])
  const mainArgs = await yargs
    .strict()
    .options({
      config: {
        alias: 'D',
        description: 'Configuration',
        type: 'string',
      },
    })
    .check(async (args) => {
      configuration = parseConfiguration(args.config)
      return true
    })
    .command(
      'job',
      'job',
      (commandYargs) =>
        commandYargs.options({
          new: {
            description: 'Generate new jobid',
            type: 'boolean',
          },
        }),
      (args) => {
        if (args.new) {
          const user = getUser(configuration.user)
          const jobid = newJobId(configuration.name)
          const workdir = getWorkDirectory(user, jobid)
          returnValue = { jobid, user, workdir }
        } else {
          throw new Error('job command required')
        }
      }
    )
    .command(
      '*',
      'mapreduce',
      (commandYargs) =>
        commandYargs.options({
          combine: {
            description: 'Combiner name',
            type: 'string',
          },
          inputFormat: {
            choices: formats,
          },
          inputHost: {
            description: 'Input host',
            type: 'string',
          },
          inputName: {
            description: 'Input database',
            type: 'string',
          },
          inputPassword: {
            description: 'Input database password',
            type: 'string',
          },
          inputPaths: {
            description: 'Input file',
            required: true,
            type: 'array',
          },
          inputPort: {
            description: 'Input database port',
            type: 'string',
          },
          inputShardBy: {
            description: 'Shard input by property',
            type: 'string',
          },
          inputShardFunction: {
            choices: ['number', 'string'],
            description: 'Input shard function',
            type: 'string',
          },
          inputShardIndex: {
            description: 'Input shard index',
            type: 'number',
          },
          inputShards: {
            description: 'Input shards',
            type: 'number',
          },
          inputTable: {
            description: 'Input database table',
            type: 'string',
          },
          inputType: {
            choices: Object.values(DatabaseCopyInputType),
            description: 'Input database type',
            type: 'string',
          },
          inputUser: {
            description: 'Input database user',
            type: 'string',
          },
          jobid: {
            description: 'Job-id for parallel worker synchronization',
            type: 'string',
          },
          localDirectory: {
            description: 'Local directory',
            type: 'string',
          },
          map: {
            description: 'Mapper name',
            type: 'string',
          },
          mapperImplementation: {
            choices: Object.values(MapperImplementation),
            description: 'Mapper implementation',
            type: 'string',
          },
          numWorkers: {
            default: 1,
            description: 'Number of workers',
            type: 'number',
          },
          outputFormat: {
            choices: formats,
          },
          outputHost: {
            description: 'Output host',
            type: 'string',
          },
          outputName: {
            description: 'Output database',
            type: 'string',
          },
          outputPassword: {
            description: 'Output database password',
            type: 'string',
          },
          outputPath: {
            description: 'Output file',
            required: true,
            type: 'string',
          },
          outputPort: {
            description: 'Output database port',
            type: 'string',
          },
          outputShardFunction: {
            choices: Object.values(DatabaseCopyShardFunction),
            description: 'Output shard function',
            type: 'string',
          },
          outputShards: {
            description: 'Output shards',
            type: 'number',
          },
          outputTable: {
            description: 'Output database table',
            type: 'string',
          },
          outputType: {
            choices: Object.values(DatabaseCopyOutputType),
            description: 'Output database type',
            type: 'string',
          },
          outputUser: {
            description: 'Output database user',
            type: 'string',
          },
          plugins: {
            description: 'Plugins file or directory',
            type: 'array',
          },
          reduce: {
            description: 'Reducer name',
            type: 'string',
          },
          runMap: {
            description: 'Run map',
            type: 'booleaan',
          },
          runReduce: {
            description: 'Run reduce',
            type: 'booleaan',
          },
          shuffleDirectory: {
            description: 'Shuffle directory',
            type: 'string',
          },
          synchronizeMap: {
            description: 'Write metadata files to synchronize multiple Mappers',
            type: 'boolean',
          },
          synchronizeReduce: {
            description: 'Write metadata files to synchronize multiple Reducers',
            type: 'boolean',
          },
          unpatchMap: {
            description: 'Unpatch map',
            type: 'booleaan',
          },
          unpatchReduce: {
            description: 'Unpatch reduce',
            type: 'booleaan',
          },
          verbose: {
            alias: 'v',
            description: 'Verbose',
            type: 'boolean',
          },
          workerIndex: {
            default: 0,
            description: 'Our worker index',
            type: 'number',
          },
        }),
      async (args) => {
        const plugins = loadPlugin(require('./mappers'), 'mappers')
        loadPlugin(require('./reducers'), 'reducers', plugins)
        for (const pluginFile of args.plugins ?? []) {
          await loadPluginFiles(fileSystem, pluginFile, plugins)
        }

        const mapperClass = args.map ? plugins[args.map] : plugins.IdentityMapper
        const reducerClass = args.reduce ? plugins[args.reduce] : plugins.IdentityReducer
        const combinerClass = args.combine ? plugins[args.combine] : undefined
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
        const options = {
          ...args,
          combinerClass,
          configuration: parseConfiguration(args.config),
          fileSystem,
          inputShardFilter: shardFilter,
          logger,
          mapperClass,
          outputShardFilter: shardFilter,
          reducerClass,
        }

        try {
          await mapReduce(options)
          returnValue = { inputPaths: args.inputPaths, outputPath: args.outputPath }
        } catch (err) {
          logger.info(err.message)
          if (args.verbose) {
            // tslint:disable-next-line:no-console
            console.error(err)
          }
          process.exit(-1)
        }
      }
    )
    .help()
    .parse()

  logger.info(returnValue ? 'Return value follows' : 'No return value')
  // tslint:disable-next-line:no-console
  console.log(JSON.stringify(returnValue))
}

// tslint:disable-next-line
main()
