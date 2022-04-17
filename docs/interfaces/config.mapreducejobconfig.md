[@wholebuzz/mapreduce](../README.md) / [Exports](../modules.md) / [config](../modules/config.md) / MapReduceJobConfig

# Interface: MapReduceJobConfig

[config](../modules/config.md).MapReduceJobConfig

## Hierarchy

- [*MapReduceBaseConfig*](config.mapreducebaseconfig.md)

  ↳ **MapReduceJobConfig**

## Table of contents

### Properties

- [cleanup](config.mapreducejobconfig.md#cleanup)
- [combine](config.mapreducejobconfig.md#combine)
- [config](config.mapreducejobconfig.md#config)
- [configuration](config.mapreducejobconfig.md#configuration)
- [inputConnection](config.mapreducejobconfig.md#inputconnection)
- [inputElasticSearch](config.mapreducejobconfig.md#inputelasticsearch)
- [inputFiles](config.mapreducejobconfig.md#inputfiles)
- [inputFormat](config.mapreducejobconfig.md#inputformat)
- [inputHost](config.mapreducejobconfig.md#inputhost)
- [inputKnex](config.mapreducejobconfig.md#inputknex)
- [inputLeveldb](config.mapreducejobconfig.md#inputleveldb)
- [inputMongodb](config.mapreducejobconfig.md#inputmongodb)
- [inputName](config.mapreducejobconfig.md#inputname)
- [inputOptions](config.mapreducejobconfig.md#inputoptions)
- [inputPassword](config.mapreducejobconfig.md#inputpassword)
- [inputPaths](config.mapreducejobconfig.md#inputpaths)
- [inputPort](config.mapreducejobconfig.md#inputport)
- [inputShardBy](config.mapreducejobconfig.md#inputshardby)
- [inputShardFunction](config.mapreducejobconfig.md#inputshardfunction)
- [inputShardIndex](config.mapreducejobconfig.md#inputshardindex)
- [inputShards](config.mapreducejobconfig.md#inputshards)
- [inputSplits](config.mapreducejobconfig.md#inputsplits)
- [inputStream](config.mapreducejobconfig.md#inputstream)
- [inputTable](config.mapreducejobconfig.md#inputtable)
- [inputType](config.mapreducejobconfig.md#inputtype)
- [inputUser](config.mapreducejobconfig.md#inputuser)
- [jobid](config.mapreducejobconfig.md#jobid)
- [localDirectory](config.mapreducejobconfig.md#localdirectory)
- [map](config.mapreducejobconfig.md#map)
- [mapperImplementation](config.mapreducejobconfig.md#mapperimplementation)
- [numWorkers](config.mapreducejobconfig.md#numworkers)
- [outputConnection](config.mapreducejobconfig.md#outputconnection)
- [outputElasticSearch](config.mapreducejobconfig.md#outputelasticsearch)
- [outputFile](config.mapreducejobconfig.md#outputfile)
- [outputFormat](config.mapreducejobconfig.md#outputformat)
- [outputHost](config.mapreducejobconfig.md#outputhost)
- [outputKnex](config.mapreducejobconfig.md#outputknex)
- [outputLeveldb](config.mapreducejobconfig.md#outputleveldb)
- [outputMongodb](config.mapreducejobconfig.md#outputmongodb)
- [outputName](config.mapreducejobconfig.md#outputname)
- [outputPassword](config.mapreducejobconfig.md#outputpassword)
- [outputPath](config.mapreducejobconfig.md#outputpath)
- [outputPort](config.mapreducejobconfig.md#outputport)
- [outputShardFunction](config.mapreducejobconfig.md#outputshardfunction)
- [outputShards](config.mapreducejobconfig.md#outputshards)
- [outputStream](config.mapreducejobconfig.md#outputstream)
- [outputTable](config.mapreducejobconfig.md#outputtable)
- [outputType](config.mapreducejobconfig.md#outputtype)
- [outputUser](config.mapreducejobconfig.md#outputuser)
- [plugins](config.mapreducejobconfig.md#plugins)
- [reduce](config.mapreducejobconfig.md#reduce)
- [runMap](config.mapreducejobconfig.md#runmap)
- [runReduce](config.mapreducejobconfig.md#runreduce)
- [shuffleDirectory](config.mapreducejobconfig.md#shuffledirectory)
- [synchronizeMap](config.mapreducejobconfig.md#synchronizemap)
- [synchronizeReduce](config.mapreducejobconfig.md#synchronizereduce)
- [unpatchMap](config.mapreducejobconfig.md#unpatchmap)
- [unpatchReduce](config.mapreducejobconfig.md#unpatchreduce)
- [workerIndex](config.mapreducejobconfig.md#workerindex)

## Properties

### cleanup

• `Optional` **cleanup**: *boolean*

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[cleanup](config.mapreducebaseconfig.md#cleanup)

Defined in: [src/config.ts:23](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L23)

___

### combine

• `Optional` **combine**: *string*

Defined in: [src/config.ts:42](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L42)

___

### config

• `Optional` **config**: *string*[]

Defined in: [src/config.ts:43](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L43)

___

### configuration

• `Optional` **configuration**: [*Configuration*](config.configuration.md)

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[configuration](config.mapreducebaseconfig.md#configuration)

Defined in: [src/config.ts:24](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L24)

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

### map

• `Optional` **map**: *string*

Defined in: [src/config.ts:44](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L44)

___

### mapperImplementation

• `Optional` **mapperImplementation**: [*MapperImplementation*](../enums/config.mapperimplementation.md)

Inherited from: [MapReduceBaseConfig](config.mapreducebaseconfig.md).[mapperImplementation](config.mapreducebaseconfig.md#mapperimplementation)

Defined in: [src/config.ts:30](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L30)

___

### numWorkers

• **numWorkers**: *number*

Defined in: [src/config.ts:45](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L45)

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

### plugins

• `Optional` **plugins**: *string*[]

Defined in: [src/config.ts:46](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L46)

___

### reduce

• `Optional` **reduce**: *string*

Defined in: [src/config.ts:47](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L47)

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

___

### workerIndex

• **workerIndex**: *number*

Defined in: [src/config.ts:48](https://github.com/wholebuzz/mapreduce/blob/master/src/config.ts#L48)
