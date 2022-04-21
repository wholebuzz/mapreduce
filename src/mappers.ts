import pSettle from 'p-settle'
import { getConfigurationValue } from './runtime'
import type { Context, Mapper, MapReduceRuntimeConfig } from './types'

export class IdentityMapper<Key, Value> implements Mapper<Key, Value> {
  map(key: Key, value: Value, context: Context<Key, Value>) {
    context.write(key, value)
  }
}

export class TransformMapper<Key, Value> implements Mapper<Key, Value> {
  transform!: (value: Value, key?: Key) => Value

  configure(config: MapReduceRuntimeConfig<Key, Value>) {
    this.transform = getConfigurationValue(config.configuration, 'transform', 'function')
  }

  map(key: Key, value: Value, context: Context<Key, Value>) {
    value = this.transform(value, key)
    if (value) context.write(key, value)
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
