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
const { identityMapper } = require('./mappers')
const { identityReducer } = require('./reducers')
const { mapReduce } = require('./mapreduce')

dotenv.config()
// tslint:disable-next-line:no-console
process.on('uncaughtException', (err) => console.error('unhandled exception', err))

async function main() {
  const formats = Object.values(DatabaseCopyFormat)
  const args = yargs.strict().options({
    inputKey: {
      description: 'Source file',
      type: 'string',
    },
    inputPaths: {
      description: 'Source file',
      required: true,
      type: 'array',
    },
    inputFormat: {
      choices: formats,
    },
    outputPath: {
      description: 'Target file',
      required: true,
      type: 'string',
    },
    outputFormat: {
      choices: formats,
    },
    outputShards: {
      description: 'Target shards',
      type: 'number',
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

  const options = {
    ...args,
    fileSystem,
    inputKeyGetter: args.inputKey ? (x) => x[args.inputKey] : undefined,
    mapperClass: identityMapper,
    reducerClass: identityReducer,
  }

  try {
    await mapReduce(options)
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.log(err.message)
    process.exit(-1)
  }

  console.log('done')
}

// tslint:disable-next-line
main()
