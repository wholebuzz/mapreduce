import pSettle from 'p-settle'
import type { Context, Item, Mapper, MapReduceJobConfig } from './types'

export class IdentityMapper<Key, Value> implements Mapper<Key, Value> {
  map(key: Key, value: Value, context: Context<Key, Value>) {
    context.write(key, value)
  }
}

export class SetKeyMapper<Key, Value extends Item> implements Mapper<Key, Value> {
  configure(args: MapReduceJobConfig<Key, Value>) {
    const key: Key | undefined = undefined
    console.log('SetKeyMapper ', typeof key)
    if (!args.configuration?.setKey) throw new Error(`SetKeyMapper requires -D setKey=x`)
  }

  map(_key: Key, value: Value, context: Context<Key, Value>) {
    context.write(value[context.configuration.setKey], value)
  }
}

export class IterableMapper<Key, Value> implements Mapper<Key, Value> {
  map(key: Key, value: Value | Value[], context: Context<Key, Value>) {
    if (Array.isArray(value)) {
      for (const item of value) this.mapItem(key, item, context)
    } else {
      this.mapItem(key, value, context)
    }
  }

  mapItem(key: Key, value: Value, context: Context<Key, Value>) {
    context.write(key, value)
  }
}

export class AsyncIterableMapper<Key, Value> implements Mapper<Key, Value> {
  concurrency = 1

  async map(key: Key, value: Value | Value[], context: Context<Key, Value>) {
    if (Array.isArray(value)) {
      const res = await pSettle(
        value.map((item) => () => this.mapItem(key, item, context)),
        { concurrency: this.concurrency }
      )
      for (const x of res) {
        if (x.isRejected) throw new Error(`AsyncIterableMapper: ${x.reason}`)
      }
    } else {
      await this.mapItem(key, value, context)
    }
  }

  async mapItem(key: Key, value: Value, context: Context<Key, Value>) {
    context.write(key, value)
  }
}
