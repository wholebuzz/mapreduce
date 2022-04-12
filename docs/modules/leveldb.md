[@wholebuzz/mapreduce](../README.md) / [Exports](../modules.md) / leveldb

# Module: leveldb

## Table of contents

### Functions

- [combineWithLevelDb](leveldb.md#combinewithleveldb)
- [runMapPhaseWithLevelDb](leveldb.md#runmapphasewithleveldb)
- [streamFromCombinedLevelDb](leveldb.md#streamfromcombinedleveldb)

## Functions

### combineWithLevelDb

▸ **combineWithLevelDb**<Key, Value\>(`out`: [*Item*](../interfaces/types.item.md), `leveldb`: level.LevelDB \| LevelUp, `args`: { `combiner?`: [*Reducer*](../interfaces/types.reducer.md)<Key, Value\> ; `configuration?`: [*Configuration*](../interfaces/types.configuration.md) ; `transform?`: (`value`: [*Item*](../interfaces/types.item.md)) => [*Item*](../interfaces/types.item.md)  }): *Promise*<void\>

#### Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `out` | [*Item*](../interfaces/types.item.md) |
| `leveldb` | level.LevelDB \| LevelUp |
| `args` | *object* |
| `args.combiner?` | [*Reducer*](../interfaces/types.reducer.md)<Key, Value\> |
| `args.configuration?` | [*Configuration*](../interfaces/types.configuration.md) |
| `args.transform?` | (`value`: [*Item*](../interfaces/types.item.md)) => [*Item*](../interfaces/types.item.md) |

**Returns:** *Promise*<void\>

Defined in: [src/leveldb.ts:104](https://github.com/wholebuzz/mapreduce/blob/master/src/leveldb.ts#L104)

___

### runMapPhaseWithLevelDb

▸ **runMapPhaseWithLevelDb**<Key, Value\>(`mapper`: [*Mapper*](../interfaces/types.mapper.md)<Key, Value\>, `combiner`: [*Reducer*](../interfaces/types.reducer.md)<Key, Value\> \| *undefined*, `args`: [*MapReduceJobConfig*](../interfaces/types.mapreducejobconfig.md)<Key, Value\>, `options`: DatabaseCopyOptions): *Promise*<void\>

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

Defined in: [src/leveldb.ts:23](https://github.com/wholebuzz/mapreduce/blob/master/src/leveldb.ts#L23)

___

### streamFromCombinedLevelDb

▸ **streamFromCombinedLevelDb**(`leveldb`: level.LevelDB \| LevelUp): ReadableStreamTree

#### Parameters

| Name | Type |
| :------ | :------ |
| `leveldb` | level.LevelDB \| LevelUp |

**Returns:** ReadableStreamTree

Defined in: [src/leveldb.ts:160](https://github.com/wholebuzz/mapreduce/blob/master/src/leveldb.ts#L160)
