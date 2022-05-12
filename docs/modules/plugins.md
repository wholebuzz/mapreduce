[@wholebuzz/mapreduce](../README.md) / [Exports](../modules.md) / plugins

# Module: plugins

## Table of contents

### Type aliases

- [ClassFactory](plugins.md#classfactory)
- [Factory](plugins.md#factory)
- [ObjectFactory](plugins.md#objectfactory)

### Variables

- [requireFromString](plugins.md#requirefromstring)

### Functions

- [applyJobConfigToYargs](plugins.md#applyjobconfigtoyargs)
- [deduplicateYargs](plugins.md#deduplicateyargs)
- [factoryConstruct](plugins.md#factoryconstruct)
- [getObjectClassName](plugins.md#getobjectclassname)
- [getSubProperty](plugins.md#getsubproperty)
- [getSubPropertyAccessor](plugins.md#getsubpropertyaccessor)
- [getSubPropertySetter](plugins.md#getsubpropertysetter)
- [getSubPropertyWithPath](plugins.md#getsubpropertywithpath)
- [loadConfigurationCode](plugins.md#loadconfigurationcode)
- [loadPlugin](plugins.md#loadplugin)
- [loadPluginFile](plugins.md#loadpluginfile)
- [loadPluginFiles](plugins.md#loadpluginfiles)
- [parseConfiguration](plugins.md#parseconfiguration)
- [setSubProperty](plugins.md#setsubproperty)

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

Defined in: [src/plugins.ts:11](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L11)

___

### Factory

Ƭ **Factory**<X\>: [*ClassFactory*](plugins.md#classfactory)<X\> \| [*ObjectFactory*](plugins.md#objectfactory)<X\>

#### Type parameters

| Name |
| :------ |
| `X` |

Defined in: [src/plugins.ts:13](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L13)

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

Defined in: [src/plugins.ts:12](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L12)

## Variables

### requireFromString

• `Const` **requireFromString**: *any*

Defined in: [src/plugins.ts:9](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L9)

## Functions

### applyJobConfigToYargs

▸ **applyJobConfigToYargs**(`fileSystem`: FileSystem, `args`: *Record*<string, any\>): *Promise*<Record<string, any\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fileSystem` | FileSystem |
| `args` | *Record*<string, any\> |

**Returns:** *Promise*<Record<string, any\>\>

Defined in: [src/plugins.ts:99](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L99)

___

### deduplicateYargs

▸ **deduplicateYargs**(`args`: *Record*<string, any\>): *Record*<string, any\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | *Record*<string, any\> |

**Returns:** *Record*<string, any\>

Defined in: [src/plugins.ts:118](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L118)

___

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

Defined in: [src/plugins.ts:17](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L17)

___

### getObjectClassName

▸ `Const` **getObjectClassName**(`x`: *any*): *any*

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | *any* |

**Returns:** *any*

Defined in: [src/plugins.ts:15](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L15)

___

### getSubProperty

▸ **getSubProperty**(`x`: *Record*<string, any\>, `path?`: *string*[]): *any*

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | *Record*<string, any\> |
| `path?` | *string*[] |

**Returns:** *any*

Defined in: [src/plugins.ts:139](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L139)

___

### getSubPropertyAccessor

▸ **getSubPropertyAccessor**(`path`: *string*): *function*

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | *string* |

**Returns:** (`_`: *Record*<string, any\>) => *any*

Defined in: [src/plugins.ts:158](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L158)

___

### getSubPropertySetter

▸ **getSubPropertySetter**(`path`: *string*): *function*

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | *string* |

**Returns:** (`_`: *Record*<string, any\>, `value`: *any*) => *any*

Defined in: [src/plugins.ts:169](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L169)

___

### getSubPropertyWithPath

▸ **getSubPropertyWithPath**(`x`: *Record*<string, any\>, `path?`: *string*): *any*

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | *Record*<string, any\> |
| `path?` | *string* |

**Returns:** *any*

Defined in: [src/plugins.ts:135](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L135)

___

### loadConfigurationCode

▸ **loadConfigurationCode**(`configuration`: [*Configuration*](../interfaces/config.configuration.md), `suffix?`: *string*): [*Configuration*](../interfaces/config.configuration.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `configuration` | [*Configuration*](../interfaces/config.configuration.md) | - |
| `suffix` | *string* | 'Code' |

**Returns:** [*Configuration*](../interfaces/config.configuration.md)

Defined in: [src/plugins.ts:64](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L64)

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

Defined in: [src/plugins.ts:50](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L50)

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

Defined in: [src/plugins.ts:39](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L39)

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

Defined in: [src/plugins.ts:25](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L25)

___

### parseConfiguration

▸ **parseConfiguration**(`input?`: *string* \| *string*[]): *Record*<string, any\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input?` | *string* \| *string*[] |

**Returns:** *Record*<string, any\>

Defined in: [src/plugins.ts:75](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L75)

___

### setSubProperty

▸ **setSubProperty**(`x`: *Record*<string, any\>, `path`: *string*[], `value`: *any*): *Record*<string, any\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | *Record*<string, any\> |
| `path` | *string*[] |
| `value` | *any* |

**Returns:** *Record*<string, any\>

Defined in: [src/plugins.ts:147](https://github.com/wholebuzz/mapreduce/blob/master/src/plugins.ts#L147)
