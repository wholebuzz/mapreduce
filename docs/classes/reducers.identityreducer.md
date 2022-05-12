[@wholebuzz/mapreduce](../README.md) / [Exports](../modules.md) / [reducers](../modules/reducers.md) / IdentityReducer

# Class: IdentityReducer<Key, Value\>

[reducers](../modules/reducers.md).IdentityReducer

## Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

## Implements

- [*Reducer*](../interfaces/types.reducer.md)<Key, Value\>

## Table of contents

### Constructors

- [constructor](reducers.identityreducer.md#constructor)

### Methods

- [reduce](reducers.identityreducer.md#reduce)

## Constructors

### constructor

\+ **new IdentityReducer**<Key, Value\>(): [*IdentityReducer*](reducers.identityreducer.md)<Key, Value\>

#### Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

**Returns:** [*IdentityReducer*](reducers.identityreducer.md)<Key, Value\>

## Methods

### reduce

▸ **reduce**(`key`: Key, `values`: Value[], `context`: [*ReduceContext*](../interfaces/types.reducecontext.md)<Key, Value\>): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | Key |
| `values` | Value[] |
| `context` | [*ReduceContext*](../interfaces/types.reducecontext.md)<Key, Value\> |

**Returns:** *void*

Implementation of: Reducer.reduce

Defined in: [src/reducers.ts:5](https://github.com/wholebuzz/mapreduce/blob/master/src/reducers.ts#L5)
