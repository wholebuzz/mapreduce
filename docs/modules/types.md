[@wholebuzz/mapreduce](../README.md) / [Exports](../modules.md) / types

# Module: types

## Table of contents

### Enumerations

- [MapperImplementation](../enums/types.mapperimplementation.md)

### Interfaces

- [Base](../interfaces/types.base.md)
- [Configuration](../interfaces/types.configuration.md)
- [Context](../interfaces/types.context.md)
- [Item](../interfaces/types.item.md)
- [MapContext](../interfaces/types.mapcontext.md)
- [MapReduceJobConfig](../interfaces/types.mapreducejobconfig.md)
- [Mapper](../interfaces/types.mapper.md)
- [ReduceContext](../interfaces/types.reducecontext.md)
- [Reducer](../interfaces/types.reducer.md)

### Type aliases

- [MapperClass](types.md#mapperclass)
- [ReducerClass](types.md#reducerclass)

## Type aliases

### MapperClass

Ƭ **MapperClass**<Key, Value\>: [*Factory*](plugins.md#factory)<[*Mapper*](../interfaces/types.mapper.md)<Key, Value\>\>

#### Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

Defined in: [src/types.ts:9](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L9)

___

### ReducerClass

Ƭ **ReducerClass**<Key, Value\>: [*Factory*](plugins.md#factory)<[*Reducer*](../interfaces/types.reducer.md)<Key, Value\>\>

#### Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

Defined in: [src/types.ts:10](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L10)
