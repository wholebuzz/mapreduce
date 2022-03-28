import { Context, Item, Reducer } from './types'

export class IdentityReducer<Key, Value> implements Reducer<Key, Value> {
  reduce(key: Key, values: Value[], context: Context<Key, Value>) {
    context.write(key, values[0])
  }
}

export class DeleteKeyReducer<Key, Value extends Item> implements Reducer<Key, Value> {
  reduce(key: Key, values: Value[], context: Context<Key, Value>) {
    delete values[0][context.keyProperty]
    context.write(key, values[0])
  }
}
