[@wholebuzz/mapreduce](../README.md) / [Exports](../modules.md) / mapreduce

# Module: mapreduce

## Table of contents

### Functions

- [getMapperImplementation](mapreduce.md#getmapperimplementation)
- [getMatchingInputSplits](mapreduce.md#getmatchinginputsplits)
- [mapReduce](mapreduce.md#mapreduce)
- [runCleanupPhase](mapreduce.md#runcleanupphase)
- [runMapPhaseWithExternalSorting](mapreduce.md#runmapphasewithexternalsorting)
- [runReducePhase](mapreduce.md#runreducephase)

## Functions

### getMapperImplementation

▸ **getMapperImplementation**(`type?`: [*MapperImplementation*](../enums/config.mapperimplementation.md), `hasCombiner?`: *boolean*): *function*

#### Parameters

| Name | Type |
| :------ | :------ |
| `type?` | [*MapperImplementation*](../enums/config.mapperimplementation.md) |
| `hasCombiner?` | *boolean* |

**Returns:** <Key, Value\>(`mapper`: [*Mapper*](../interfaces/types.mapper.md)<Key, Value\>, `combiner`: [*Reducer*](../interfaces/types.reducer.md)<Key, Value\> \| *undefined*, `args`: [*MapReduceRuntimeConfig*](../interfaces/types.mapreduceruntimeconfig.md)<Key, Value\>, `options`: DatabaseCopyOptions) => *Promise*<void\>

Defined in: [src/mapreduce.ts:223](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L223)

___

### getMatchingInputSplits

▸ **getMatchingInputSplits**(`inputSplits`: [*InputSplit*](../interfaces/config.inputsplit.md)[], `outputShard`: Shard): [*InputSplit*](../interfaces/config.inputsplit.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputSplits` | [*InputSplit*](../interfaces/config.inputsplit.md)[] |
| `outputShard` | Shard |

**Returns:** [*InputSplit*](../interfaces/config.inputsplit.md)[]

Defined in: [src/mapreduce.ts:234](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L234)

___

### mapReduce

▸ **mapReduce**<Key, Value\>(`args`: [*MapReduceRuntimeConfig*](../interfaces/types.mapreduceruntimeconfig.md)<Key, Value\>): *Promise*<void\>

#### Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [*MapReduceRuntimeConfig*](../interfaces/types.mapreduceruntimeconfig.md)<Key, Value\> |

**Returns:** *Promise*<void\>

Defined in: [src/mapreduce.ts:28](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L28)

___

### runCleanupPhase

▸ **runCleanupPhase**<Key, Value\>(`args`: { `inputShards`: *number* ; `outputShards`: *number* ; `runMap`: *boolean* ; `runReduce`: *boolean* ; `shuffleDirectory`: *string* ; `shuffleFormat`: *string*  }, `options`: [*MapReduceRuntimeConfig*](../interfaces/types.mapreduceruntimeconfig.md)<Key, Value\>): *Promise*<void\>

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
| `options` | [*MapReduceRuntimeConfig*](../interfaces/types.mapreduceruntimeconfig.md)<Key, Value\> |

**Returns:** *Promise*<void\>

Defined in: [src/mapreduce.ts:330](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L330)

___

### runMapPhaseWithExternalSorting

▸ **runMapPhaseWithExternalSorting**<Key, Value\>(`mapper`: [*Mapper*](../interfaces/types.mapper.md)<Key, Value\>, `combiner`: [*Reducer*](../interfaces/types.reducer.md)<Key, Value\> \| *undefined*, `args`: [*MapReduceRuntimeConfig*](../interfaces/types.mapreduceruntimeconfig.md)<Key, Value\>, `options`: DatabaseCopyOptions): *Promise*<void\>

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
| `args` | [*MapReduceRuntimeConfig*](../interfaces/types.mapreduceruntimeconfig.md)<Key, Value\> |
| `options` | DatabaseCopyOptions |

**Returns:** *Promise*<void\>

Defined in: [src/mapreduce.ts:290](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L290)

___

### runReducePhase

▸ **runReducePhase**<Key, Value\>(`reducer`: [*Reducer*](../interfaces/types.reducer.md)<Key, Value\>, `args`: [*MapReduceRuntimeConfig*](../interfaces/types.mapreduceruntimeconfig.md)<Key, Value\>, `options`: DatabaseCopyOptions): *Promise*<void\>

#### Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `reducer` | [*Reducer*](../interfaces/types.reducer.md)<Key, Value\> |
| `args` | [*MapReduceRuntimeConfig*](../interfaces/types.mapreduceruntimeconfig.md)<Key, Value\> |
| `options` | DatabaseCopyOptions |

**Returns:** *Promise*<void\>

Defined in: [src/mapreduce.ts:263](https://github.com/wholebuzz/mapreduce/blob/master/src/mapreduce.ts#L263)
