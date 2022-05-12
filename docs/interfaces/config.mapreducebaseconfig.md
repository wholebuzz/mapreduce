[@wholebuzz/mapreduce](../README.md) / [Exports](../modules.md) / [config](../modules/config.md) / MapReduceBaseConfig

# Interface: MapReduceBaseConfig

[config](../modules/config.md).MapReduceBaseConfig

## Hierarchy

- *DatabaseCopyInput*

- *DatabaseCopyOutput*

  ↳ **MapReduceBaseConfig**

  ↳↳ [*MapReduceJobConfig*](config.mapreducejobconfig.md)

  ↳↳ [*MapReduceRuntimeConfig*](types.mapreduceruntimeconfig.md)

## Table of contents

### Properties

- [cleanup](config.mapreducebaseconfig.md#cleanup)
- [configuration](config.mapreducebaseconfig.md#configuration)
- [inputConnection](config.mapreducebaseconfig.md#inputconnection)
- [inputElasticSearch](config.mapreducebaseconfig.md#inputelasticsearch)
- [inputFiles](config.mapreducebaseconfig.md#inputfiles)
- [inputFormat](config.mapreducebaseconfig.md#inputformat)
- [inputHost](config.mapreducebaseconfig.md#inputhost)
- [inputKnex](config.mapreducebaseconfig.md#inputknex)
- [inputLeveldb](config.mapreducebaseconfig.md#inputleveldb)
- [inputMongodb](config.mapreducebaseconfig.md#inputmongodb)
- [inputName](config.mapreducebaseconfig.md#inputname)
- [inputOptions](config.mapreducebaseconfig.md#inputoptions)
- [inputPassword](config.mapreducebaseconfig.md#inputpassword)
- [inputPaths](config.mapreducebaseconfig.md#inputpaths)
- [inputPort](config.mapreducebaseconfig.md#inputport)
- [inputShardBy](config.mapreducebaseconfig.md#inputshardby)
- [inputShardFunction](config.mapreducebaseconfig.md#inputshardfunction)
- [inputShardIndex](config.mapreducebaseconfig.md#inputshardindex)
- [inputShards](config.mapreducebaseconfig.md#inputshards)
- [inputSplitSize](config.mapreducebaseconfig.md#inputsplitsize)
- [inputSplits](config.mapreducebaseconfig.md#inputsplits)
- [inputStream](config.mapreducebaseconfig.md#inputstream)
- [inputTable](config.mapreducebaseconfig.md#inputtable)
- [inputType](config.mapreducebaseconfig.md#inputtype)
- [inputUser](config.mapreducebaseconfig.md#inputuser)
- [jobid](config.mapreducebaseconfig.md#jobid)
- [localDirectory](config.mapreducebaseconfig.md#localdirectory)
- [mapperImplementation](config.mapreducebaseconfig.md#mapperimplementation)
- [outputConnection](config.mapreducebaseconfig.md#outputconnection)
- [outputElasticSearch](config.mapreducebaseconfig.md#outputelasticsearch)
- [outputFile](config.mapreducebaseconfig.md#outputfile)
- [outputFormat](config.mapreducebaseconfig.md#outputformat)
- [outputHost](config.mapreducebaseconfig.md#outputhost)
- [outputKnex](config.mapreducebaseconfig.md#outputknex)
- [outputLeveldb](config.mapreducebaseconfig.md#outputleveldb)
- [outputMongodb](config.mapreducebaseconfig.md#outputmongodb)
- [outputName](config.mapreducebaseconfig.md#outputname)
- [outputPassword](config.mapreducebaseconfig.md#outputpassword)
- [outputPath](config.mapreducebaseconfig.md#outputpath)
- [outputPort](config.mapreducebaseconfig.md#outputport)
- [outputShardFunction](config.mapreducebaseconfig.md#outputshardfunction)
- [outputShards](config.mapreducebaseconfig.md#outputshards)
- [outputStream](config.mapreducebaseconfig.md#outputstream)
- [outputTable](config.mapreducebaseconfig.md#outputtable)
- [outputType](config.mapreducebaseconfig.md#outputtype)
- [outputUser](config.mapreducebaseconfig.md#outputuser)
- [runMap](config.mapreducebaseconfig.md#runmap)
- [runReduce](config.mapreducebaseconfig.md#runreduce)
- [shuffleDirectory](config.mapreducebaseconfig.md#shuffledirectory)
- [synchronizeMap](config.mapreducebaseconfig.md#synchronizemap)
- [synchronizeReduce](config.mapreducebaseconfig.md#synchronizereduce)
- [unpatchMap](config.mapreducebaseconfig.md#unpatchmap)
- [unpatchReduce](config.mapreducebaseconfig.md#unpatchreduce)

## Properties

### cleanup

• `Optional` **cleanup**: *boolean*

Defined in: [src/config.ts:27](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L27)

___

### configuration

• `Optional` **configuration**: [*Configuration*](config.configuration.md)

Defined in: [src/config.ts:28](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L28)

___

### inputConnection

• `Optional` **inputConnection**: *Record*<string, any\>

Inherited from: DatabaseCopyInput.inputConnection

Defined in: node_modules/dbcp/dist/index.d.ts:29

___

### inputElasticSearch

• `Optional` **inputElasticSearch**: *Client*

Inherited from: DatabaseCopyInput.inputElasticSearch

Defined in: node_modules/dbcp/dist/index.d.ts:30

___

### inputFiles

• `Optional` **inputFiles**: DatabaseCopyInputFile[] \| *Record*<string, DatabaseCopyInputFile\>

Inherited from: DatabaseCopyInput.inputFiles

Defined in: node_modules/dbcp/dist/index.d.ts:32

___

### inputFormat

• `Optional` **inputFormat**: DatabaseCopyFormat \| DatabaseCopyTransformFactory

Inherited from: DatabaseCopyInput.inputFormat

Defined in: node_modules/dbcp/dist/index.d.ts:31

___

### inputHost

• `Optional` **inputHost**: *string*

Inherited from: DatabaseCopyInput.inputHost

Defined in: node_modules/dbcp/dist/index.d.ts:33

___

### inputKnex

• `Optional` **inputKnex**: *Knex*<any, unknown[]\>

Inherited from: DatabaseCopyInput.inputKnex

Defined in: node_modules/dbcp/dist/index.d.ts:37

___

### inputLeveldb

• `Optional` **inputLeveldb**: *LevelDB*<any, any\> \| *LevelUp*<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\>

Inherited from: DatabaseCopyInput.inputLeveldb

Defined in: node_modules/dbcp/dist/index.d.ts:34

___

### inputMongodb

• `Optional` **inputMongodb**: *MongoClient*

Inherited from: DatabaseCopyInput.inputMongodb

Defined in: node_modules/dbcp/dist/index.d.ts:35

___

### inputName

• `Optional` **inputName**: *string*

Inherited from: DatabaseCopyInput.inputName

Defined in: node_modules/dbcp/dist/index.d.ts:36

___

### inputOptions

• `Optional` **inputOptions**: DatabaseCopyInput

Defined in: [src/config.ts:31](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L31)

___

### inputPassword

• `Optional` **inputPassword**: *string*

Inherited from: DatabaseCopyInput.inputPassword

Defined in: node_modules/dbcp/dist/index.d.ts:38

___

### inputPaths

• **inputPaths**: *string*[]

Defined in: [src/config.ts:30](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L30)

___

### inputPort

• `Optional` **inputPort**: *number*

Inherited from: DatabaseCopyInput.inputPort

Defined in: node_modules/dbcp/dist/index.d.ts:46

___

### inputShardBy

• `Optional` **inputShardBy**: *string*

Inherited from: DatabaseCopyInput.inputShardBy

Defined in: node_modules/dbcp/dist/index.d.ts:39

___

### inputShardFunction

• `Optional` **inputShardFunction**: DatabaseCopyShardFunction

Inherited from: DatabaseCopyInput.inputShardFunction

Defined in: node_modules/dbcp/dist/index.d.ts:40

___

### inputShardIndex

• `Optional` **inputShardIndex**: *number*

Inherited from: DatabaseCopyInput.inputShardIndex

Defined in: node_modules/dbcp/dist/index.d.ts:41

___

### inputShards

• `Optional` **inputShards**: *number*

Inherited from: DatabaseCopyInput.inputShards

Defined in: node_modules/dbcp/dist/index.d.ts:42

___

### inputSplitSize

• `Optional` **inputSplitSize**: *number*

Defined in: [src/config.ts:33](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L33)

___

### inputSplits

• `Optional` **inputSplits**: [*InputSplit*](config.inputsplit.md)[]

Defined in: [src/config.ts:32](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L32)

___

### inputStream

• `Optional` **inputStream**: ReadableStreamTree

Inherited from: DatabaseCopyInput.inputStream

Defined in: node_modules/dbcp/dist/index.d.ts:43

___

### inputTable

• `Optional` **inputTable**: *string*

Inherited from: DatabaseCopyInput.inputTable

Defined in: node_modules/dbcp/dist/index.d.ts:44

___

### inputType

• `Optional` **inputType**: DatabaseCopyInputType

Inherited from: DatabaseCopyInput.inputType

Defined in: node_modules/dbcp/dist/index.d.ts:45

___

### inputUser

• `Optional` **inputUser**: *string*

Inherited from: DatabaseCopyInput.inputUser

Defined in: node_modules/dbcp/dist/index.d.ts:47

___

### jobid

• `Optional` **jobid**: *string*

Defined in: [src/config.ts:29](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L29)

___

### localDirectory

• `Optional` **localDirectory**: *string*

Defined in: [src/config.ts:34](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L34)

___

### mapperImplementation

• `Optional` **mapperImplementation**: [*MapperImplementation*](../enums/config.mapperimplementation.md)

Defined in: [src/config.ts:35](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L35)

___

### outputConnection

• `Optional` **outputConnection**: *Record*<string, any\>

Inherited from: DatabaseCopyOutput.outputConnection

Defined in: node_modules/dbcp/dist/index.d.ts:50

___

### outputElasticSearch

• `Optional` **outputElasticSearch**: *Client*

Inherited from: DatabaseCopyOutput.outputElasticSearch

Defined in: node_modules/dbcp/dist/index.d.ts:51

___

### outputFile

• `Optional` **outputFile**: *string*

Inherited from: DatabaseCopyOutput.outputFile

Defined in: node_modules/dbcp/dist/index.d.ts:53

___

### outputFormat

• `Optional` **outputFormat**: DatabaseCopyFormat \| DatabaseCopyTransformFactory

Inherited from: DatabaseCopyOutput.outputFormat

Defined in: node_modules/dbcp/dist/index.d.ts:52

___

### outputHost

• `Optional` **outputHost**: *string*

Inherited from: DatabaseCopyOutput.outputHost

Defined in: node_modules/dbcp/dist/index.d.ts:54

___

### outputKnex

• `Optional` **outputKnex**: *Knex*<any, unknown[]\>

Inherited from: DatabaseCopyOutput.outputKnex

Defined in: node_modules/dbcp/dist/index.d.ts:55

___

### outputLeveldb

• `Optional` **outputLeveldb**: *LevelDB*<any, any\> \| *LevelUp*<AbstractLevelDOWN<any, any\>, AbstractIterator<any, any\>\>

Inherited from: DatabaseCopyOutput.outputLeveldb

Defined in: node_modules/dbcp/dist/index.d.ts:56

___

### outputMongodb

• `Optional` **outputMongodb**: *MongoClient*

Inherited from: DatabaseCopyOutput.outputMongodb

Defined in: node_modules/dbcp/dist/index.d.ts:57

___

### outputName

• `Optional` **outputName**: *string*

Inherited from: DatabaseCopyOutput.outputName

Defined in: node_modules/dbcp/dist/index.d.ts:58

___

### outputPassword

• `Optional` **outputPassword**: *string*

Inherited from: DatabaseCopyOutput.outputPassword

Defined in: node_modules/dbcp/dist/index.d.ts:59

___

### outputPath

• **outputPath**: *string*

Defined in: [src/config.ts:36](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L36)

___

### outputPort

• `Optional` **outputPort**: *number*

Inherited from: DatabaseCopyOutput.outputPort

Defined in: node_modules/dbcp/dist/index.d.ts:65

___

### outputShardFunction

• `Optional` **outputShardFunction**: DatabaseCopyShardFunction \| DatabaseCopyShardFunctionOverride

Inherited from: DatabaseCopyOutput.outputShardFunction

Defined in: node_modules/dbcp/dist/index.d.ts:60

___

### outputShards

• `Optional` **outputShards**: *number*

Inherited from: DatabaseCopyOutput.outputShards

Defined in: node_modules/dbcp/dist/index.d.ts:61

___

### outputStream

• `Optional` **outputStream**: WritableStreamTree[]

Inherited from: DatabaseCopyOutput.outputStream

Defined in: node_modules/dbcp/dist/index.d.ts:62

___

### outputTable

• `Optional` **outputTable**: *string*

Inherited from: DatabaseCopyOutput.outputTable

Defined in: node_modules/dbcp/dist/index.d.ts:63

___

### outputType

• `Optional` **outputType**: DatabaseCopyOutputType

Inherited from: DatabaseCopyOutput.outputType

Defined in: node_modules/dbcp/dist/index.d.ts:64

___

### outputUser

• `Optional` **outputUser**: *string*

Inherited from: DatabaseCopyOutput.outputUser

Defined in: node_modules/dbcp/dist/index.d.ts:66

___

### runMap

• `Optional` **runMap**: *boolean*

Defined in: [src/config.ts:37](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L37)

___

### runReduce

• `Optional` **runReduce**: *boolean*

Defined in: [src/config.ts:38](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L38)

___

### shuffleDirectory

• `Optional` **shuffleDirectory**: *string*

Defined in: [src/config.ts:39](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L39)

___

### synchronizeMap

• `Optional` **synchronizeMap**: *boolean*

Defined in: [src/config.ts:40](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L40)

___

### synchronizeReduce

• `Optional` **synchronizeReduce**: *boolean*

Defined in: [src/config.ts:41](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L41)

___

### unpatchMap

• `Optional` **unpatchMap**: *boolean*

Defined in: [src/config.ts:42](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L42)

___

### unpatchReduce

• `Optional` **unpatchReduce**: *boolean*

Defined in: [src/config.ts:43](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L43)
