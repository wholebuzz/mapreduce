# @wholebuzz/mapreduce [![image](https://img.shields.io/npm/v/@wholebuzz/mapreduce)](https://www.npmjs.com/package/@wholebuzz/mapreduce) [![test](https://github.com/wholebuzz/mapreduce/actions/workflows/test.yaml/badge.svg)](https://github.com/wholebuzz/mapreduce/actions/workflows/test.yaml)

## Communication-free MapReduce

Instead of starting a Master which starts simultaneous Mappers and Reducers on a cluster, let's decouple Mappers' 
dependency on Reducers by using cloud storage as intermediary. We can run a large MapReduce job with a single-thread
and zero communication. Or we can run the usual many parallel Mappers, synchronizing only (via file IPC) the completion
of the stages of Shuffle and Reduce.

## Example

```console
$ yarn start --inputKey id --inputPaths ./test/test-SSSS-of-NNNN.json.gz --outputPath ./foo.resort-SSSS-of-NNNN.jsonl.gz --outputShards 8
```

## Top-level:
  - API: `MapReduce(filein, fileout, mapperClass, reducerClass, combinerClass)`

  - input: `filein-SSSS-of-NNNN.jsonl.gz`
    e.g. `filein-0000-of-0004.jsonl.gz`, `filein-0001-of-0004.jsonl.gz`, ..., `filein-0003-of-0004.jsonl.gz`

  - output: `fileout-SSSS-of-NNNN.jsonl.gz`
    e.g. `fileout-0000-of-0004.jsonl.gz`, `fileout-0001-of-0004.jsonl.gz`, ..., `fileout-0003-of-0004.jsonl.gz`

## Mapper step:
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

## Shuffle step:

  - If the output of the external-sort was streamed to cloud storage, this step is already done.
  - Otherwise, upload files with AnyFileSystem copy between temporary directory (e.g. local) and reduce directory (e.g. s3://).

## Reducer step:

  - For each output shard:
    - Streaming K-way merge sort on `shuffle-SSSS-of-NNNN.inputshard-*-of-0004.jsonl.gz`, e.g. merge
      - `shuffle-0002-of-0004.inputshard-0000-of-0004.jsonl.gz`,
      - `shuffle-0002-of-0004.inputshard-0001-of-0004.jsonl.gz`, ...,
      - `shuffle-0002-of-0004.inputshard-0003-of-0004.jsonl.gz`
      - To produce `fileout-0002-of-0004.jsonl.gz`
    - Calls Reduce() for each Key and Value set

  - Output is written to: `fileout-SSSS-of-NNNN.jsonl.gz` for each shard,
    e.g. `fileout-0000-of-0004.jsonl.gz`, `fileout-0001-of-0004.jsonl.gz`, ..., `fileout-0003-of-0004.jsonl.gz`

## Cleanup:

  - The shuffle files can be removed

## References:

- [[1](https://static.googleusercontent.com/media/research.google.com/en//archive/mapreduce-osdi04.pdf)] Dean, Ghemawat. 2004. MapReduce: Simplified Data Processing on Large Clusters
- [[2](https://arxiv.org/pdf/0910.2582.pdf)] Rahn, Sanders, Singler. 2010. Scalable Distributed-Memory External Sorting
- [[3](https://people.eng.unimelb.edu.au/zr/publications/DKE2012_ComMapReduce.pdf)] Ding, Wang, Xin. 2013. ComMapReduce: An Improvement of MapReduce with Lightweight Communication Mechanisms
- [[4](https://iopscience.iop.org/article/10.1088/1757-899X/806/1/012040/pdf)] Chen. 2020. External Sorting Algorithm: State-of-the-Art and Future
