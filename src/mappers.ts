import { Context, Key, Mapper, MapperClass, MapReduceJobConfig, Value } from './mapreduce'

export const IdentityMapper: MapperClass = () => ({
  map: (key, value, context) => context.write(key, value),
})

export class SetKeyMapper implements Mapper {
  setKey: Key = ''

  configure(args: MapReduceJobConfig) {
    this.setKey = args.configuration?.setKey
  }

  map(_key: Key, value: Value, context: Context) {
    context.write(value[this.setKey], value)
  }
}
