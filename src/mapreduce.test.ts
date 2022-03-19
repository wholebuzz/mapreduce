global.TextEncoder = require('util').TextEncoder
global.TextDecoder = require('util').TextDecoder

import { AnyFileSystem } from '@wholebuzz/fs/lib/fs'
import { GoogleCloudFileSystem } from '@wholebuzz/fs/lib/gcp'
import { LocalFileSystem } from '@wholebuzz/fs/lib/local'
import { S3FileSystem } from '@wholebuzz/fs/lib/s3'
import { openNullWritable } from '@wholebuzz/fs/lib/stream'
import { logger, shardedFilename, shardedFilenames } from '@wholebuzz/fs/lib/util'
import { dbcp, getShardFunction } from 'dbcp'
import { expectCreateFilesWithHashes, expectCreateFileWithHash } from 'dbcp/dist/test.fixture'
import { SetKeyMapper } from './mappers'
import { mapReduce } from './mapreduce'
import { DeleteKeyReducer, IdentityReducer } from './reducers'
import { MapperImplementation, MapReduceJobConfig } from './types'

const fileSystem = new AnyFileSystem([
  { urlPrefix: 'gs://', fs: new GoogleCloudFileSystem() },
  { urlPrefix: 's3://', fs: new S3FileSystem() },
  { urlPrefix: '', fs: new LocalFileSystem() },
])

const testJsonUrl = './test/test-SSSS-of-NNNN.json.gz'
const targetShardedNDJsonUrl = '/tmp/mapreduce-test-target-SSSS-of-NNNN.json.gz'
const targetShardedNumShards = 8
const targetNDJsonUrl = '/tmp/mapreduce-test-final.jsonl.gz'
const targetNDJsonHash = 'abb7fe0435d553c375c28e52aee28bdb'

describe('With MapperImplementation.externalSorting', () => {
  const mapperImplementation = MapperImplementation.externalSorting
  it('Should sort by guid', () => testSortByGuid({ mapperImplementation }))
  it('Should sort by id', () => testSortById({ mapperImplementation }))
})

describe('With MapperImplementation.leveldb', () => {
  const mapperImplementation = MapperImplementation.leveldb
  it('Should sort by guid', () => testSortByGuid({ mapperImplementation }))
  it('Should sort by id', () => testSortById({ mapperImplementation }))
})

async function testSortByGuid(options: Partial<MapReduceJobConfig>) {
  const keyProperty = 'guid'
  await expectCreateFilesWithHashes(
    fileSystem,
    shardedFilenames(targetShardedNDJsonUrl, targetShardedNumShards),
    [
      '8c41a90b16f51c9e98d4477c5ffbd4c8',
      '87e68e628ff39ab62bf55f179d584420',
      '45441d7e7da8823aa1f7eb828fd6e956',
      '7ce11a1993f820c994cef7d2090a9056',
      '1de48ba808a6c5fb9579f73d667614c2',
      'c6392b80d6cf97b988c026895f982015',
      'e9aaba3d14eb0fd64a8a51b1995bb682',
      '1806f58cf21c155e5e6dd8d9ab5a1a07',
    ],
    () =>
      mapReduce({
        configuration: { setKey: keyProperty },
        fileSystem,
        inputPaths: [testJsonUrl],
        outputPath: targetShardedNDJsonUrl,
        outputShards: targetShardedNumShards,
        logger,
        mapperClass: SetKeyMapper,
        reducerClass: IdentityReducer,
        ...options,
      })
  )
  const shardFunction = getShardFunction({ shardBy: keyProperty })
  let total = 0
  for (let i = 0; i < targetShardedNumShards; i++) {
    const shard = { index: i, modulus: targetShardedNumShards }
    let shardTotal = 0
    let lastKey = ''
    await dbcp({
      fileSystem,
      sourceFiles: [{ url: shardedFilename(targetShardedNDJsonUrl, shard) }],
      targetStream: [openNullWritable()],
      transformObject: (input) => {
        const x = input as Record<string, any>
        const key = x[keyProperty]
        expect(shardFunction(x, targetShardedNumShards)).toBe(shard.index)
        if (shardTotal > 0) expect(key < lastKey).toBe(false)
        shardTotal++
        lastKey = key
      },
    })
    total += shardTotal
  }
  expect(total).toBe(10000)
}

async function testSortById(options: Partial<MapReduceJobConfig>) {
  await expectCreateFileWithHash(fileSystem, targetNDJsonUrl, targetNDJsonHash, () =>
    mapReduce({
      configuration: { setKey: 'id' },
      fileSystem,
      inputPaths: [targetShardedNDJsonUrl],
      outputPath: targetNDJsonUrl,
      outputShards: 1,
      logger,
      mapperClass: SetKeyMapper,
      reducerClass: DeleteKeyReducer,
      ...options,
    })
  )
}
