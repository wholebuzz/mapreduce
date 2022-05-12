[@wholebuzz/mapreduce](../README.md) / [Exports](../modules.md) / [mappers](../modules/mappers.md) / IdentityMapper

# Class: IdentityMapper<Key, Value\>

[mappers](../modules/mappers.md).IdentityMapper

## Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

## Implements

- [*Mapper*](../interfaces/types.mapper.md)<Key, Value\>

## Table of contents

### Constructors

- [constructor](mappers.identitymapper.md#constructor)

### Methods

- [map](mappers.identitymapper.md#map)

## Constructors

### constructor

\+ **new IdentityMapper**<Key, Value\>(): [*IdentityMapper*](mappers.identitymapper.md)<Key, Value\>

#### Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

**Returns:** [*IdentityMapper*](mappers.identitymapper.md)<Key, Value\>

## Methods

### map

▸ **map**(`key`: Key, `value`: Value, `context`: [*Context*](../interfaces/types.context.md)<Key, Value\>): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | Key |
| `value` | Value |
| `context` | [*Context*](../interfaces/types.context.md)<Key, Value\> |

**Returns:** *void*

Implementation of: Mapper.map

Defined in: [src/mappers.ts:6](https://github.com/wholebuzz/mapreduce/blob/master/src/mappers.ts#L6)
