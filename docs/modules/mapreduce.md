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

Defined in: [src/mapreduce.ts:27](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L27)

___

### defaultKeyProperty

• `Const` **defaultKeyProperty**: ``"key"``= 'key'

Defined in: [src/mapreduce.ts:28](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L28)

___

### defaultShuffleFormat

• `Const` **defaultShuffleFormat**: ``"jsonl.gz"``= 'jsonl.gz'

Defined in: [src/mapreduce.ts:31](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L31)

___

### defaultValueProperty

• `Const` **defaultValueProperty**: ``""``= ''

Defined in: [src/mapreduce.ts:29](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L29)

___

### inputshardFilenameFormat

• `Const` **inputshardFilenameFormat**: ``"inputshard-SSSS-of-NNNN"``= 'inputshard-SSSS-of-NNNN'

Defined in: [src/mapreduce.ts:33](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L33)

___

### localTempDirectoryPrefix

• `Const` **localTempDirectoryPrefix**: ``"maptmp"``= 'maptmp'

Defined in: [src/mapreduce.ts:36](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L36)

___

### shuffleFilenameFormat

• `Const` **shuffleFilenameFormat**: ``"shuffle-SSSS-of-NNNN"``= 'shuffle-SSSS-of-NNNN'

Defined in: [src/mapreduce.ts:32](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L32)

___

### synchronizeMapFilenameFormat

• `Const` **synchronizeMapFilenameFormat**: ``"map-done-SSSS-of-NNNN.json"``= 'map-done-SSSS-of-NNNN.json'

Defined in: [src/mapreduce.ts:34](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L34)

___

### synchronizeReduceFilenameFormat

• `Const` **synchronizeReduceFilenameFormat**: ``"reduce-done-SSSS-of-NNNN.json"``= 'reduce-done-SSSS-of-NNNN.json'

Defined in: [src/mapreduce.ts:35](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L35)

___

### unknownWriteProperty

• `Const` **unknownWriteProperty**: ``"value"``= 'value'

Defined in: [src/mapreduce.ts:30](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L30)

## Functions

### getItemKeyAccessor

▸ `Const` **getItemKeyAccessor**(`inputKeyProperty?`: *string*): *function*

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputKeyProperty?` | *string* |

**Returns:** (`_`: *Record*<string, any\>) => *any*

Defined in: [src/mapreduce.ts:459](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L459)

___

### getItemValueAccessor

▸ `Const` **getItemValueAccessor**(`inputValueProperty?`: *string*): *function*

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputValueProperty?` | *string* |

**Returns:** (`_`: *Record*<string, any\>) => *any*

Defined in: [src/mapreduce.ts:462](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L462)

___

### getMapperImplementation

▸ **getMapperImplementation**(`type?`: [*MapperImplementation*](../enums/types.mapperimplementation.md), `hasCombiner?`: *boolean*): *function*

#### Parameters

| Name | Type |
| :------ | :------ |
| `type?` | [*MapperImplementation*](../enums/types.mapperimplementation.md) |
| `hasCombiner?` | *boolean* |

**Returns:** <Key, Value\>(`mapper`: [*Mapper*](../interfaces/types.mapper.md)<Key, Value\>, `combiner`: [*Reducer*](../interfaces/types.reducer.md)<Key, Value\> \| *undefined*, `args`: [*MapReduceJobConfig*](../interfaces/types.mapreducejobconfig.md)<Key, Value\>, `options`: DatabaseCopyOptions) => *Promise*<void\>

Defined in: [src/mapreduce.ts:209](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L209)

___

### getShardFilter

▸ **getShardFilter**(`workerIndex`: *number*, `numWorkers`: *number*): *undefined* \| (`index`: *number*) => *boolean*

#### Parameters

| Name | Type |
| :------ | :------ |
| `workerIndex` | *number* |
| `numWorkers` | *number* |

**Returns:** *undefined* \| (`index`: *number*) => *boolean*

Defined in: [src/mapreduce.ts:455](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L455)

___

### getUser

▸ **getUser**(`user?`: *string*): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `user?` | *string* |

**Returns:** *string*

Defined in: [src/mapreduce.ts:447](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L447)

___

### getWorkDirectory

▸ **getWorkDirectory**(`user`: *string*, `jobid`: *string*): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | *string* |
| `jobid` | *string* |

**Returns:** *string*

Defined in: [src/mapreduce.ts:451](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L451)

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

Defined in: [src/mapreduce.ts:220](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L220)

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

Defined in: [src/mapreduce.ts:38](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L38)

___

### mapTransform

▸ **mapTransform**<Key, Value\>(`mapper`: [*Mapper*](../interfaces/types.mapper.md)<Key, Value\>, `args?`: { `configuration?`: [*Configuration*](../interfaces/types.configuration.md) ; `transform?`: (`value`: [*Item*](../interfaces/types.item.md)) => [*Item*](../interfaces/types.item.md)  }): *Transform*

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
| `args.transform?` | (`value`: [*Item*](../interfaces/types.item.md)) => [*Item*](../interfaces/types.item.md) |

**Returns:** *Transform*

Defined in: [src/mapreduce.ts:244](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L244)

___

### mappedObject

▸ **mappedObject**<Key, Value\>(`key`: Key, `value`: *any*, `context`: [*Context*](../interfaces/types.context.md)<Key, Value\>, `transform?`: (`value`: [*Item*](../interfaces/types.item.md)) => [*Item*](../interfaces/types.item.md)): [*Item*](../interfaces/types.item.md)

#### Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | Key |
| `value` | *any* |
| `context` | [*Context*](../interfaces/types.context.md)<Key, Value\> |
| `transform?` | (`value`: [*Item*](../interfaces/types.item.md)) => [*Item*](../interfaces/types.item.md) |

**Returns:** [*Item*](../interfaces/types.item.md)

Defined in: [src/mapreduce.ts:230](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L230)

___

### newJobId

▸ **newJobId**(`name?`: *string*): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `name?` | *string* |

**Returns:** *string*

Defined in: [src/mapreduce.ts:443](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L443)

___

### reduceTransform

▸ **reduceTransform**<Key, Value\>(`reducer`: [*Reducer*](../interfaces/types.reducer.md)<Key, Value\>, `args`: { `configuration?`: [*Configuration*](../interfaces/types.configuration.md) ; `transform?`: (`value`: [*Item*](../interfaces/types.item.md)) => [*Item*](../interfaces/types.item.md)  }): *Transform*

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
| `args.transform?` | (`value`: [*Item*](../interfaces/types.item.md)) => [*Item*](../interfaces/types.item.md) |

**Returns:** *Transform*

Defined in: [src/mapreduce.ts:281](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L281)

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

Defined in: [src/mapreduce.ts:375](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L375)

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

Defined in: [src/mapreduce.ts:337](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L337)

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

Defined in: [src/mapreduce.ts:315](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L315)
