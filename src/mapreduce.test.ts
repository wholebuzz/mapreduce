global.TextEncoder = require('util').TextEncoder
global.TextDecoder = require('util').TextDecoder

import { AnyFileSystem } from '@wholebuzz/fs/lib/fs'
import { GoogleCloudFileSystem } from '@wholebuzz/fs/lib/gcp'
import { LocalFileSystem } from '@wholebuzz/fs/lib/local'
import { S3FileSystem } from '@wholebuzz/fs/lib/s3'
import { openNullWritable } from '@wholebuzz/fs/lib/stream'
import { logger, shardedFilename, shardedFilenames } from '@wholebuzz/fs/lib/util'
import { dbcp, getShardFunction } from 'dbcp'
import {
  execCommand,
  expectCreateFilesWithHashes,
  expectCreateFileWithHash,
} from 'dbcp/dist/test.fixture'
import { IdentityMapper } from './mappers'
import { getShardFilter, mapReduce, newJobId } from './mapreduce'
import { IdentityReducer } from './reducers'
import { MapperImplementation, MapReduceJobConfig } from './types'

const fileSystem = new AnyFileSystem([
  { urlPrefix: 'gs://', fs: new GoogleCloudFileSystem() },
  { urlPrefix: 's3://', fs: new S3FileSystem() },
  { urlPrefix: '', fs: new LocalFileSystem() },
])

const testJsonUrl = './test/test-SSSS-of-NNNN.json.gz'
const targetNDJsonUrl = '/tmp/mapreduce-test-final.jsonl.gz'
const targetNDJsonHash = 'abb7fe0435d553c375c28e52aee28bdb'
const targetShardedNumShards = 8
const targetShardedNDJsonUrl = '/tmp/mapreduce-test-target-SSSS-of-NNNN.json.gz'
const targetShardedNDHash = [
  '1697f4a5df9d6d9b2f3febb30cffb2f5',
  '2835eaf9c6f6937f6cdec43e7f92f3d5',
  'c3d60b41b0d7e79dc26e5b44fccca0e4',
  '1fb2202908b8276533630ea13afa6734',
  '378fd368ba83e2465eb112f7fcff23dc',
  'a6e80d0c66919db56a20f32e2cc250d9',
  '9f6e5eb0527f7d6fd9453a753f6b3c25',
  '2332d51e6158add38c4635423883083b',
]

describe('With MapperImplementation.externalSorting', () => {
  const mapperImplementation = MapperImplementation.externalSorting
  describe('With single-thread', () => {
    it('Should sort by guid', () => testMapReduceSortByGuid({ mapperImplementation }))
    it('Should sort by id', () => testMapReduceSortById({ mapperImplementation }))
  })
  describe('With separately executed workers', () => {
    it('Should sort by guid', () => testExecMapReduceSortByGuid({ mapperImplementation }))
    it('Should sort by id', () => testExecMapReduceSortById({ mapperImplementation }))
  })
})

describe('With MapperImplementation.leveldb', () => {
  const mapperImplementation = MapperImplementation.leveldb
  describe('With single-thread', () => {
    it('Should sort by guid', () => testMapReduceSortByGuid({ mapperImplementation }))
    it('Should sort by id', () => testMapReduceSortById({ mapperImplementation }))
  })
  describe('With separately executed workers', () => {
    it('Should sort by guid', () => testExecMapReduceSortByGuid({ mapperImplementation }))
    it('Should sort by id', () => testExecMapReduceSortById({ mapperImplementation }))
  })
})

async function testMapReduceSortByGuid<Key, Value>(
  options: Partial<MapReduceJobConfig<Key, Value>>
) {
  const keyProperty = 'guid'
  await expectCreateFilesWithHashes(
    fileSystem,
    shardedFilenames(targetShardedNDJsonUrl, targetShardedNumShards),
    targetShardedNDHash,
    () =>
      mapReduce({
        configuration: { keyProperty },
        fileSystem,
        inputPaths: [testJsonUrl],
        outputPath: targetShardedNDJsonUrl,
        outputShards: targetShardedNumShards,
        logger,
        mapperClass: IdentityMapper,
        reducerClass: IdentityReducer,
        ...options,
      })
  )
  await verifyShardedOutput(targetShardedNDJsonUrl, targetShardedNumShards, keyProperty)
}

async function testMapReduceSortById<Key, Value>(options: Partial<MapReduceJobConfig<Key, Value>>) {
  await expectCreateFileWithHash(fileSystem, targetNDJsonUrl, targetNDJsonHash, () =>
    mapReduce({
      configuration: { keyProperty: 'id' },
      fileSystem,
      inputPaths: [targetShardedNDJsonUrl],
      outputPath: targetNDJsonUrl,
      outputShards: 1,
      logger,
      mapperClass: IdentityMapper,
      reducerClass: IdentityReducer,
      ...options,
    })
  )
}

async function testExecMapReduceSortByGuid<Key, Value>(
  options: Partial<MapReduceJobConfig<Key, Value>>
) {
  const keyProperty = 'guid'
  await testExecMapReduce({
    config: `-D keyProperty=${keyProperty}`,
    inputPath: testJsonUrl,
    keyProperty,
    mapper: 'IdentityMapper',
    mapperImplementation: options.mapperImplementation,
    outputHash: targetShardedNDHash,
    outputPath: targetShardedNDJsonUrl,
    outputShards: targetShardedNumShards,
    reducer: 'IdentityReducer',
  })
}

async function testExecMapReduceSortById<Key, Value>(
  options: Partial<MapReduceJobConfig<Key, Value>>
) {
  const keyProperty = 'id'
  await testExecMapReduce({
    config: `-D keyProperty=${keyProperty}`,
    inputPath: targetShardedNDJsonUrl,
    keyProperty,
    mapper: 'IdentityMapper',
    mapperImplementation: options.mapperImplementation,
    outputHash: [targetNDJsonHash],
    outputPath: targetNDJsonUrl,
    outputShards: 1,
    reducer: 'IdentityReducer',
  })
}

async function testExecMapReduce(options: {
  config?: string
  inputPath: string
  keyProperty: string
  mapper: string
  mapperImplementation?: MapperImplementation
  numWorkers?: number
  outputHash: string[]
  outputPath: string
  outputShards: number
  reducer: string
}) {
  const numWorkers = options.numWorkers || options.outputShards
  const jobid = newJobId()
  const args =
    `--map ${options.mapper} --reduce ${options.reducer} ` +
    `--jobid ${jobid} ` +
    `--inputPaths ${options.inputPath} ` +
    `--outputPath ${options.outputPath} ` +
    `--outputShards ${options.outputShards} ` +
    `--numWorkers ${numWorkers} ` +
    (options.config ?? '')
  await Promise.all(
    new Array(options.outputShards).fill(undefined).map((_, i) =>
      expectCreateFilesWithHashes(
        fileSystem,
        options.outputShards > 1
          ? shardedFilenames(
              options.outputPath,
              options.outputShards,
              getShardFilter(i, numWorkers)
            )
          : [options.outputPath],
        options.outputShards > 1
          ? options.outputHash.filter((__, j) => !!getShardFilter(i, numWorkers)?.(j))
          : options.outputHash,
        async () => {
          const command = `yarn --silent start ${args} --workerIndex ${i}`
          const output = await execCommand(command)
          console.log('testSortByGuidWithExec execCommand', command, output)
        }
      )
    )
  )
  await verifyShardedOutput(options.outputPath, options.outputShards, options.keyProperty)
}

async function verifyShardedOutput(url: string, numShards: number, keyProperty: string) {
  const shardFunction = getShardFunction({ shardBy: keyProperty })
  let total = 0
  for (let i = 0; i < numShards; i++) {
    const shard = { index: i, modulus: numShards }
    let shardTotal = 0
    let lastKey = ''
    await dbcp({
      fileSystem,
      inputFiles: [{ url: shardedFilename(url, shard) }],
      outputStream: [openNullWritable()],
      transformObject: (input) => {
        const x = input as Record<string, any>
        const key = x[keyProperty]
        expect(shardFunction(x, numShards)).toBe(shard.index)
        if (shardTotal > 0) expect(key < lastKey).toBe(false)
        shardTotal++
        lastKey = key
      },
    })
    total += shardTotal
  }
  expect(total).toBe(10000)
}
