[@wholebuzz/mapreduce](../README.md) / [Exports](../modules.md) / [types](../modules/types.md) / MapContext

# Interface: MapContext<Key, Value\>

[types](../modules/types.md).MapContext

## Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

## Hierarchy

- [*Context*](types.context.md)<Key, Value\>

  ↳ **MapContext**

## Table of contents

### Properties

- [configuration](types.mapcontext.md#configuration)
- [currentItem](types.mapcontext.md#currentitem)
- [currentKey](types.mapcontext.md#currentkey)
- [currentValue](types.mapcontext.md#currentvalue)
- [inputKeyProperty](types.mapcontext.md#inputkeyproperty)
- [inputValueProperty](types.mapcontext.md#inputvalueproperty)
- [keyProperty](types.mapcontext.md#keyproperty)
- [valueProperty](types.mapcontext.md#valueproperty)
- [write](types.mapcontext.md#write)

## Properties

### configuration

• **configuration**: [*Configuration*](config.configuration.md)

Inherited from: [Context](types.context.md).[configuration](types.context.md#configuration)

Defined in: [src/types.ts:28](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L28)

___

### currentItem

• **currentItem**: [*Item*](types.item.md)

Defined in: [src/types.ts:36](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L36)

___

### currentKey

• `Optional` **currentKey**: Key

Inherited from: [Context](types.context.md).[currentKey](types.context.md#currentkey)

Defined in: [src/types.ts:29](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L29)

___

### currentValue

• **currentValue**: Value

Defined in: [src/types.ts:37](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L37)

___

### inputKeyProperty

• `Optional` **inputKeyProperty**: *string*

Defined in: [src/types.ts:38](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L38)

___

### inputValueProperty

• `Optional` **inputValueProperty**: *string*

Defined in: [src/types.ts:39](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L39)

___

### keyProperty

• **keyProperty**: *string*

Inherited from: [Context](types.context.md).[keyProperty](types.context.md#keyproperty)

Defined in: [src/types.ts:30](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L30)

___

### valueProperty

• **valueProperty**: *string*

Inherited from: [Context](types.context.md).[valueProperty](types.context.md#valueproperty)

Defined in: [src/types.ts:31](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L31)

___

### write

• **write**: (`key`: Key, `value`: *any*) => *void*

#### Type declaration

▸ (`key`: Key, `value`: *any*): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | Key |
| `value` | *any* |

**Returns:** *void*

Inherited from: [Context](types.context.md).[write](types.context.md#write)

Defined in: [src/types.ts:32](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L32)
