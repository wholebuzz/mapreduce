[@wholebuzz/mapreduce](../README.md) / [Exports](../modules.md) / [types](../modules/types.md) / Mapper

# Interface: Mapper<Key, Value\>

[types](../modules/types.md).Mapper

## Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

## Hierarchy

- [*Base*](types.base.md)<Key, Value\>

  ↳ **Mapper**

## Implemented by

- [*AsyncIterableMapper*](../classes/mappers.asynciterablemapper.md)
- [*IdentityMapper*](../classes/mappers.identitymapper.md)
- [*IterableMapper*](../classes/mappers.iterablemapper.md)

## Table of contents

### Properties

- [cleanup](types.mapper.md#cleanup)
- [configure](types.mapper.md#configure)
- [map](types.mapper.md#map)
- [setup](types.mapper.md#setup)

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

Defined in: [src/types.ts:24](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L24)

___

### configure

• `Optional` **configure**: (`config`: [*MapReduceRuntimeConfig*](types.mapreduceruntimeconfig.md)<Key, Value\>) => *void*

#### Type declaration

▸ (`config`: [*MapReduceRuntimeConfig*](types.mapreduceruntimeconfig.md)<Key, Value\>): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [*MapReduceRuntimeConfig*](types.mapreduceruntimeconfig.md)<Key, Value\> |

**Returns:** *void*

Inherited from: [Base](types.base.md).[configure](types.base.md#configure)

Defined in: [src/types.ts:22](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L22)

___

### map

• **map**: (`key`: Key, `value`: Value, `context`: [*MapContext*](types.mapcontext.md)<Key, Value\>) => *void* \| *Promise*<void\>

#### Type declaration

▸ (`key`: Key, `value`: Value, `context`: [*MapContext*](types.mapcontext.md)<Key, Value\>): *void* \| *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | Key |
| `value` | Value |
| `context` | [*MapContext*](types.mapcontext.md)<Key, Value\> |

**Returns:** *void* \| *Promise*<void\>

Defined in: [src/types.ts:48](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L48)

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

Defined in: [src/types.ts:23](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L23)
