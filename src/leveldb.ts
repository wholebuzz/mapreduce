import { streamAsyncFilter } from '@wholebuzz/fs/lib/stream'
import { shardedFilename } from '@wholebuzz/fs/lib/util'
import { DatabaseCopyOptions, dbcp } from 'dbcp'
import { DatabaseCopyFormat } from 'dbcp/dist/format'
import { levelIteratorStream, openLevelDb } from 'dbcp/dist/leveldb'
import { updateObjectProperties } from 'dbcp/dist/util'
import level from 'level'
import { LevelUp } from 'levelup'
import pSettle from 'p-settle'
import { Transform } from 'stream'
import StreamTree from 'tree-stream'
import { mapTransform } from './mapreduce'
import { getObjectClassName } from './plugins'
import { Configuration, Key, Mapper, MapReduceJobConfig, Reducer, Value } from './types'

export async function runMapPhaseWithLevelDb(
  mapper: Mapper,
  _combiner: Reducer | undefined,
  args: MapReduceJobConfig,
  options: DatabaseCopyOptions
) {
  const keyProperty = options.shardBy!
  const targetFile = options.targetFile!
  const concurrency = 1
  const leveldbs = await pSettle(
    options.tempDirectories!.map((x) => () => openLevelDb({ file: x + 'mapreduce.level' })),
    { concurrency }
  )
  try {
    const dbs = []
    for (const db of leveldbs) {
      if (db.isFulfilled) dbs.push(db.value)
      else throw new Error(`runMapPhase openLevelDb ${db.reason}`)
    }
    options = {
      ...options,
      targetFile: undefined,
      tempDirectories: undefined,
    }
    if (args.logger) {
      args.logger.info(
        `mapReduce ${getObjectClassName(mapper) || 'map'} ${JSON.stringify(options)}`
      )
    }
    await dbcp({
      ...options,
      fileSystem: args.fileSystem,
      sourceFiles: updateObjectProperties(options.sourceFiles, (x) => ({
        ...x,
        transformInputObjectStream: () =>
          mapTransform(mapper, {
            configuration: args.configuration,
            keyProperty,
            getInputKey: args.inputKeyGetter ?? ((v) => v[keyProperty]),
          }),
      })),
      targetFormat: DatabaseCopyFormat.object,
      targetStream: dbs.map((db) =>
        StreamTree.writable(
          streamAsyncFilter(async (item: any) =>
            combineWithLevelDb(item, db.db, {
              keyProperty,
            })
          )
        )
      ),
    })

    // shuffle phase
    args.logger?.info('Start shuffle')
    const res = await pSettle(
      dbs.map(
        (db, index) => () =>
          dbcp({
            fileSystem: args.fileSystem,
            sourceStream: streamFromCombinedLevelDb(db.db),
            targetFile: shardedFilename(targetFile, {
              index,
              modulus: options.targetShards!,
            }),
          })
      ),
      { concurrency }
    )
    for (const x of res) {
      if (!x.isFulfilled) throw new Error(`runMapPhase ${x.reason}`)
    }
  } catch (err) {
    throw err
  } finally {
    for (const db of leveldbs) if (db.isFulfilled) await db.value.close()
  }
}

export async function combineWithLevelDb(
  out: Value,
  leveldb: level.LevelDB | LevelUp,
  args: {
    configuration?: Configuration
    keyProperty: string
    combiner?: Reducer
  }
) {
  const combinerOutput: Value[] = []
  const combineKey = out[args.keyProperty]
  const leveldbKey =
    typeof combineKey === 'number' ? formatNumberForUtf8Sort(combineKey) : combineKey
  let current = []
  try {
    current = (await leveldb.get(leveldbKey)) || []
  } catch (_err) {
    /* */
  }
  current.push(out)
  if (current.length > 1 && args.combiner) {
    const combinerRunning = args.combiner.reduce(combineKey, current, {
      configuration: args.configuration,
      write: (key: Key, value: any) => {
        if (key !== combineKey) throw new Error(`Combiner can't change key`)
        combinerOutput.push(value)
      },
    })
    if ((combinerRunning as any).then) await combinerRunning
  }
  await leveldb.put(leveldbKey, args.combiner ? combinerOutput : current)
}

export function streamFromCombinedLevelDb(leveldb: level.LevelDB | LevelUp) {
  const iterator = levelIteratorStream(leveldb.iterator())
  return StreamTree.readable(iterator).pipe(
    new Transform({
      objectMode: true,
      transform(data, _, callback) {
        for (const item of data.value) this.push(item)
        callback()
      },
    })
  )
}

// maxIntegerDigits == '9007199254740991'.length == 16
export const maxIntegerDigits = Number.MAX_SAFE_INTEGER.toString().length

export const formatNumberForUtf8Sort = (value: number, reverse?: boolean) =>
  (reverse ? Number.MAX_SAFE_INTEGER - value : value).toString().padStart(maxIntegerDigits, '0')
