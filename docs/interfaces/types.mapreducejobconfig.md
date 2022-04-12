[@wholebuzz/mapreduce](../README.md) / [Exports](../modules.md) / [types](../modules/types.md) / MapReduceJobConfig

# Interface: MapReduceJobConfig<Key, Value\>

[types](../modules/types.md).MapReduceJobConfig

## Type parameters

| Name |
| :------ |
| `Key` |
| `Value` |

## Hierarchy

- *DatabaseCopyInput*

- *DatabaseCopyOutput*

  ↳ **MapReduceJobConfig**

## Table of contents

### Properties

- [cleanup](types.mapreducejobconfig.md#cleanup)
- [combinerClass](types.mapreducejobconfig.md#combinerclass)
- [configuration](types.mapreducejobconfig.md#configuration)
- [fileSystem](types.mapreducejobconfig.md#filesystem)
- [inputConnection](types.mapreducejobconfig.md#inputconnection)
- [inputElasticSearch](types.mapreducejobconfig.md#inputelasticsearch)
- [inputFiles](types.mapreducejobconfig.md#inputfiles)
- [inputFormat](types.mapreducejobconfig.md#inputformat)
- [inputHost](types.mapreducejobconfig.md#inputhost)
- [inputKnex](types.mapreducejobconfig.md#inputknex)
- [inputLeveldb](types.mapreducejobconfig.md#inputleveldb)
- [inputMongodb](types.mapreducejobconfig.md#inputmongodb)
- [inputName](types.mapreducejobconfig.md#inputname)
- [inputOptions](types.mapreducejobconfig.md#inputoptions)
- [inputPassword](types.mapreducejobconfig.md#inputpassword)
- [inputPaths](types.mapreducejobconfig.md#inputpaths)
- [inputPort](types.mapreducejobconfig.md#inputport)
- [inputShardBy](types.mapreducejobconfig.md#inputshardby)
- [inputShardFilter](types.mapreducejobconfig.md#inputshardfilter)
- [inputShardFunction](types.mapreducejobconfig.md#inputshardfunction)
- [inputShardIndex](types.mapreducejobconfig.md#inputshardindex)
- [inputShards](types.mapreducejobconfig.md#inputshards)
- [inputStream](types.mapreducejobconfig.md#inputstream)
- [inputTable](types.mapreducejobconfig.md#inputtable)
- [inputType](types.mapreducejobconfig.md#inputtype)
- [inputUser](types.mapreducejobconfig.md#inputuser)
- [jobid](types.mapreducejobconfig.md#jobid)
- [localDirectory](types.mapreducejobconfig.md#localdirectory)
- [logger](types.mapreducejobconfig.md#logger)
- [mapperClass](types.mapreducejobconfig.md#mapperclass)
- [mapperImplementation](types.mapreducejobconfig.md#mapperimplementation)
- [outputConnection](types.mapreducejobconfig.md#outputconnection)
- [outputElasticSearch](types.mapreducejobconfig.md#outputelasticsearch)
- [outputFile](types.mapreducejobconfig.md#outputfile)
- [outputFormat](types.mapreducejobconfig.md#outputformat)
- [outputHost](types.mapreducejobconfig.md#outputhost)
- [outputKnex](types.mapreducejobconfig.md#outputknex)
- [outputLeveldb](types.mapreducejobconfig.md#outputleveldb)
- [outputMongodb](types.mapreducejobconfig.md#outputmongodb)
- [outputName](types.mapreducejobconfig.md#outputname)
- [outputPassword](types.mapreducejobconfig.md#outputpassword)
- [outputPath](types.mapreducejobconfig.md#outputpath)
- [outputPort](types.mapreducejobconfig.md#outputport)
- [outputShardFilter](types.mapreducejobconfig.md#outputshardfilter)
- [outputShardFunction](types.mapreducejobconfig.md#outputshardfunction)
- [outputShards](types.mapreducejobconfig.md#outputshards)
- [outputStream](types.mapreducejobconfig.md#outputstream)
- [outputTable](types.mapreducejobconfig.md#outputtable)
- [outputType](types.mapreducejobconfig.md#outputtype)
- [outputUser](types.mapreducejobconfig.md#outputuser)
- [reducerClass](types.mapreducejobconfig.md#reducerclass)
- [runMap](types.mapreducejobconfig.md#runmap)
- [runReduce](types.mapreducejobconfig.md#runreduce)
- [shuffleDirectory](types.mapreducejobconfig.md#shuffledirectory)
- [synchronizeMap](types.mapreducejobconfig.md#synchronizemap)
- [synchronizeReduce](types.mapreducejobconfig.md#synchronizereduce)
- [unpatchMap](types.mapreducejobconfig.md#unpatchmap)
- [unpatchReduce](types.mapreducejobconfig.md#unpatchreduce)

## Properties

### cleanup

• `Optional` **cleanup**: *boolean*

Defined in: [src/types.ts:63](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L63)

___

### combinerClass

• `Optional` **combinerClass**: [*ReducerClass*](../modules/types.md#reducerclass)<Key, Value\>

Defined in: [src/types.ts:64](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L64)

___

### configuration

• `Optional` **configuration**: [*Configuration*](types.configuration.md)

Defined in: [src/types.ts:65](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L65)

___

### fileSystem

• **fileSystem**: *FileSystem*

Defined in: [src/types.ts:66](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L66)

___

### inputConnection

• `Optional` **inputConnection**: *Record*<string, any\>

Inherited from: DatabaseCopyInput.inputConnection

Defined in: node_modules/dbcp/dist/index.d.ts:27

___

### inputElasticSearch

• `Optional` **inputElasticSearch**: *Client*

Inherited from: DatabaseCopyInput.inputElasticSearch

Defined in: node_modules/dbcp/dist/index.d.ts:28

___

### inputFiles

• `Optional` **inputFiles**: DatabaseCopyInputFile[] \| *Record*<string, DatabaseCopyInputFile\>

Inherited from: DatabaseCopyInput.inputFiles

Defined in: node_modules/dbcp/dist/index.d.ts:30

___

### inputFormat

• `Optional` **inputFormat**: DatabaseCopyFormat \| DatabaseCopyTransformFactory

Inherited from: DatabaseCopyInput.inputFormat

Defined in: node_modules/dbcp/dist/index.d.ts:29

___

### inputHost

• `Optional` **inputHost**: *string*

Inherited from: DatabaseCopyInput.inputHost

Defined in: node_modules/dbcp/dist/index.d.ts:31

___

### inputKnex

• `Optional` **inputKnex**: *Knex*<any, unknown[]\>

Inherited from: DatabaseCopyInput.inputKnex

Defined in: node_modules/dbcp/dist/index.d.ts:35

___

### inputLeveldb

• `Optional` **inputLeveldb**: *LevelDB*<any, any\> \| *LevelUp*<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\>

Inherited from: DatabaseCopyInput.inputLeveldb

Defined in: node_modules/dbcp/dist/index.d.ts:32

___

### inputMongodb

• `Optional` **inputMongodb**: *MongoClient*

Inherited from: DatabaseCopyInput.inputMongodb

Defined in: node_modules/dbcp/dist/index.d.ts:33

___

### inputName

• `Optional` **inputName**: *string*

Inherited from: DatabaseCopyInput.inputName

Defined in: node_modules/dbcp/dist/index.d.ts:34

___

### inputOptions

• `Optional` **inputOptions**: DatabaseCopyInput

Defined in: [src/types.ts:70](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L70)

___

### inputPassword

• `Optional` **inputPassword**: *string*

Inherited from: DatabaseCopyInput.inputPassword

Defined in: node_modules/dbcp/dist/index.d.ts:36

___

### inputPaths

• **inputPaths**: *string*[]

Defined in: [src/types.ts:68](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L68)

___

### inputPort

• `Optional` **inputPort**: *number*

Inherited from: DatabaseCopyInput.inputPort

Defined in: node_modules/dbcp/dist/index.d.ts:44

___

### inputShardBy

• `Optional` **inputShardBy**: *string*

Inherited from: DatabaseCopyInput.inputShardBy

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

Defined in: [src/types.ts:69](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L69)

___

### inputShardFunction

• `Optional` **inputShardFunction**: DatabaseCopyShardFunction

Inherited from: DatabaseCopyInput.inputShardFunction

Defined in: node_modules/dbcp/dist/index.d.ts:38

___

### inputShardIndex

• `Optional` **inputShardIndex**: *number*

Inherited from: DatabaseCopyInput.inputShardIndex

Defined in: node_modules/dbcp/dist/index.d.ts:39

___

### inputShards

• `Optional` **inputShards**: *number*

Inherited from: DatabaseCopyInput.inputShards

Defined in: node_modules/dbcp/dist/index.d.ts:40

___

### inputStream

• `Optional` **inputStream**: ReadableStreamTree

Inherited from: DatabaseCopyInput.inputStream

Defined in: node_modules/dbcp/dist/index.d.ts:41

___

### inputTable

• `Optional` **inputTable**: *string*

Inherited from: DatabaseCopyInput.inputTable

Defined in: node_modules/dbcp/dist/index.d.ts:42

___

### inputType

• `Optional` **inputType**: DatabaseCopyInputType

Inherited from: DatabaseCopyInput.inputType

Defined in: node_modules/dbcp/dist/index.d.ts:43

___

### inputUser

• `Optional` **inputUser**: *string*

Inherited from: DatabaseCopyInput.inputUser

Defined in: node_modules/dbcp/dist/index.d.ts:45

___

### jobid

• `Optional` **jobid**: *string*

Defined in: [src/types.ts:67](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L67)

___

### localDirectory

• `Optional` **localDirectory**: *string*

Defined in: [src/types.ts:71](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L71)

___

### logger

• `Optional` **logger**: Logger

Defined in: [src/types.ts:72](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L72)

___

### mapperClass

• `Optional` **mapperClass**: [*MapperClass*](../modules/types.md#mapperclass)<Key, Value\>

Defined in: [src/types.ts:73](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L73)

___

### mapperImplementation

• `Optional` **mapperImplementation**: [*MapperImplementation*](../enums/types.mapperimplementation.md)

Defined in: [src/types.ts:74](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L74)

___

### outputConnection

• `Optional` **outputConnection**: *Record*<string, any\>

Inherited from: DatabaseCopyOutput.outputConnection

Defined in: node_modules/dbcp/dist/index.d.ts:48

___

### outputElasticSearch

• `Optional` **outputElasticSearch**: *Client*

Inherited from: DatabaseCopyOutput.outputElasticSearch

Defined in: node_modules/dbcp/dist/index.d.ts:49

___

### outputFile

• `Optional` **outputFile**: *string*

Inherited from: DatabaseCopyOutput.outputFile

Defined in: node_modules/dbcp/dist/index.d.ts:51

___

### outputFormat

• `Optional` **outputFormat**: DatabaseCopyFormat \| DatabaseCopyTransformFactory

Inherited from: DatabaseCopyOutput.outputFormat

Defined in: node_modules/dbcp/dist/index.d.ts:50

___

### outputHost

• `Optional` **outputHost**: *string*

Inherited from: DatabaseCopyOutput.outputHost

Defined in: node_modules/dbcp/dist/index.d.ts:52

___

### outputKnex

• `Optional` **outputKnex**: *Knex*<any, unknown[]\>

Inherited from: DatabaseCopyOutput.outputKnex

Defined in: node_modules/dbcp/dist/index.d.ts:53

___

### outputLeveldb

• `Optional` **outputLeveldb**: *LevelDB*<any, any\> \| *LevelUp*<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\>

Inherited from: DatabaseCopyOutput.outputLeveldb

Defined in: node_modules/dbcp/dist/index.d.ts:54

___

### outputMongodb

• `Optional` **outputMongodb**: *MongoClient*

Inherited from: DatabaseCopyOutput.outputMongodb

Defined in: node_modules/dbcp/dist/index.d.ts:55

___

### outputName

• `Optional` **outputName**: *string*

Inherited from: DatabaseCopyOutput.outputName

Defined in: node_modules/dbcp/dist/index.d.ts:56

___

### outputPassword

• `Optional` **outputPassword**: *string*

Inherited from: DatabaseCopyOutput.outputPassword

Defined in: node_modules/dbcp/dist/index.d.ts:57

___

### outputPath

• **outputPath**: *string*

Defined in: [src/types.ts:75](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L75)

___

### outputPort

• `Optional` **outputPort**: *number*

Inherited from: DatabaseCopyOutput.outputPort

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

Defined in: [src/types.ts:76](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L76)

___

### outputShardFunction

• `Optional` **outputShardFunction**: DatabaseCopyShardFunction \| DatabaseCopyShardFunctionOverride

Inherited from: DatabaseCopyOutput.outputShardFunction

Defined in: node_modules/dbcp/dist/index.d.ts:58

___

### outputShards

• `Optional` **outputShards**: *number*

Inherited from: DatabaseCopyOutput.outputShards

Defined in: node_modules/dbcp/dist/index.d.ts:59

___

### outputStream

• `Optional` **outputStream**: WritableStreamTree[]

Inherited from: DatabaseCopyOutput.outputStream

Defined in: node_modules/dbcp/dist/index.d.ts:60

___

### outputTable

• `Optional` **outputTable**: *string*

Inherited from: DatabaseCopyOutput.outputTable

Defined in: node_modules/dbcp/dist/index.d.ts:61

___

### outputType

• `Optional` **outputType**: DatabaseCopyOutputType

Inherited from: DatabaseCopyOutput.outputType

Defined in: node_modules/dbcp/dist/index.d.ts:62

___

### outputUser

• `Optional` **outputUser**: *string*

Inherited from: DatabaseCopyOutput.outputUser

Defined in: node_modules/dbcp/dist/index.d.ts:64

___

### reducerClass

• `Optional` **reducerClass**: [*ReducerClass*](../modules/types.md#reducerclass)<Key, Value\>

Defined in: [src/types.ts:77](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L77)

___

### runMap

• `Optional` **runMap**: *boolean*

Defined in: [src/types.ts:78](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L78)

___

### runReduce

• `Optional` **runReduce**: *boolean*

Defined in: [src/types.ts:79](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L79)

___

### shuffleDirectory

• `Optional` **shuffleDirectory**: *string*

Defined in: [src/types.ts:80](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L80)

___

### synchronizeMap

• `Optional` **synchronizeMap**: *boolean*

Defined in: [src/types.ts:81](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L81)

___

### synchronizeReduce

• `Optional` **synchronizeReduce**: *boolean*

Defined in: [src/types.ts:82](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L82)

___

### unpatchMap

• `Optional` **unpatchMap**: *boolean*

Defined in: [src/types.ts:83](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L83)

___

### unpatchReduce

• `Optional` **unpatchReduce**: *boolean*

Defined in: [src/types.ts:84](https://github.com/wholebuzz/mapreduce/blob/master/src/types.ts#L84)
