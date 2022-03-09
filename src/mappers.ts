import { MapperClass } from './mapreduce'

export const identityMapper: MapperClass = {
  createMapper: () => ({
    map: (key, value, context) => context.write(key, value),
  }),
}