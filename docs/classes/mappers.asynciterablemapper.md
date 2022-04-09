[@wholebuzz/mapreduce](../README.md) / [Exports](../modules.md) / [mappers](../modules/mappers.md) / AsyncIterableMapper

# Class: AsyncIterableMapper<Key, Value\>

[mappers](../modules/mappers.md).AsyncIterableMapper

## Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

## Implements

- [*Mapper*](../interfaces/types.mapper.md)<Key, Value\>

## Table of contents

### Constructors

- [constructor](mappers.asynciterablemapper.md#constructor)

### Properties

- [concurrency](mappers.asynciterablemapper.md#concurrency)

### Methods

- [map](mappers.asynciterablemapper.md#map)
- [mapItem](mappers.asynciterablemapper.md#mapitem)

## Constructors

### constructor

\+ **new AsyncIterableMapper**<Key, Value\>(): [*AsyncIterableMapper*](mappers.asynciterablemapper.md)<Key, Value\>

#### Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

**Returns:** [*AsyncIterableMapper*](mappers.asynciterablemapper.md)<Key, Value\>

## Properties

### concurrency

• **concurrency**: *number*= 1

Defined in: [src/mappers.ts:25](https://github.com/wholebuzz/mapreduce/blob/master/src/mappers.ts#L25)

## Methods

### map

▸ **map**(`key`: Key, `value`: Value \| Value[], `context`: [*Context*](../interfaces/types.context.md)<Key, Value\>): *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | Key |
| `value` | Value \| Value[] |
| `context` | [*Context*](../interfaces/types.context.md)<Key, Value\> |

**Returns:** *Promise*<void\>

Implementation of: Mapper.map

Defined in: [src/mappers.ts:27](https://github.com/wholebuzz/mapreduce/blob/master/src/mappers.ts#L27)

___

### mapItem

▸ **mapItem**(`key`: Key, `value`: Value, `context`: [*Context*](../interfaces/types.context.md)<Key, Value\>): *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | Key |
| `value` | Value |
| `context` | [*Context*](../interfaces/types.context.md)<Key, Value\> |

**Returns:** *Promise*<void\>

Defined in: [src/mappers.ts:41](https://github.com/wholebuzz/mapreduce/blob/master/src/mappers.ts#L41)
