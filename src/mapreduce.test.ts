global.TextEncoder = require('util').TextEncoder
global.TextDecoder = require('util').TextDecoder

import { AnyFileSystem } from '@wholebuzz/fs/lib/fs'
import { GoogleCloudFileSystem } from '@wholebuzz/fs/lib/gcp'
import { LocalFileSystem } from '@wholebuzz/fs/lib/local'
import { S3FileSystem } from '@wholebuzz/fs/lib/s3'
import { hashFile } from 'dbcp/dist/test.fixture'
import { SetKeyMapper } from './mappers'
import { mapReduce } from './mapreduce'
import { DeleteKeyReducer, IdentityReducer } from './reducers'

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

it('Should resort by guid', async () => {
  await mapReduce({
    configuration: { setKey: 'guid' },
    fileSystem,
    inputPaths: [testJsonUrl],
    outputPath: targetShardedNDJsonUrl,
    outputShards: targetShardedNumShards,
    mapperClass: SetKeyMapper,
    reducerClass: IdentityReducer,
  })
})

it('Should resort by id', async () => {
  await mapReduce({
    configuration: { setKey: 'id' },
    fileSystem,
    inputPaths: [targetShardedNDJsonUrl],
    outputPath: targetNDJsonUrl,
    outputShards: 1,
    mapperClass: SetKeyMapper,
    reducerClass: DeleteKeyReducer,
  })
  expect(await hashFile(fileSystem, targetNDJsonUrl)).toBe(targetNDJsonHash)
})
