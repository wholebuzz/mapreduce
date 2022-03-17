import { handleAsyncFunctionCallback } from '@wholebuzz/fs/lib/stream'
import level from 'level'
import { LevelUp } from 'levelup'
import { Transform } from 'stream'
import { mappedObject } from './mapreduce'
import { Configuration, Key, KeyGetter, Mapper, Reducer, Value } from './types'

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
