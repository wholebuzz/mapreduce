import { keyProperty, ReducerClass } from './mapreduce'

export const IdentityReducer: ReducerClass = () => ({
  reduce: (key, value, context) => context.write(key, value[0]),
})

export const DeleteKeyReducer: ReducerClass = () => ({
  reduce: (key, value, context) => {
    delete value[0][keyProperty]
    context.write(key, value[0])
  },
})
