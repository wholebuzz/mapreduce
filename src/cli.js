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

dotenv.config()
// tslint:disable-next-line:no-console
process.on('uncaughtException', (err) => console.error('unhandled exception', err))

async function main() {
  const formats = Object.values(DatabaseCopyFormat)
  const args = yargs.strict().options({
    inputPaths: {
      description: 'Source file',
      type: 'array',
      required: true,
    },
    inputFormat: {
      choices: formats,
    },
    outputPath: {
      description: 'Target file',
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
    mapperClass: {
      createMapper: () => ({
        map: (key, value, context) => {
          context.write(value.guid, value)
        },
      }),
    },
    reducerClass: {
      createReducer: () => ({
        reduce: (key, value, context) => {
          context.write(value.guid, value)
        },
      }),
    },
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
