import { defaultKeyProperty } from './mapreduce'
import { Context, Key, Reducer, Value } from './types'

export class IdentityReducer implements Reducer {
  reduce(key: Key, value: Value, context: Context) {
    context.write(key, value[0])
  }
}

export class DeleteKeyReducer implements Reducer {
  reduce(key: Key, value: Value, context: Context) {
    const keyProperty = context.configuration?.keyProperty || defaultKeyProperty
    delete value[0][keyProperty]
    context.write(key, value[0])
  }
}
