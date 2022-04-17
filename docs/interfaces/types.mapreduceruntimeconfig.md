[@wholebuzz/mapreduce](../README.md) / [Exports](../modules.md) / [types](../modules/types.md) / MapReduceRuntimeConfig

# Interface: MapReduceRuntimeConfig<Key, Value\>

[types](../modules/types.md).MapReduceRuntimeConfig

## Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

## Hierarchy

- [*MapReduceBaseConfig*](config.mapreducebaseconfig.md)

  ↳ **MapReduceRuntimeConfig**

## Table of contents

### Properties

- [cleanup](types.mapreduceruntimeconfig.md#cleanup)
- [combinerClass](types.mapreduceruntimeconfig.md#combinerclass)
- [configuration](types.mapreduceruntimeconfig.md#configuration)
- [fileSystem](types.mapreduceruntimeconfig.md#filesystem)
- [inputConnection](types.mapreduceruntimeconfig.md#inputconnection)
- [inputElasticSearch](types.mapreduceruntimeconfig.md#inputelasticsearch)
- [inputFiles](types.mapreduceruntimeconfig.md#inputfiles)
- [inputFormat](types.mapreduceruntimeconfig.md#inputformat)
- [inputHost](types.mapreduceruntimeconfig.md#inputhost)
- [inputKnex](types.mapreduceruntimeconfig.md#inputknex)
- [inputLeveldb](types.mapreduceruntimeconfig.md#inputleveldb)
- [inputMongodb](types.mapreduceruntimeconfig.md#inputmongodb)
- [inputName](types.mapreduceruntimeconfig.md#inputname)
- [inputOptions](types.mapreduceruntimeconfig.md#inputoptions)
- [inputPassword](types.mapreduceruntimeconfig.md#inputpassword)
- [inputPaths](types.mapreduceruntimeconfig.md#inputpaths)
- [inputPort](types.mapreduceruntimeconfig.md#inputport)
- [inputShardBy](types.mapreduceruntimeconfig.md#inputshardby)
- [inputShardFilter](types.mapreduceruntimeconfig.md#inputshardfilter)
- [inputShardFunction](types.mapreduceruntimeconfig.md#inputshardfunction)
- [inputShardIndex](types.mapreduceruntimeconfig.md#inputshardindex)
- [inputShards](types.mapreduceruntimeconfig.md#inputshards)
- [inputSplits](types.mapreduceruntimeconfig.md#inputsplits)
- [inputStream](types.mapreduceruntimeconfig.md#inputstream)
- [inputTable](types.mapreduceruntimeconfig.md#inputtable)
- [inputType](types.mapreduceruntimeconfig.md#inputtype)
- [inputUser](types.mapreduceruntimeconfig.md#inputuser)
- [jobid](types.mapreduceruntimeconfig.md#jobid)
- [localDirectory](types.mapreduceruntimeconfig.md#localdirectory)
- [logger](types.mapreduceruntimeconfig.md#logger)
- [mapperClass](types.mapreduceruntimeconfig.md#mapperclass)
- [mapperImplementation](types.mapreduceruntimeconfig.md#mapperimplementation)
- [outputConnection](types.mapreduceruntimeconfig.md#outputconnection)
- [outputElasticSearch](types.mapreduceruntimeconfig.md#outputelasticsearch)
- [outputFile](types.mapreduceruntimeconfig.md#outputfile)
- [outputFormat](types.mapreduceruntimeconfig.md#outputformat)
- [outputHost](types.mapreduceruntimeconfig.md#outputhost)
- [outputKnex](types.mapreduceruntimeconfig.md#outputknex)
- [outputLeveldb](types.mapreduceruntimeconfig.md#outputleveldb)
- [outputMongodb](types.mapreduceruntimeconfig.md#outputmongodb)
- [outputName](types.mapreduceruntimeconfig.md#outputname)
- [outputPassword](types.mapreduceruntimeconfig.md#outputpassword)
- [outputPath](types.mapreduceruntimeconfig.md#outputpath)
- [outputPort](types.mapreduceruntimeconfig.md#outputport)
- [outputShardFilter](types.mapreduceruntimeconfig.md#outputshardfilter)
- [outputShardFunction](types.mapreduceruntimeconfig.md#outputshardfunction)
- [outputShards](types.mapreduceruntimeconfig.md#outputshards)
- [outputStream](types.mapreduceruntimeconfig.md#outputstream)
- [outputTable](types.mapreduceruntimeconfig.md#outputtable)
- [outputType](types.mapreduceruntimeconfig.md#outputtype)
- [outputUser](types.mapreduceruntimeconfig.md#outputuser)
- [reducerClass](types.mapreduceruntimeconfig.md#reducerclass)
- [runMap](types.mapreduceruntimeconfig.md#runmap)
- [runReduce](types.mapreduceruntimeconfig.md#runreduce)
- [shuffleDirectory](types.mapreduceruntimeconfig.md#shuffledirectory)
- [synchronizeMap](types.mapreduceruntimeconfig.md#synchronizemap)
- [synchronizeReduce](types.mapreduceruntimeconfig.md#synchronizereduce)
- [unpatchMap](types.mapreduceruntimeconfig.md#unpatchmap)
- [unpatchReduce](types.mapreduceruntimeconfig.md#unpatchreduce)

## Properties

### cleanup

• `Optional` **cleanup**: *boolean*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[cleanup](config.mapreducebaseconfig.md#cleanup)

Defined in: [src/config.ts:23](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L23)

___

### combinerClass

• `Optional` **combinerClass**: [*ReducerClass*](../modules/types.md#reducerclass)<Key, Value\>

Defined in: [src/types.ts:58](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L58)

___

### configuration

• `Optional` **configuration**: [*Configuration*](config.configuration.md)

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[configuration](config.mapreducebaseconfig.md#configuration)

Defined in: [src/config.ts:24](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L24)

___

### fileSystem

• **fileSystem**: *FileSystem*

Defined in: [src/types.ts:59](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L59)

___

### inputConnection

• `Optional` **inputConnection**: *Record*<string, any\>

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[inputConnection](config.mapreducebaseconfig.md#inputconnection)

Defined in: node_modules/dbcp/dist/index.d.ts:27

___

### inputElasticSearch

• `Optional` **inputElasticSearch**: *Client*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[inputElasticSearch](config.mapreducebaseconfig.md#inputelasticsearch)

Defined in: node_modules/dbcp/dist/index.d.ts:28

___

### inputFiles

• `Optional` **inputFiles**: DatabaseCopyInputFile[] \| *Record*<string, DatabaseCopyInputFile\>

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[inputFiles](config.mapreducebaseconfig.md#inputfiles)

Defined in: node_modules/dbcp/dist/index.d.ts:30

___

### inputFormat

• `Optional` **inputFormat**: DatabaseCopyFormat \| DatabaseCopyTransformFactory

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[inputFormat](config.mapreducebaseconfig.md#inputformat)

Defined in: node_modules/dbcp/dist/index.d.ts:29

___

### inputHost

• `Optional` **inputHost**: *string*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[inputHost](config.mapreducebaseconfig.md#inputhost)

Defined in: node_modules/dbcp/dist/index.d.ts:31

___

### inputKnex

• `Optional` **inputKnex**: *Knex*<any, unknown[]\>

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[inputKnex](config.mapreducebaseconfig.md#inputknex)

Defined in: node_modules/dbcp/dist/index.d.ts:35

___

### inputLeveldb

• `Optional` **inputLeveldb**: *LevelDB*<any, any\> \| *LevelUp*<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\>

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[inputLeveldb](config.mapreducebaseconfig.md#inputleveldb)

Defined in: node_modules/dbcp/dist/index.d.ts:32

___

### inputMongodb

• `Optional` **inputMongodb**: *MongoClient*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[inputMongodb](config.mapreducebaseconfig.md#inputmongodb)

Defined in: node_modules/dbcp/dist/index.d.ts:33

___

### inputName

• `Optional` **inputName**: *string*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[inputName](config.mapreducebaseconfig.md#inputname)

Defined in: node_modules/dbcp/dist/index.d.ts:34

___

### inputOptions

• `Optional` **inputOptions**: DatabaseCopyInput

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[inputOptions](config.mapreducebaseconfig.md#inputoptions)

Defined in: [src/config.ts:27](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L27)

___

### inputPassword

• `Optional` **inputPassword**: *string*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[inputPassword](config.mapreducebaseconfig.md#inputpassword)

Defined in: node_modules/dbcp/dist/index.d.ts:36

___

### inputPaths

• **inputPaths**: *string*[]

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[inputPaths](config.mapreducebaseconfig.md#inputpaths)

Defined in: [src/config.ts:26](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L26)

___

### inputPort

• `Optional` **inputPort**: *number*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[inputPort](config.mapreducebaseconfig.md#inputport)

Defined in: node_modules/dbcp/dist/index.d.ts:44

___

### inputShardBy

• `Optional` **inputShardBy**: *string*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[inputShardBy](config.mapreducebaseconfig.md#inputshardby)

Defined in: node_modules/dbcp/dist/index.d.ts:37

___

### inputShardFilter

• `Optional` **inputShardFilter**: (`index`: *number*) => *boolean*

#### Type declaration

▸ (`index`: *number*): *boolean*

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | *number* |

**Returns:** *boolean*

Defined in: [src/types.ts:60](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L60)

___

### inputShardFunction

• `Optional` **inputShardFunction**: DatabaseCopyShardFunction

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[inputShardFunction](config.mapreducebaseconfig.md#inputshardfunction)

Defined in: node_modules/dbcp/dist/index.d.ts:38

___

### inputShardIndex

• `Optional` **inputShardIndex**: *number*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[inputShardIndex](config.mapreducebaseconfig.md#inputshardindex)

Defined in: node_modules/dbcp/dist/index.d.ts:39

___

### inputShards

• `Optional` **inputShards**: *number*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[inputShards](config.mapreducebaseconfig.md#inputshards)

Defined in: node_modules/dbcp/dist/index.d.ts:40

___

### inputSplits

• `Optional` **inputSplits**: [*InputSplit*](config.inputsplit.md)[]

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[inputSplits](config.mapreducebaseconfig.md#inputsplits)

Defined in: [src/config.ts:28](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L28)

___

### inputStream

• `Optional` **inputStream**: ReadableStreamTree

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[inputStream](config.mapreducebaseconfig.md#inputstream)

Defined in: node_modules/dbcp/dist/index.d.ts:41

___

### inputTable

• `Optional` **inputTable**: *string*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[inputTable](config.mapreducebaseconfig.md#inputtable)

Defined in: node_modules/dbcp/dist/index.d.ts:42

___

### inputType

• `Optional` **inputType**: DatabaseCopyInputType

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[inputType](config.mapreducebaseconfig.md#inputtype)

Defined in: node_modules/dbcp/dist/index.d.ts:43

___

### inputUser

• `Optional` **inputUser**: *string*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[inputUser](config.mapreducebaseconfig.md#inputuser)

Defined in: node_modules/dbcp/dist/index.d.ts:45

___

### jobid

• `Optional` **jobid**: *string*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[jobid](config.mapreducebaseconfig.md#jobid)

Defined in: [src/config.ts:25](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L25)

___

### localDirectory

• `Optional` **localDirectory**: *string*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[localDirectory](config.mapreducebaseconfig.md#localdirectory)

Defined in: [src/config.ts:29](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L29)

___

### logger

• `Optional` **logger**: Logger

Defined in: [src/types.ts:61](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L61)

___

### mapperClass

• `Optional` **mapperClass**: [*MapperClass*](../modules/types.md#mapperclass)<Key, Value\>

Defined in: [src/types.ts:62](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L62)

___

### mapperImplementation

• `Optional` **mapperImplementation**: [*MapperImplementation*](../enums/config.mapperimplementation.md)

Overrides: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[mapperImplementation](config.mapreducebaseconfig.md#mapperimplementation)

Defined in: [src/types.ts:63](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L63)

___

### outputConnection

• `Optional` **outputConnection**: *Record*<string, any\>

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[outputConnection](config.mapreducebaseconfig.md#outputconnection)

Defined in: node_modules/dbcp/dist/index.d.ts:48

___

### outputElasticSearch

• `Optional` **outputElasticSearch**: *Client*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[outputElasticSearch](config.mapreducebaseconfig.md#outputelasticsearch)

Defined in: node_modules/dbcp/dist/index.d.ts:49

___

### outputFile

• `Optional` **outputFile**: *string*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[outputFile](config.mapreducebaseconfig.md#outputfile)

Defined in: node_modules/dbcp/dist/index.d.ts:51

___

### outputFormat

• `Optional` **outputFormat**: DatabaseCopyFormat \| DatabaseCopyTransformFactory

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[outputFormat](config.mapreducebaseconfig.md#outputformat)

Defined in: node_modules/dbcp/dist/index.d.ts:50

___

### outputHost

• `Optional` **outputHost**: *string*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[outputHost](config.mapreducebaseconfig.md#outputhost)

Defined in: node_modules/dbcp/dist/index.d.ts:52

___

### outputKnex

• `Optional` **outputKnex**: *Knex*<any, unknown[]\>

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[outputKnex](config.mapreducebaseconfig.md#outputknex)

Defined in: node_modules/dbcp/dist/index.d.ts:53

___

### outputLeveldb

• `Optional` **outputLeveldb**: *LevelDB*<any, any\> \| *LevelUp*<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\>

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[outputLeveldb](config.mapreducebaseconfig.md#outputleveldb)

Defined in: node_modules/dbcp/dist/index.d.ts:54

___

### outputMongodb

• `Optional` **outputMongodb**: *MongoClient*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[outputMongodb](config.mapreducebaseconfig.md#outputmongodb)

Defined in: node_modules/dbcp/dist/index.d.ts:55

___

### outputName

• `Optional` **outputName**: *string*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[outputName](config.mapreducebaseconfig.md#outputname)

Defined in: node_modules/dbcp/dist/index.d.ts:56

___

### outputPassword

• `Optional` **outputPassword**: *string*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[outputPassword](config.mapreducebaseconfig.md#outputpassword)

Defined in: node_modules/dbcp/dist/index.d.ts:57

___

### outputPath

• **outputPath**: *string*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[outputPath](config.mapreducebaseconfig.md#outputpath)

Defined in: [src/config.ts:31](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L31)

___

### outputPort

• `Optional` **outputPort**: *number*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[outputPort](config.mapreducebaseconfig.md#outputport)

Defined in: node_modules/dbcp/dist/index.d.ts:63

___

### outputShardFilter

• `Optional` **outputShardFilter**: (`index`: *number*) => *boolean*

#### Type declaration

▸ (`index`: *number*): *boolean*

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | *number* |

**Returns:** *boolean*

Defined in: [src/types.ts:64](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L64)

___

### outputShardFunction

• `Optional` **outputShardFunction**: DatabaseCopyShardFunction \| DatabaseCopyShardFunctionOverride

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[outputShardFunction](config.mapreducebaseconfig.md#outputshardfunction)

Defined in: node_modules/dbcp/dist/index.d.ts:58

___

### outputShards

• `Optional` **outputShards**: *number*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[outputShards](config.mapreducebaseconfig.md#outputshards)

Defined in: node_modules/dbcp/dist/index.d.ts:59

___

### outputStream

• `Optional` **outputStream**: WritableStreamTree[]

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[outputStream](config.mapreducebaseconfig.md#outputstream)

Defined in: node_modules/dbcp/dist/index.d.ts:60

___

### outputTable

• `Optional` **outputTable**: *string*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[outputTable](config.mapreducebaseconfig.md#outputtable)

Defined in: node_modules/dbcp/dist/index.d.ts:61

___

### outputType

• `Optional` **outputType**: DatabaseCopyOutputType

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[outputType](config.mapreducebaseconfig.md#outputtype)

Defined in: node_modules/dbcp/dist/index.d.ts:62

___

### outputUser

• `Optional` **outputUser**: *string*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[outputUser](config.mapreducebaseconfig.md#outputuser)

Defined in: node_modules/dbcp/dist/index.d.ts:64

___

### reducerClass

• `Optional` **reducerClass**: [*ReducerClass*](../modules/types.md#reducerclass)<Key, Value\>

Defined in: [src/types.ts:65](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L65)

___

### runMap

• `Optional` **runMap**: *boolean*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[runMap](config.mapreducebaseconfig.md#runmap)

Defined in: [src/config.ts:32](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L32)

___

### runReduce

• `Optional` **runReduce**: *boolean*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[runReduce](config.mapreducebaseconfig.md#runreduce)

Defined in: [src/config.ts:33](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L33)

___

### shuffleDirectory

• `Optional` **shuffleDirectory**: *string*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[shuffleDirectory](config.mapreducebaseconfig.md#shuffledirectory)

Defined in: [src/config.ts:34](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L34)

___

### synchronizeMap

• `Optional` **synchronizeMap**: *boolean*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[synchronizeMap](config.mapreducebaseconfig.md#synchronizemap)

Defined in: [src/config.ts:35](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L35)

___

### synchronizeReduce

• `Optional` **synchronizeReduce**: *boolean*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[synchronizeReduce](config.mapreducebaseconfig.md#synchronizereduce)

Defined in: [src/config.ts:36](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L36)

___

### unpatchMap

• `Optional` **unpatchMap**: *boolean*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[unpatchMap](config.mapreducebaseconfig.md#unpatchmap)

Defined in: [src/config.ts:37](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L37)

___

### unpatchReduce

• `Optional` **unpatchReduce**: *boolean*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[unpatchReduce](config.mapreducebaseconfig.md#unpatchreduce)

Defined in: [src/config.ts:38](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L38)
