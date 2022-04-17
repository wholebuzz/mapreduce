[@wholebuzz/mapreduce](../README.md) / [Exports](../modules.md) / runtime

# Module: runtime

## Table of contents

### Variables

- [defaultDiretory](runtime.md#defaultdiretory)
- [defaultKeyProperty](runtime.md#defaultkeyproperty)
- [defaultShuffleFormat](runtime.md#defaultshuffleformat)
- [defaultValueProperty](runtime.md#defaultvalueproperty)
- [inputshardFilenameFormat](runtime.md#inputshardfilenameformat)
- [localTempDirectoryPrefix](runtime.md#localtempdirectoryprefix)
- [maxIntegerDigits](runtime.md#maxintegerdigits)
- [shuffleFilenameFormat](runtime.md#shufflefilenameformat)
- [synchronizeMapFilenameFormat](runtime.md#synchronizemapfilenameformat)
- [synchronizeReduceFilenameFormat](runtime.md#synchronizereducefilenameformat)
- [unknownWriteProperty](runtime.md#unknownwriteproperty)

### Functions

- [formatNumberForUtf8Sort](runtime.md#formatnumberforutf8sort)
- [getItemKeyAccessor](runtime.md#getitemkeyaccessor)
- [getItemValueAccessor](runtime.md#getitemvalueaccessor)
- [getName](runtime.md#getname)
- [getShardFilter](runtime.md#getshardfilter)
- [getUser](runtime.md#getuser)
- [getWorkDirectory](runtime.md#getworkdirectory)
- [immutableContext](runtime.md#immutablecontext)
- [mapTransform](runtime.md#maptransform)
- [mappedObject](runtime.md#mappedobject)
- [newJobId](runtime.md#newjobid)
- [prepareRuntime](runtime.md#prepareruntime)
- [reduceTransform](runtime.md#reducetransform)

## Variables

### defaultDiretory

• `Const` **defaultDiretory**: ``"./"``= './'

Defined in: [src/runtime.ts:25](https://github.com/wholebuzz/mapreduce/blob/master/src/runtime.ts#L25)

___

### defaultKeyProperty

• `Const` **defaultKeyProperty**: ``"key"``= 'key'

Defined in: [src/runtime.ts:26](https://github.com/wholebuzz/mapreduce/blob/master/src/runtime.ts#L26)

___

### defaultShuffleFormat

• `Const` **defaultShuffleFormat**: ``"jsonl.gz"``= 'jsonl.gz'

Defined in: [src/runtime.ts:29](https://github.com/wholebuzz/mapreduce/blob/master/src/runtime.ts#L29)

___

### defaultValueProperty

• `Const` **defaultValueProperty**: ``""``= ''

Defined in: [src/runtime.ts:27](https://github.com/wholebuzz/mapreduce/blob/master/src/runtime.ts#L27)

___

### inputshardFilenameFormat

• `Const` **inputshardFilenameFormat**: ``"inputshard-SSSS-of-NNNN"``= 'inputshard-SSSS-of-NNNN'

Defined in: [src/runtime.ts:31](https://github.com/wholebuzz/mapreduce/blob/master/src/runtime.ts#L31)

___

### localTempDirectoryPrefix

• `Const` **localTempDirectoryPrefix**: ``"maptmp"``= 'maptmp'

Defined in: [src/runtime.ts:34](https://github.com/wholebuzz/mapreduce/blob/master/src/runtime.ts#L34)

___

### maxIntegerDigits

• `Const` **maxIntegerDigits**: *number*

Defined in: [src/runtime.ts:63](https://github.com/wholebuzz/mapreduce/blob/master/src/runtime.ts#L63)

___

### shuffleFilenameFormat

• `Const` **shuffleFilenameFormat**: ``"shuffle-SSSS-of-NNNN"``= 'shuffle-SSSS-of-NNNN'

Defined in: [src/runtime.ts:30](https://github.com/wholebuzz/mapreduce/blob/master/src/runtime.ts#L30)

___

### synchronizeMapFilenameFormat

• `Const` **synchronizeMapFilenameFormat**: ``"map-done-SSSS-of-NNNN.json"``= 'map-done-SSSS-of-NNNN.json'

Defined in: [src/runtime.ts:32](https://github.com/wholebuzz/mapreduce/blob/master/src/runtime.ts#L32)

___

### synchronizeReduceFilenameFormat

• `Const` **synchronizeReduceFilenameFormat**: ``"reduce-done-SSSS-of-NNNN.json"``= 'reduce-done-SSSS-of-NNNN.json'

Defined in: [src/runtime.ts:33](https://github.com/wholebuzz/mapreduce/blob/master/src/runtime.ts#L33)

___

### unknownWriteProperty

• `Const` **unknownWriteProperty**: ``"value"``= 'value'

Defined in: [src/runtime.ts:28](https://github.com/wholebuzz/mapreduce/blob/master/src/runtime.ts#L28)

## Functions

### formatNumberForUtf8Sort

▸ `Const` **formatNumberForUtf8Sort**(`value`: *number*, `reverse?`: *boolean*): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | *number* |
| `reverse?` | *boolean* |

**Returns:** *string*

Defined in: [src/runtime.ts:65](https://github.com/wholebuzz/mapreduce/blob/master/src/runtime.ts#L65)

___

### getItemKeyAccessor

▸ `Const` **getItemKeyAccessor**(`inputKeyProperty?`: *string*): *function*

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputKeyProperty?` | *string* |

**Returns:** (`_`: *Record*<string, any\>) => *any*

Defined in: [src/runtime.ts:56](https://github.com/wholebuzz/mapreduce/blob/master/src/runtime.ts#L56)

___

### getItemValueAccessor

▸ `Const` **getItemValueAccessor**(`inputValueProperty?`: *string*): *function*

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputValueProperty?` | *string* |

**Returns:** (`_`: *Record*<string, any\>) => *any*

Defined in: [src/runtime.ts:59](https://github.com/wholebuzz/mapreduce/blob/master/src/runtime.ts#L59)

___

### getName

▸ **getName**(`name?`: *string*): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `name?` | *string* |

**Returns:** *string*

Defined in: [src/runtime.ts:40](https://github.com/wholebuzz/mapreduce/blob/master/src/runtime.ts#L40)

___

### getShardFilter

▸ **getShardFilter**(`workerIndex`: *number*, `numWorkers`: *number*): *undefined* \| (`index`: *number*) => *boolean*

#### Parameters

| Name | Type |
| :------ | :------ |
| `workerIndex` | *number* |
| `numWorkers` | *number* |

**Returns:** *undefined* \| (`index`: *number*) => *boolean*

Defined in: [src/runtime.ts:52](https://github.com/wholebuzz/mapreduce/blob/master/src/runtime.ts#L52)

___

### getUser

▸ **getUser**(`user?`: *string*): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `user?` | *string* |

**Returns:** *string*

Defined in: [src/runtime.ts:44](https://github.com/wholebuzz/mapreduce/blob/master/src/runtime.ts#L44)

___

### getWorkDirectory

▸ **getWorkDirectory**(`user`: *string*, `jobid`: *string*): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | *string* |
| `jobid` | *string* |

**Returns:** *string*

Defined in: [src/runtime.ts:48](https://github.com/wholebuzz/mapreduce/blob/master/src/runtime.ts#L48)

___

### immutableContext

▸ `Const` **immutableContext**(`configuration?`: [*Configuration*](../interfaces/config.configuration.md)): *object*

#### Parameters

| Name | Type |
| :------ | :------ |
| `configuration?` | [*Configuration*](../interfaces/config.configuration.md) |

**Returns:** *object*

| Name | Type |
| :------ | :------ |
| `configuration` | [*Configuration*](../interfaces/config.configuration.md) |
| `currentItem` | *object* |
| `keyProperty` | *string* |
| `valueProperty` | *string* |
| `write` | () => *never* |

Defined in: [src/runtime.ts:121](https://github.com/wholebuzz/mapreduce/blob/master/src/runtime.ts#L121)

___

### mapTransform

▸ **mapTransform**<Key, Value\>(`mapper`: [*Mapper*](../interfaces/types.mapper.md)<Key, Value\>, `args?`: { `configuration?`: [*Configuration*](../interfaces/config.configuration.md) ; `logger?`: Logger ; `transform?`: (`value`: [*Item*](../interfaces/types.item.md)) => [*Item*](../interfaces/types.item.md)  }): *Transform*

#### Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `mapper` | [*Mapper*](../interfaces/types.mapper.md)<Key, Value\> |
| `args?` | *object* |
| `args.configuration?` | [*Configuration*](../interfaces/config.configuration.md) |
| `args.logger?` | Logger |
| `args.transform?` | (`value`: [*Item*](../interfaces/types.item.md)) => [*Item*](../interfaces/types.item.md) |

**Returns:** *Transform*

Defined in: [src/runtime.ts:143](https://github.com/wholebuzz/mapreduce/blob/master/src/runtime.ts#L143)

___

### mappedObject

▸ **mappedObject**<Key, _Value\>(`key`: Key, `value`: *any*, `keySetter`: (`output`: *Record*<string, any\>, `value`: *any*) => *void* \| *undefined*, `nonObjectValueSetter`: (`output`: *Record*<string, any\>, `value`: *any*) => *void*, `transform?`: (`value`: [*Item*](../interfaces/types.item.md)) => [*Item*](../interfaces/types.item.md)): [*Item*](../interfaces/types.item.md)

#### Type parameters

| Name |
| :------ |
| `Key` |
| `_Value` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | Key |
| `value` | *any* |
| `keySetter` | (`output`: *Record*<string, any\>, `value`: *any*) => *void* \| *undefined* |
| `nonObjectValueSetter` | (`output`: *Record*<string, any\>, `value`: *any*) => *void* |
| `transform?` | (`value`: [*Item*](../interfaces/types.item.md)) => [*Item*](../interfaces/types.item.md) |

**Returns:** [*Item*](../interfaces/types.item.md)

Defined in: [src/runtime.ts:131](https://github.com/wholebuzz/mapreduce/blob/master/src/runtime.ts#L131)

___

### newJobId

▸ **newJobId**(`name?`: *string*): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `name?` | *string* |

**Returns:** *string*

Defined in: [src/runtime.ts:36](https://github.com/wholebuzz/mapreduce/blob/master/src/runtime.ts#L36)

___

### prepareRuntime

▸ **prepareRuntime**<Key, Value\>(`fileSystem`: FileSystem, `logger`: Logger, `args`: [*MapReduceJobConfig*](../interfaces/config.mapreducejobconfig.md)): *Promise*<[*MapReduceRuntimeConfig*](../interfaces/types.mapreduceruntimeconfig.md)<Key, Value\>\>

#### Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fileSystem` | FileSystem |
| `logger` | Logger |
| `args` | [*MapReduceJobConfig*](../interfaces/config.mapreducejobconfig.md) |

**Returns:** *Promise*<[*MapReduceRuntimeConfig*](../interfaces/types.mapreduceruntimeconfig.md)<Key, Value\>\>

Defined in: [src/runtime.ts:68](https://github.com/wholebuzz/mapreduce/blob/master/src/runtime.ts#L68)

___

### reduceTransform

▸ **reduceTransform**<Key, Value\>(`reducer`: [*Reducer*](../interfaces/types.reducer.md)<Key, Value\>, `args`: { `configuration?`: [*Configuration*](../interfaces/config.configuration.md) ; `logger?`: Logger ; `transform?`: (`value`: [*Item*](../interfaces/types.item.md)) => [*Item*](../interfaces/types.item.md)  }): *Transform*

#### Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `reducer` | [*Reducer*](../interfaces/types.reducer.md)<Key, Value\> |
| `args` | *object* |
| `args.configuration?` | [*Configuration*](../interfaces/config.configuration.md) |
| `args.logger?` | Logger |
| `args.transform?` | (`value`: [*Item*](../interfaces/types.item.md)) => [*Item*](../interfaces/types.item.md) |

**Returns:** *Transform*

Defined in: [src/runtime.ts:204](https://github.com/wholebuzz/mapreduce/blob/master/src/runtime.ts#L204)
