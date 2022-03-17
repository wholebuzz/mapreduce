import { handleAsyncFunctionCallback } from '@wholebuzz/fs/lib/stream'
import { shardedFilename } from '@wholebuzz/fs/lib/util'
import { DatabaseCopyOptions, dbcp } from 'dbcp'
import { DatabaseCopyFormat } from 'dbcp/dist/format'
import { openLevelDb, streamFromLevelDb, streamToLevelDb } from 'dbcp/dist/leveldb'
import { updateObjectProperties } from 'dbcp/dist/util'
import level from 'level'
import { LevelUp } from 'levelup'
import pSettle from 'p-settle'
import { Transform } from 'stream'
import { mappedObject, mapTransform } from './mapreduce'
import { getObjectClassName } from './plugins'
import { Configuration, Key, KeyGetter, Mapper, MapReduceJobConfig, Reducer, Value } from './types'

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
      targetStream: dbs.map((db) => streamToLevelDb(db.db, { getKey: (x) => x[keyProperty] })),
    })

    // shuffle phase
    args.logger?.info('Start shuffle')
    const res = await pSettle(
      dbs.map(
        (db, index) => () =>
          dbcp({
            fileSystem: args.fileSystem,
            sourceStream: streamFromLevelDb(db.db),
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

export const mapAndCombineWithLevelDbTransform = (
  mapper: Mapper,
  leveldb: level.LevelDB | LevelUp,
  args: {
    configuration?: Configuration
    getInputKey?: KeyGetter
    keyProperty: string
    combiner?: Reducer
    transform?: (value: Value) => Value
  }
) =>
  new Transform({
    objectMode: true,
    transform(data, _, callback) {
      const output: Value[] = []
      const running = mapper.map(args?.getInputKey?.(data) ?? '', data, {
        configuration: args.configuration,
        write: (key: Key, value: any) =>
          output.push(
            mappedObject(key, value, {
              keyProperty: mapper.keyProperty ?? args.keyProperty,
              transform: args.transform,
            })
          ),
      })
      handleAsyncFunctionCallback(running, () => {
        new Promise<void>(async (resolve, _reject) => {
          // sort output and combine equivalent/adjacent
          for (const out of output) {
            const combinerOutput: Value[] = []
            const combineKey = out[args.keyProperty]
            const current = (await leveldb.get(combineKey)) || []
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
            await leveldb.put(combineKey, args.combiner ? combinerOutput : current)
          }
          resolve()
        })
          .then(() => callback())
          .catch((err) => callback(err))
      })
    },
  })
