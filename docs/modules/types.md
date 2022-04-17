[@wholebuzz/mapreduce](../README.md) / [Exports](../modules.md) / types

# Module: types

## Table of contents

### References

- [Configuration](types.md#configuration)
- [InputSplit](types.md#inputsplit)
- [MapReduceBaseConfig](types.md#mapreducebaseconfig)
- [MapReduceJobConfig](types.md#mapreducejobconfig)
- [MapperImplementation](types.md#mapperimplementation)

### Interfaces

- [Base](../interfaces/types.base.md)
- [Context](../interfaces/types.context.md)
- [Item](../interfaces/types.item.md)
- [MapContext](../interfaces/types.mapcontext.md)
- [MapReduceRuntimeConfig](../interfaces/types.mapreduceruntimeconfig.md)
- [Mapper](../interfaces/types.mapper.md)
- [ReduceContext](../interfaces/types.reducecontext.md)
- [Reducer](../interfaces/types.reducer.md)

### Type aliases

- [MapperClass](types.md#mapperclass)
- [Plugin](types.md#plugin)
- [ReducerClass](types.md#reducerclass)

## References

### Configuration

Re-exports: [Configuration](../interfaces/config.configuration.md)

___

### InputSplit

Re-exports: [InputSplit](../interfaces/config.inputsplit.md)

___

### MapReduceBaseConfig

Re-exports: [MapReduceBaseConfig](../interfaces/config.mapreducebaseconfig.md)

___

### MapReduceJobConfig

Re-exports: [MapReduceJobConfig](../interfaces/config.mapreducejobconfig.md)

___

### MapperImplementation

Re-exports: [MapperImplementation](../enums/config.mapperimplementation.md)

## Type aliases

### MapperClass

Ƭ **MapperClass**<Key, Value\>: [*Factory*](plugins.md#factory)<[*Mapper*](../interfaces/types.mapper.md)<Key, Value\>\>

#### Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

Defined in: [src/types.ts:18](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L18)

___

### Plugin

Ƭ **Plugin**<Key, Value\>: [*Mapper*](../interfaces/types.mapper.md)<Key, Value\> \| [*Reducer*](../interfaces/types.reducer.md)<Key, Value\>

#### Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

Defined in: [src/types.ts:55](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L55)

___

### ReducerClass

Ƭ **ReducerClass**<Key, Value\>: [*Factory*](plugins.md#factory)<[*Reducer*](../interfaces/types.reducer.md)<Key, Value\>\>

#### Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

Defined in: [src/types.ts:19](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L19)
