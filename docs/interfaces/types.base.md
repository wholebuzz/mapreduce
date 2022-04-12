[@wholebuzz/mapreduce](../README.md) / [Exports](../modules.md) / [types](../modules/types.md) / Base

# Interface: Base<Key, Value\>

[types](../modules/types.md).Base

## Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

## Hierarchy

- **Base**

  ↳ [*Mapper*](types.mapper.md)

  ↳ [*Reducer*](types.reducer.md)

## Table of contents

### Properties

- [cleanup](types.base.md#cleanup)
- [configure](types.base.md#configure)
- [setup](types.base.md#setup)

## Properties

### cleanup

• `Optional` **cleanup**: (`context`: [*Context*](types.context.md)<Key, Value\>) => *Promise*<void\>

#### Type declaration

▸ (`context`: [*Context*](types.context.md)<Key, Value\>): *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [*Context*](types.context.md)<Key, Value\> |

**Returns:** *Promise*<void\>

Defined in: [src/types.ts:25](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L25)

___

### configure

• `Optional` **configure**: (`config`: [*MapReduceJobConfig*](types.mapreducejobconfig.md)<Key, Value\>) => *void*

#### Type declaration

▸ (`config`: [*MapReduceJobConfig*](types.mapreducejobconfig.md)<Key, Value\>): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [*MapReduceJobConfig*](types.mapreducejobconfig.md)<Key, Value\> |

**Returns:** *void*

Defined in: [src/types.ts:23](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L23)

___

### setup

• `Optional` **setup**: (`context`: [*Context*](types.context.md)<Key, Value\>) => *Promise*<void\>

#### Type declaration

▸ (`context`: [*Context*](types.context.md)<Key, Value\>): *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [*Context*](types.context.md)<Key, Value\> |

**Returns:** *Promise*<void\>

Defined in: [src/types.ts:24](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L24)
