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
  inputIsSqlDatabase,
} = require('dbcp/dist/format')
const dotenv = require('dotenv')
const yargs = require('yargs')
const { mapReduce } = require('./mapreduce')
const {
  applyJobConfigToYargs,
  deduplicateYargs,
  parseConfiguration,
  loadConfigurationCode,
} = require('./plugins')
const { getName, getUser, getWorkDirectory, newJobId, prepareRuntime } = require('./runtime')
const { getSplits } = require('./splits')
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
      cleanup: {
        description: 'Clean up',
        type: 'boolean',
      },
      combine: {
        description: 'Combiner name',
        type: 'string',
      },
      config: {
        alias: 'D',
        description: 'Configuration',
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
      inputSplitSize: {
        description: 'Input split size',
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
    })
    .check(async (args) => {
      configuration = parseConfiguration(args.config)
      delete args.config
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
      async (args) => {
        if (args.new) {
          delete args.new
          const name = getName(configuration.name)
          const user = getUser(configuration.user)
          const jobid = newJobId(name)
          returnValue = {
            ...deduplicateYargs(args),
            configuration: {
              ...configuration,
              name,
              user,
            },
            jobid,
          }
          if (returnValue.inputPaths) {
            returnValue.splits = await getSplits(fileSystem, args.inputPaths, args.inputSplitSize)
          }
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
          jobConfig: {
            description: 'Job config JSON',
            type: 'string',
          },
          jobConfigFile: {
            description: 'Job config file',
            type: 'string',
          },
        }),
      async (args) => {
        const options = await applyJobConfigToYargs(fileSystem, args)
        if (!options.inputPaths && !inputIsSqlDatabase(args.inputType)) {
          throw new Error('No inputPaths')
        }
        if (!options.outputPath) {
          throw new Error('No outputPath')
        }
        try {
          await mapReduce(
            await prepareRuntime(fileSystem, logger, {
              ...options,
              configuration: loadConfigurationCode({
                ...options.configuration,
                ...configuration,
              }),
            })
          )
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
