[@wholebuzz/mapreduce](../README.md) / [Exports](../modules.md) / mapreduce

# Module: mapreduce

## Table of contents

### Variables

- [defaultDiretory](mapreduce.md#defaultdiretory)
- [defaultKeyProperty](mapreduce.md#defaultkeyproperty)
- [defaultShuffleFormat](mapreduce.md#defaultshuffleformat)
- [defaultValueProperty](mapreduce.md#defaultvalueproperty)
- [inputshardFilenameFormat](mapreduce.md#inputshardfilenameformat)
- [localTempDirectoryPrefix](mapreduce.md#localtempdirectoryprefix)
- [shuffleFilenameFormat](mapreduce.md#shufflefilenameformat)
- [synchronizeMapFilenameFormat](mapreduce.md#synchronizemapfilenameformat)
- [synchronizeReduceFilenameFormat](mapreduce.md#synchronizereducefilenameformat)
- [unknownWriteProperty](mapreduce.md#unknownwriteproperty)

### Functions

- [getItemKeyAccessor](mapreduce.md#getitemkeyaccessor)
- [getItemValueAccessor](mapreduce.md#getitemvalueaccessor)
- [getMapperImplementation](mapreduce.md#getmapperimplementation)
- [getShardFilter](mapreduce.md#getshardfilter)
- [getUser](mapreduce.md#getuser)
- [getWorkDirectory](mapreduce.md#getworkdirectory)
- [immutableContext](mapreduce.md#immutablecontext)
- [mapReduce](mapreduce.md#mapreduce)
- [mapTransform](mapreduce.md#maptransform)
- [mappedObject](mapreduce.md#mappedobject)
- [newJobId](mapreduce.md#newjobid)
- [reduceTransform](mapreduce.md#reducetransform)
- [runCleanupPhase](mapreduce.md#runcleanupphase)
- [runMapPhaseWithExternalSorting](mapreduce.md#runmapphasewithexternalsorting)
- [runReducePhase](mapreduce.md#runreducephase)

## Variables

### defaultDiretory

• `Const` **defaultDiretory**: ``"./"``= './'

Defined in: [src/mapreduce.ts:34](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L34)

___

### defaultKeyProperty

• `Const` **defaultKeyProperty**: ``"key"``= 'key'

Defined in: [src/mapreduce.ts:35](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L35)

___

### defaultShuffleFormat

• `Const` **defaultShuffleFormat**: ``"jsonl.gz"``= 'jsonl.gz'

Defined in: [src/mapreduce.ts:38](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L38)

___

### defaultValueProperty

• `Const` **defaultValueProperty**: ``""``= ''

Defined in: [src/mapreduce.ts:36](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L36)

___

### inputshardFilenameFormat

• `Const` **inputshardFilenameFormat**: ``"inputshard-SSSS-of-NNNN"``= 'inputshard-SSSS-of-NNNN'

Defined in: [src/mapreduce.ts:40](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L40)

___

### localTempDirectoryPrefix

• `Const` **localTempDirectoryPrefix**: ``"maptmp"``= 'maptmp'

Defined in: [src/mapreduce.ts:43](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L43)

___

### shuffleFilenameFormat

• `Const` **shuffleFilenameFormat**: ``"shuffle-SSSS-of-NNNN"``= 'shuffle-SSSS-of-NNNN'

Defined in: [src/mapreduce.ts:39](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L39)

___

### synchronizeMapFilenameFormat

• `Const` **synchronizeMapFilenameFormat**: ``"map-done-SSSS-of-NNNN.json"``= 'map-done-SSSS-of-NNNN.json'

Defined in: [src/mapreduce.ts:41](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L41)

___

### synchronizeReduceFilenameFormat

• `Const` **synchronizeReduceFilenameFormat**: ``"reduce-done-SSSS-of-NNNN.json"``= 'reduce-done-SSSS-of-NNNN.json'

Defined in: [src/mapreduce.ts:42](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L42)

___

### unknownWriteProperty

• `Const` **unknownWriteProperty**: ``"value"``= 'value'

Defined in: [src/mapreduce.ts:37](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L37)

## Functions

### getItemKeyAccessor

▸ `Const` **getItemKeyAccessor**(`inputKeyProperty?`: *string*): *function*

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputKeyProperty?` | *string* |

**Returns:** (`_`: *Record*<string, any\>) => *any*

Defined in: [src/mapreduce.ts:523](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L523)

___

### getItemValueAccessor

▸ `Const` **getItemValueAccessor**(`inputValueProperty?`: *string*): *function*

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputValueProperty?` | *string* |

**Returns:** (`_`: *Record*<string, any\>) => *any*

Defined in: [src/mapreduce.ts:526](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L526)

___

### getMapperImplementation

▸ **getMapperImplementation**(`type?`: [*MapperImplementation*](../enums/types.mapperimplementation.md), `hasCombiner?`: *boolean*): *function*

#### Parameters

| Name | Type |
| :------ | :------ |
| `type?` | [*MapperImplementation*](../enums/types.mapperimplementation.md) |
| `hasCombiner?` | *boolean* |

**Returns:** <Key, Value\>(`mapper`: [*Mapper*](../interfaces/types.mapper.md)<Key, Value\>, `combiner`: [*Reducer*](../interfaces/types.reducer.md)<Key, Value\> \| *undefined*, `args`: [*MapReduceJobConfig*](../interfaces/types.mapreducejobconfig.md)<Key, Value\>, `options`: DatabaseCopyOptions) => *Promise*<void\>

Defined in: [src/mapreduce.ts:226](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L226)

___

### getShardFilter

▸ **getShardFilter**(`workerIndex`: *number*, `numWorkers`: *number*): *undefined* \| (`index`: *number*) => *boolean*

#### Parameters

| Name | Type |
| :------ | :------ |
| `workerIndex` | *number* |
| `numWorkers` | *number* |

**Returns:** *undefined* \| (`index`: *number*) => *boolean*

Defined in: [src/mapreduce.ts:519](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L519)

___

### getUser

▸ **getUser**(`user?`: *string*): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `user?` | *string* |

**Returns:** *string*

Defined in: [src/mapreduce.ts:511](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L511)

___

### getWorkDirectory

▸ **getWorkDirectory**(`user`: *string*, `jobid`: *string*): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | *string* |
| `jobid` | *string* |

**Returns:** *string*

Defined in: [src/mapreduce.ts:515](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L515)

___

### immutableContext

▸ `Const` **immutableContext**(`configuration?`: [*Configuration*](../interfaces/types.configuration.md)): *object*

#### Parameters

| Name | Type |
| :------ | :------ |
| `configuration?` | [*Configuration*](../interfaces/types.configuration.md) |

**Returns:** *object*

| Name | Type |
| :------ | :------ |
| `configuration` | [*Configuration*](../interfaces/types.configuration.md) |
| `currentItem` | *object* |
| `keyProperty` | *string* |
| `valueProperty` | *string* |
| `write` | () => *never* |

Defined in: [src/mapreduce.ts:237](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L237)

___

### mapReduce

▸ **mapReduce**<Key, Value\>(`args`: [*MapReduceJobConfig*](../interfaces/types.mapreducejobconfig.md)<Key, Value\>): *Promise*<void\>

#### Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [*MapReduceJobConfig*](../interfaces/types.mapreducejobconfig.md)<Key, Value\> |

**Returns:** *Promise*<void\>

Defined in: [src/mapreduce.ts:45](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L45)

___

### mapTransform

▸ **mapTransform**<Key, Value\>(`mapper`: [*Mapper*](../interfaces/types.mapper.md)<Key, Value\>, `args?`: { `configuration?`: [*Configuration*](../interfaces/types.configuration.md) ; `logger?`: Logger ; `transform?`: (`value`: [*Item*](../interfaces/types.item.md)) => [*Item*](../interfaces/types.item.md)  }): *Transform*

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
| `args.configuration?` | [*Configuration*](../interfaces/types.configuration.md) |
| `args.logger?` | Logger |
| `args.transform?` | (`value`: [*Item*](../interfaces/types.item.md)) => [*Item*](../interfaces/types.item.md) |

**Returns:** *Transform*

Defined in: [src/mapreduce.ts:259](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L259)

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

Defined in: [src/mapreduce.ts:247](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L247)

___

### newJobId

▸ **newJobId**(`name?`: *string*): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `name?` | *string* |

**Returns:** *string*

Defined in: [src/mapreduce.ts:507](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L507)

___

### reduceTransform

▸ **reduceTransform**<Key, Value\>(`reducer`: [*Reducer*](../interfaces/types.reducer.md)<Key, Value\>, `args`: { `configuration?`: [*Configuration*](../interfaces/types.configuration.md) ; `logger?`: Logger ; `transform?`: (`value`: [*Item*](../interfaces/types.item.md)) => [*Item*](../interfaces/types.item.md)  }): *Transform*

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
| `args.configuration?` | [*Configuration*](../interfaces/types.configuration.md) |
| `args.logger?` | Logger |
| `args.transform?` | (`value`: [*Item*](../interfaces/types.item.md)) => [*Item*](../interfaces/types.item.md) |

**Returns:** *Transform*

Defined in: [src/mapreduce.ts:320](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L320)

___

### runCleanupPhase

▸ **runCleanupPhase**<Key, Value\>(`args`: { `inputShards`: *number* ; `outputShards`: *number* ; `runMap`: *boolean* ; `runReduce`: *boolean* ; `shuffleDirectory`: *string* ; `shuffleFormat`: *string*  }, `options`: [*MapReduceJobConfig*](../interfaces/types.mapreducejobconfig.md)<Key, Value\>): *Promise*<void\>

#### Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | *object* |
| `args.inputShards` | *number* |
| `args.outputShards` | *number* |
| `args.runMap` | *boolean* |
| `args.runReduce` | *boolean* |
| `args.shuffleDirectory` | *string* |
| `args.shuffleFormat` | *string* |
| `options` | [*MapReduceJobConfig*](../interfaces/types.mapreducejobconfig.md)<Key, Value\> |

**Returns:** *Promise*<void\>

Defined in: [src/mapreduce.ts:439](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L439)

___

### runMapPhaseWithExternalSorting

▸ **runMapPhaseWithExternalSorting**<Key, Value\>(`mapper`: [*Mapper*](../interfaces/types.mapper.md)<Key, Value\>, `combiner`: [*Reducer*](../interfaces/types.reducer.md)<Key, Value\> \| *undefined*, `args`: [*MapReduceJobConfig*](../interfaces/types.mapreducejobconfig.md)<Key, Value\>, `options`: DatabaseCopyOptions): *Promise*<void\>

#### Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `mapper` | [*Mapper*](../interfaces/types.mapper.md)<Key, Value\> |
| `combiner` | [*Reducer*](../interfaces/types.reducer.md)<Key, Value\> \| *undefined* |
| `args` | [*MapReduceJobConfig*](../interfaces/types.mapreducejobconfig.md)<Key, Value\> |
| `options` | DatabaseCopyOptions |

**Returns:** *Promise*<void\>

Defined in: [src/mapreduce.ts:399](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L399)

___

### runReducePhase

▸ **runReducePhase**<Key, Value\>(`reducer`: [*Reducer*](../interfaces/types.reducer.md)<Key, Value\>, `args`: [*MapReduceJobConfig*](../interfaces/types.mapreducejobconfig.md)<Key, Value\>, `options`: DatabaseCopyOptions): *Promise*<void\>

#### Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `reducer` | [*Reducer*](../interfaces/types.reducer.md)<Key, Value\> |
| `args` | [*MapReduceJobConfig*](../interfaces/types.mapreducejobconfig.md)<Key, Value\> |
| `options` | DatabaseCopyOptions |

**Returns:** *Promise*<void\>

Defined in: [src/mapreduce.ts:373](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L373)
