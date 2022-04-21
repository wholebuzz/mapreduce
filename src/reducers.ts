import { getConfigurationValue } from './runtime'
import { MapReduceRuntimeConfig, ReduceContext, Reducer } from './types'

export class IdentityReducer<Key, Value> implements Reducer<Key, Value> {
  reduce(key: Key, values: Value[], context: ReduceContext<Key, Value>) {
    context.write(key, values[0])
  }
}

export class MergeNamedValuesReducer<Key, Value> implements Reducer<Key, Value> {
  reduce(key: Key, values: Array<Record<string, any>>, context: ReduceContext<Key, Value>) {
    const merged: Record<string, any> = {}
    values.forEach((value, i) => {
      merged[context.currentItemSource![i]] = value
    })
    context.write(key, merged)
  }
}

export class MergePropertiesReducer<Key> implements Reducer<Key, Record<string, any>> {
  combineProperty = <X>(_oldVal: X, newVal: X): X => newVal

  configure(config: MapReduceRuntimeConfig<Key, Record<string, any>>) {
    if (config.configuration?.combineProperty) {
      this.combineProperty = getConfigurationValue(
        config.configuration,
        'combineProperty',
        'function'
      )
    }
  }

  reduce(
    key: Key,
    values: Array<Record<string, any>>,
    context: ReduceContext<Key, Record<string, any>>
  ) {
    const value = values[0]
    for (let i = 1; i < values.length; i++) {
      const valN = values[i]
      for (const keyI of Object.keys(valN)) {
        value[keyI] = this.combineProperty(value[keyI], valN[keyI])
      }
    }
    context.write(key, value)
  }
}

export class DeleteFalsyPropertiesReducer<Key> implements Reducer<Key, Record<string, any>> {
  reduce(
    key: Key,
    values: Array<Record<string, any>>,
    context: ReduceContext<Key, Record<string, any>>
  ) {
    const value = values[0]
    for (const keyI of Object.keys(value)) {
      if (!value[keyI] && value[keyI] !== false) delete value.keyI
    }
    context.write(key, value)
  }
}
