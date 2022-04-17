[@wholebuzz/mapreduce](../README.md) / [Exports](../modules.md) / [types](../modules/types.md) / ReduceContext

# Interface: ReduceContext<Key, Value\>

[types](../modules/types.md).ReduceContext

## Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

## Hierarchy

- [*Context*](types.context.md)<Key, Value\>

  ↳ **ReduceContext**

## Table of contents

### Properties

- [configuration](types.reducecontext.md#configuration)
- [currentItem](types.reducecontext.md#currentitem)
- [currentKey](types.reducecontext.md#currentkey)
- [currentValue](types.reducecontext.md#currentvalue)
- [keyProperty](types.reducecontext.md#keyproperty)
- [valueProperty](types.reducecontext.md#valueproperty)
- [write](types.reducecontext.md#write)

## Properties

### configuration

• **configuration**: [*Configuration*](config.configuration.md)

Inherited from: [Context](types.context.md).[configuration](types.context.md#configuration)

Defined in: [src/types.ts:28](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L28)

___

### currentItem

• **currentItem**: [*Item*](types.item.md)[]

Defined in: [src/types.ts:43](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L43)

___

### currentKey

• `Optional` **currentKey**: Key

Inherited from: [Context](types.context.md).[currentKey](types.context.md#currentkey)

Defined in: [src/types.ts:29](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L29)

___

### currentValue

• **currentValue**: Value[]

Defined in: [src/types.ts:44](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L44)

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
