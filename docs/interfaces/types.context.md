[@wholebuzz/mapreduce](../README.md) / [Exports](../modules.md) / [types](../modules/types.md) / Context

# Interface: Context<Key, _Value\>

[types](../modules/types.md).Context

## Type parameters

| Name |
| :------ |
| `Key` |
| `_Value` |

## Hierarchy

- **Context**

  ↳ [*MapContext*](types.mapcontext.md)

  ↳ [*ReduceContext*](types.reducecontext.md)

## Table of contents

### Properties

- [configuration](types.context.md#configuration)
- [currentKey](types.context.md#currentkey)
- [keyProperty](types.context.md#keyproperty)
- [valueProperty](types.context.md#valueproperty)
- [write](types.context.md#write)

## Properties

### configuration

• **configuration**: [*Configuration*](types.configuration.md)

Defined in: [src/types.ts:29](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L29)

___

### currentKey

• `Optional` **currentKey**: Key

Defined in: [src/types.ts:30](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L30)

___

### keyProperty

• **keyProperty**: *string*

Defined in: [src/types.ts:31](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L31)

___

### valueProperty

• **valueProperty**: *string*

Defined in: [src/types.ts:32](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L32)

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

Defined in: [src/types.ts:33](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L33)
