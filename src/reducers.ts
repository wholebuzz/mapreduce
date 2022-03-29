import { Context, Reducer } from './types'

export class IdentityReducer<Key, Value> implements Reducer<Key, Value> {
  reduce(key: Key, values: Value[], context: Context<Key, Value>) {
    context.write(key, values[0])
  }
}
