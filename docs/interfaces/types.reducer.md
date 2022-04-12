[@wholebuzz/mapreduce](../README.md) / [Exports](../modules.md) / [types](../modules/types.md) / Reducer

# Interface: Reducer<Key, Value\>

[types](../modules/types.md).Reducer

## Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

## Hierarchy

- [*Base*](types.base.md)<Key, Value\>

  ↳ **Reducer**

## Implemented by

- [*IdentityReducer*](../classes/reducers.identityreducer.md)

## Table of contents

### Properties

- [cleanup](types.reducer.md#cleanup)
- [configure](types.reducer.md#configure)
- [reduce](types.reducer.md#reduce)
- [setup](types.reducer.md#setup)

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

Inherited from: [Base](types.base.md).[cleanup](types.base.md#cleanup)

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

Inherited from: [Base](types.base.md).[configure](types.base.md#configure)

Defined in: [src/types.ts:23](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L23)

___

### reduce

• **reduce**: (`key`: Key, `values`: Value[], `context`: [*ReduceContext*](types.reducecontext.md)<Key, Value\>) => *void* \| *Promise*<void\>

#### Type declaration

▸ (`key`: Key, `values`: Value[], `context`: [*ReduceContext*](types.reducecontext.md)<Key, Value\>): *void* \| *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | Key |
| `values` | Value[] |
| `context` | [*ReduceContext*](types.reducecontext.md)<Key, Value\> |

**Returns:** *void* \| *Promise*<void\>

Defined in: [src/types.ts:53](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L53)

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

Inherited from: [Base](types.base.md).[setup](types.base.md#setup)

Defined in: [src/types.ts:24](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L24)
