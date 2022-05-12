[@wholebuzz/mapreduce](../README.md) / [Exports](../modules.md) / [mappers](../modules/mappers.md) / IterableMapper

# Class: IterableMapper<Key, Value\>

[mappers](../modules/mappers.md).IterableMapper

## Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

## Implements

- [*Mapper*](../interfaces/types.mapper.md)<Key, Value\>

## Table of contents

### Constructors

- [constructor](mappers.iterablemapper.md#constructor)

### Methods

- [map](mappers.iterablemapper.md#map)
- [mapItem](mappers.iterablemapper.md#mapitem)

## Constructors

### constructor

\+ **new IterableMapper**<Key, Value\>(): [*IterableMapper*](mappers.iterablemapper.md)<Key, Value\>

#### Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

**Returns:** [*IterableMapper*](mappers.iterablemapper.md)<Key, Value\>

## Methods

### map

▸ **map**(`key`: Key, `value`: Value \| Value[], `context`: [*Context*](../interfaces/types.context.md)<Key, Value\>): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | Key |
| `value` | Value \| Value[] |
| `context` | [*Context*](../interfaces/types.context.md)<Key, Value\> |

**Returns:** *void*

Implementation of: Mapper.map

Defined in: [src/mappers.ts:25](https://github.com/wholebuzz/mapreduce/blob/master/src/mappers.ts#L25)

___

### mapItem

▸ **mapItem**(`key`: Key, `value`: Value, `context`: [*Context*](../interfaces/types.context.md)<Key, Value\>): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | Key |
| `value` | Value |
| `context` | [*Context*](../interfaces/types.context.md)<Key, Value\> |

**Returns:** *void*

Defined in: [src/mappers.ts:33](https://github.com/wholebuzz/mapreduce/blob/master/src/mappers.ts#L33)
