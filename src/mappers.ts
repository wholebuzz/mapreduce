import type { Context, Key, Mapper, MapReduceJobConfig, Value } from './types'

export class IdentityMapper implements Mapper {
  map(key: Key, value: Value, context: Context) {
    context.write(key, value)
  }
}

export class SetKeyMapper implements Mapper {
  setKey: Key = ''

  configure(args: MapReduceJobConfig) {
    this.setKey = args.configuration?.setKey
  }

  map(_key: Key, value: Value, context: Context) {
    context.write(value[this.setKey], value)
  }
}

export class IterableMapper {
  map(key: Key, value: Value | Value[], context: Context) {
    if (Array.isArray(value)) {
      for (const item of value) this.mapItem(key, item, context)
    } else {
      this.mapItem(key, value, context)
    }
  }

  mapItem(key: Key, value: Value, context: Context) {
    context.write(key, value)
  }
}
