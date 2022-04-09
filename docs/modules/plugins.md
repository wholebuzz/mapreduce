[@wholebuzz/mapreduce](../README.md) / [Exports](../modules.md) / plugins

# Module: plugins

## Table of contents

### Type aliases

- [ClassFactory](plugins.md#classfactory)
- [Factory](plugins.md#factory)
- [ObjectFactory](plugins.md#objectfactory)

### Variables

- [maxIntegerDigits](plugins.md#maxintegerdigits)
- [requireFromString](plugins.md#requirefromstring)

### Functions

- [factoryConstruct](plugins.md#factoryconstruct)
- [formatNumberForUtf8Sort](plugins.md#formatnumberforutf8sort)
- [getObjectClassName](plugins.md#getobjectclassname)
- [getSubProperty](plugins.md#getsubproperty)
- [getSubPropertyAccessor](plugins.md#getsubpropertyaccessor)
- [getSubPropertyWithPath](plugins.md#getsubpropertywithpath)
- [loadPlugin](plugins.md#loadplugin)
- [loadPluginFile](plugins.md#loadpluginfile)
- [loadPluginFiles](plugins.md#loadpluginfiles)
- [parseConfiguration](plugins.md#parseconfiguration)

## Type aliases

### ClassFactory

Ƭ **ClassFactory**<X\>: () => X

#### Type parameters

| Name |
| :------ |
| `X` |

#### Type declaration

\+ (): X

**Returns:** X

Defined in: [src/plugins.ts:8](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L8)

___

### Factory

Ƭ **Factory**<X\>: [*ClassFactory*](plugins.md#classfactory)<X\> \| [*ObjectFactory*](plugins.md#objectfactory)<X\>

#### Type parameters

| Name |
| :------ |
| `X` |

Defined in: [src/plugins.ts:10](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L10)

___

### ObjectFactory

Ƭ **ObjectFactory**<X\>: () => X

#### Type parameters

| Name |
| :------ |
| `X` |

#### Type declaration

▸ (): X

**Returns:** X

Defined in: [src/plugins.ts:9](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L9)

## Variables

### maxIntegerDigits

• `Const` **maxIntegerDigits**: *number*

Defined in: [src/plugins.ts:107](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L107)

___

### requireFromString

• `Const` **requireFromString**: *any*

Defined in: [src/plugins.ts:6](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L6)

## Functions

### factoryConstruct

▸ **factoryConstruct**<X\>(`factory`: [*Factory*](plugins.md#factory)<X\>): X

#### Type parameters

| Name |
| :------ |
| `X` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `factory` | [*Factory*](plugins.md#factory)<X\> |

**Returns:** X

Defined in: [src/plugins.ts:14](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L14)

___

### formatNumberForUtf8Sort

▸ `Const` **formatNumberForUtf8Sort**(`value`: *number*, `reverse?`: *boolean*): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | *number* |
| `reverse?` | *boolean* |

**Returns:** *string*

Defined in: [src/plugins.ts:109](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L109)

___

### getObjectClassName

▸ `Const` **getObjectClassName**(`x`: *any*): *any*

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | *any* |

**Returns:** *any*

Defined in: [src/plugins.ts:12](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L12)

___

### getSubProperty

▸ **getSubProperty**(`x`: *Record*<string, any\>, `path?`: *string*[]): *any*

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | *Record*<string, any\> |
| `path?` | *string*[] |

**Returns:** *any*

Defined in: [src/plugins.ts:83](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L83)

___

### getSubPropertyAccessor

▸ **getSubPropertyAccessor**(`path`: *string*): *function*

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | *string* |

**Returns:** (`_`: *Record*<string, any\>) => *any*

Defined in: [src/plugins.ts:95](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L95)

___

### getSubPropertyWithPath

▸ **getSubPropertyWithPath**(`x`: *Record*<string, any\>, `path?`: *string*): *any*

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | *Record*<string, any\> |
| `path?` | *string* |

**Returns:** *any*

Defined in: [src/plugins.ts:91](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L91)

___

### loadPlugin

▸ **loadPlugin**<X\>(`plugin`: *Record*<string, any\>, `url`: *string*, `out?`: *Record*<string, [*Factory*](plugins.md#factory)<X\>\>): *Record*<string, [*Factory*](plugins.md#factory)<X\>\>

#### Type parameters

| Name |
| :------ |
| `X` |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `plugin` | *Record*<string, any\> | - |
| `url` | *string* | - |
| `out` | *Record*<string, [*Factory*](plugins.md#factory)<X\>\> | {} |

**Returns:** *Record*<string, [*Factory*](plugins.md#factory)<X\>\>

Defined in: [src/plugins.ts:47](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L47)

___

### loadPluginFile

▸ **loadPluginFile**<X\>(`fileSystem`: FileSystem, `url`: *string*, `out?`: *Record*<string, [*Factory*](plugins.md#factory)<X\>\>): *Promise*<Record<string, [*Factory*](plugins.md#factory)<X\>\>\>

#### Type parameters

| Name |
| :------ |
| `X` |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `fileSystem` | FileSystem | - |
| `url` | *string* | - |
| `out` | *Record*<string, [*Factory*](plugins.md#factory)<X\>\> | {} |

**Returns:** *Promise*<Record<string, [*Factory*](plugins.md#factory)<X\>\>\>

Defined in: [src/plugins.ts:36](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L36)

___

### loadPluginFiles

▸ **loadPluginFiles**<X\>(`fileSystem`: FileSystem, `url`: *string*, `out?`: *Record*<string, [*Factory*](plugins.md#factory)<X\>\>): *Promise*<Record<string, [*Factory*](plugins.md#factory)<X\>\>\>

#### Type parameters

| Name |
| :------ |
| `X` |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `fileSystem` | FileSystem | - |
| `url` | *string* | - |
| `out` | *Record*<string, [*Factory*](plugins.md#factory)<X\>\> | {} |

**Returns:** *Promise*<Record<string, [*Factory*](plugins.md#factory)<X\>\>\>

Defined in: [src/plugins.ts:22](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L22)

___

### parseConfiguration

▸ **parseConfiguration**(`input?`: *string* \| *string*[]): *Record*<string, any\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input?` | *string* \| *string*[] |

**Returns:** *Record*<string, any\>

Defined in: [src/plugins.ts:59](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L59)
