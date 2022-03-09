import { keyProperty, ReducerClass } from './mapreduce'

export const identityReducer: ReducerClass = {
  createReducer: () => ({
    reduce: (key, value, context) => context.write(key, value[0]),
  }),
}

export const cleanupIdentityReducer: ReducerClass = {
  createReducer: () => ({
    reduce: (key, value, context) => {
      delete value[0][keyProperty]
      context.write(key, value[0])
    },
  }),
}
