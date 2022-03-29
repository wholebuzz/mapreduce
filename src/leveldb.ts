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
import {
  defaultKeyProperty,
  defaultValueProperty,
  getItemValueAccessor,
  mappedObject,
  mapTransform,
} from './mapreduce'
import { getObjectClassName } from './plugins'
import { Configuration, Item, Mapper, MapReduceJobConfig, ReduceContext, Reducer } from './types'

export async function runMapPhaseWithLevelDb<Key, Value>(
  mapper: Mapper<Key, Value>,
  combiner: Reducer<Key, Value> | undefined,
  args: MapReduceJobConfig<Key, Value>,
  options: DatabaseCopyOptions
) {
  const outputFile = options.outputFile!
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
      outputFile: undefined,
      tempDirectories: undefined,
    }
    if (args.logger) {
      args.logger.info(
        `runMapPhaseWithLevelDb ${getObjectClassName(mapper) || 'map'} ${JSON.stringify(options)}`
      )
    }
    await dbcp({
      ...options,
      fileSystem: args.fileSystem,
      inputFiles: updateObjectProperties(options.inputFiles, (x) => ({
        ...x,
        transformInputObjectStream: () =>
          mapTransform(mapper, {
            configuration: args.configuration,
          }),
      })),
      outputFormat: DatabaseCopyFormat.object,
      outputStream: dbs.map((db) =>
        StreamTree.writable(
          streamAsyncFilter(async (item: Item) =>
            combineWithLevelDb(item, db.db, {
              configuration: args.configuration,
              combiner,
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
            inputStream: streamFromCombinedLevelDb(db.db),
            outputFile: shardedFilename(outputFile, {
              index,
              modulus: options.outputShards!,
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

export async function combineWithLevelDb<Key, Value>(
  out: Item,
  leveldb: level.LevelDB | LevelUp,
  args: {
    configuration?: Configuration
    combiner?: Reducer<Key, Value>
    transform?: (value: Item) => Item
  }
) {
  const combinerOutput: Item[] = []
  const configuration = args.configuration ?? {}
  const keyProperty = configuration.keyProperty ?? defaultKeyProperty
  const valueProperty = configuration.valueProperty ?? defaultValueProperty
  const getItemKey = getItemValueAccessor(keyProperty)
  const getItemValue = getItemValueAccessor(valueProperty)
  const context: ReduceContext<Key, Value> = {
    configuration,
    currentItem: [],
    currentKey: getItemKey(out),
    currentValue: undefined!,
    keyProperty,
    valueProperty,
    write: (key: Key, value: any) => {
      if (key !== context.currentKey) throw new Error(`Combiner can't change key`)
      combinerOutput.push(mappedObject(key, value, context, args?.transform))
    },
  }

  let current: Item[] = []
  const leveldbKey =
    typeof context.currentKey === 'number'
      ? formatNumberForUtf8Sort(context.currentKey)
      : context.currentKey
  try {
    current = (await leveldb.get(leveldbKey)) || []
  } catch (_err) {
    /* */
  }
  current.push(out)

  const runCombiner = current.length > 1 && !!args.combiner
  if (runCombiner) {
    context.currentItem = current
    context.currentValue = context.currentItem.map(getItemValue)
    const combinerRunning = args.combiner!.reduce(
      context.currentKey!,
      context.currentValue,
      context
    )
    if ((combinerRunning as any)?.then) await combinerRunning
  }
  await leveldb.put(leveldbKey, runCombiner ? combinerOutput : current)
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
