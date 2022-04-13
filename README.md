# @wholebuzz/mapreduce [![image](https://img.shields.io/npm/v/@wholebuzz/mapreduce)](https://www.npmjs.com/package/@wholebuzz/mapreduce) [![test](https://github.com/wholebuzz/mapreduce/actions/workflows/test.yaml/badge.svg)](https://github.com/wholebuzz/mapreduce/actions/workflows/test.yaml)

## Communication-free MapReduce for the 99%

`@wholebuzz/mapreduce` is a novel [MapReduce](https://en.wikipedia.org/wiki/MapReduce) [[1](#references)]
implementation trading shuffle latency for liberated scheduling. It works with your existing
infrastructure.

For a full example, see [mapreduce-example](https://github.com/wholebuzz/mapreduce-example).

`@wholebuzz/mapreduce` operates on databases of rows, usually expressed as `SSSS-of-NNNN` sharded flat files
in (gzipped) [JSON Lines](https://jsonlines.org/) format.

The API and CLI mostly follow [Hadoop MapReduce](https://hadoop.apache.org/) except that each
[MapContext](docs/interfaces/types.mapcontext.md) and [ReduceContext](docs/interfaces/types.reducecontext.md)
use `keyProperty` and `valueProperty` to dereference an underlying Object, instead of requiring the data to
be shaped like `{ key: Key, value: Value }`.

Custom Mappers and Reducers are typically compiled with [webpack](https://webpack.js.org/) and deployed to a
cloud storage bucket. The path is then supplied to the Container or CLI (e.g. `--plugins s3://my-bucket/index.js`).
See [mapreduce-example](https://github.com/wholebuzz/mapreduce-example).

### [Mapper API](docs/interfaces/types.mapper.md)

```typescript
interface Mapper<Key, Value> extends Base<Key, Value> {
  map: (key: Key, value: Value, context: MapContext<Key, Value>) => void | Promise<void>
}
```

### [Reducer API](docs/interfaces/types.reducer.md)

```typescript
interface Reducer<Key, Value> extends Base<Key, Value> {
  reduce: (key: Key, values: Value[], context: ReduceContext<Key, Value>) => void | Promise<void>
}
```

### Sharding

The default Shard Function is modulo `identity` for numbers and `md5lsw` for string. MD5 is supported by
MySQL, PostgreSQL, and SQLServer, allowing sharded database queries. However another hash (e.g. `fnv-plus`)
may be preferred.

## Example

### Sort (and shard) the [supplied test data](https://github.com/wholebuzz/mapreduce/tree/main/test) by `guid`

```console
$ yarn mapreduce \
  --map IdentityMapper \
  --reduce IdentityReducer \
  --inputPaths ./test/test-SSSS-of-NNNN.json.gz \
  --outputPath ./test-guid-sorted-SSSS-of-NNNN.jsonl.gz \
  --outputShards 8 \
  -D keyProperty=guid
```

### Re-sort (and shard) the output of the previous command by `id`

```console
$ yarn mapreduce \
  --map IdentityMapper \
  --reduce IdentityReducer \
  --inputPaths ./test-guid-sorted-SSSS-of-NNNN.jsonl.gz \
  --outputPath ./test-id-sorted-SSSS-of-NNNN.json.gz \
  --outputShards 4 \
  -D keyProperty=id
```

### And we're back to where we started

```console
$ diff ./test-id-sorted-0000-of-0004.json.gz ./test/test-0000-of-0004.json.gz
$ diff ./test-id-sorted-0001-of-0004.json.gz ./test/test-0001-of-0004.json.gz
$ diff ./test-id-sorted-0002-of-0004.json.gz ./test/test-0002-of-0004.json.gz
$ diff ./test-id-sorted-0003-of-0004.json.gz ./test/test-0003-of-0004.json.gz
```

## Same example using arbitrary number of workers

### Sort the supplied test data by `guid` using three workers

```console
$ export MY_JOB_ID=`yarn --silent mapreduce job --new | tail -1 | jq -r ".jobid"`
$ for ((i = 0; i < 3; i++)); do yarn mapreduce \
  --jobid $MY_JOB_ID \
  --map IdentityMapper \
  --reduce IdentityReducer \
  --inputPaths ./test/test-SSSS-of-NNNN.json.gz \
  --outputPath ./test-guid-sorted-SSSS-of-NNNN.jsonl.gz \
  --outputShards 8 \
  --numWorkers 3 \
  --workerIndex $i \
  -D keyProperty=guid &; done
```

### Sort the supplied test data by `guid` using three workers and job config

```console
$ export MY_JOB_CONFIG=`yarn --silent mapreduce job --new \
  --map IdentityMapper \
  --reduce IdentityReducer \
  --inputPaths ./test/test-SSSS-of-NNNN.json.gz \
  --outputPath ./test-guid-sorted-SSSS-of-NNNN.jsonl.gz \
  --outputShards 8 \
  --numWorkers 3 \
  -D keyProperty=guid \
  | tail -1`
$ for ((i = 0; i < 3; i++)); do yarn mapreduce --jobConfig "$MY_JOB_CONFIG" --workerIndex $i &; done
```

### Sort the supplied test data by `guid` using three containerized workers

```console
$ export MY_JOB_ID=`yarn --silent mapreduce job --new | tail -1 | jq -r ".jobid"`
$ for ((i = 0; i < 3; i++)); do docker run -d -e "RUN_ARGS= \
  --jobid $MY_JOB_ID \
  --map IdentityMapper \
  --reduce IdentityReducer \
  --inputPaths /mnt-cwd/test/test-SSSS-of-NNNN.json.gz \
  --outputPath /mnt-cwd/test-guid-sorted-SSSS-of-NNNN.jsonl.gz \
  --shuffleDirectory /mnt-cwd/ \
  --outputShards 8 \
  --numWorkers 3 \
  --workerIndex $i \
  -D keyProperty=guid" \
  -v $PWD:/mnt-cwd \
  -it wholebuzz/mapreduce; done
```

## Same example running in the cloud

- Supply `s3://` or `gs://` URLs for `--inputPaths`, `--outputPath`, and `--shuffleDirectory`.
- Use your preferred scheduler to start the workers (e.g. Airflow, Hadoop, Kubeflow, Kubernetes, EC2, or GCE). See [mapreduce-example](https://github.com/wholebuzz/mapreduce-example).

## Technical overview

Instead of starting a Master which starts simultaneous Mappers and Reducers on a cluster, let's decouple Mappers' 
dependency on Reducers by using cloud storage as intermediary. We can run a large MapReduce job with a single-thread
and zero communication. Or we can run the usual many parallel Mappers, synchronizing only (via file IPC) the completion
of the stages of Shuffle and Reduce.

### Top-level:

  - API: `MapReduce(filein, fileout, mapperClass, reducerClass, combinerClass)`

  - input: `filein-SSSS-of-NNNN.jsonl.gz`
    e.g. `filein-0000-of-0004.jsonl.gz`, `filein-0001-of-0004.jsonl.gz`, ..., `filein-0003-of-0004.jsonl.gz`

  - output: `fileout-SSSS-of-NNNN.jsonl.gz`
    e.g. `fileout-0000-of-0004.jsonl.gz`, `fileout-0001-of-0004.jsonl.gz`, ..., `fileout-0003-of-0004.jsonl.gz`

### Mapper step:

  - For each input shard:
    - Map() is called for each line of the JSONL
    - Outputs `numOutputShards` files
    - The outputs are externally sorted by the new key (if changed)

  - Output is written (according to shard function) to:
     - `shuffle-SSSS-of-NNNN.inputshard-SSSS-of-NNNN.jsonl.gz`, e.g.

     - `shuffle-0000-of-0004.inputshard-0000-of-0004.jsonl.gz`,
     - `shuffle-0000-of-0004.inputshard-0001-of-0004.jsonl.gz`, ...,
     - `shuffle-0000-of-0004.inputshard-0003-of-0004.jsonl.gz`
     - ,

     - `shuffle-0001-of-0004.inputshard-0000-of-0004.jsonl.gz`,
     - `shuffle-0001-of-0004.inputshard-0001-of-0004.jsonl.gz`, ...,
     - `shuffle-0001-of-0004.inputshard-0003-of-0004.jsonl.gz`,

     - ...,

     - `shuffle-0003-of-0004.inputshard-0000-of-0004.jsonl.gz`,
     - `shuffle-0003-of-0004.inputshard-0001-of-0004.jsonl.gz`, ...,
     - `shuffle-0003-of-0004.inputshard-0003-of-0004.jsonl.gz`

  - The number of output files is equal to InputShards * OutputShards
  - Each input shard makes one contribution (one file) to each output shard, e.g.
    - Processing `filein-0003-of-0004.jsonl.gz` produces:
    - `shuffle-0000-of-0004.inputshard-0003-of-0004.jsonl.gz`,
    - `shuffle-0001-of-0004.inputshard-0003-of-0004.jsonl.gz`, ...,
    - `shuffle-0003-of-0004.inputshard-0003-of-0004.jsonl.gz`

### Shuffle step:

  - If the output of the external-sort was streamed to cloud storage, this step is already done.
  - Otherwise, upload files with AnyFileSystem copy between temporary directory (e.g. local) and reduce directory (e.g. s3://).

### Reducer step:

  - For each output shard:
    - Streaming K-way merge sort on `shuffle-SSSS-of-NNNN.inputshard-*-of-0004.jsonl.gz`, e.g. merge
      - `shuffle-0002-of-0004.inputshard-0000-of-0004.jsonl.gz`,
      - `shuffle-0002-of-0004.inputshard-0001-of-0004.jsonl.gz`, ...,
      - `shuffle-0002-of-0004.inputshard-0003-of-0004.jsonl.gz`
      - To produce `fileout-0002-of-0004.jsonl.gz`
    - Calls Reduce() for each Key and Value set

  - Output is written to: `fileout-SSSS-of-NNNN.jsonl.gz` for each shard,
    e.g. `fileout-0000-of-0004.jsonl.gz`, `fileout-0001-of-0004.jsonl.gz`, ..., `fileout-0003-of-0004.jsonl.gz`

### Cleanup:

  - The shuffle files can be removed

## References:

- [[1](https://static.googleusercontent.com/media/research.google.com/en//archive/mapreduce-osdi04.pdf)] Dean, Ghemawat. 2004. MapReduce: Simplified Data Processing on Large Clusters
- [[2](https://arxiv.org/pdf/0910.2582.pdf)] Rahn, Sanders, Singler. 2010. Scalable Distributed-Memory External Sorting
- [[3](https://people.eng.unimelb.edu.au/zr/publications/DKE2012_ComMapReduce.pdf)] Ding, Wang, Xin. 2013. ComMapReduce: An Improvement of MapReduce with Lightweight Communication Mechanisms
- [[4](https://iopscience.iop.org/article/10.1088/1757-899X/806/1/012040/pdf)] Chen. 2020. External Sorting Algorithm: State-of-the-Art and Future

## API Reference

### Modules

- [cli](docs/modules/cli.md)
- [leveldb](docs/modules/leveldb.md)
- [mappers](docs/modules/mappers.md)
- [mapreduce](docs/modules/mapreduce.md)
- [plugins](docs/modules/plugins.md)
- [reducers](docs/modules/reducers.md)
- [types](docs/modules/types.md)
