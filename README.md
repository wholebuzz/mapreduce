# Communication-free MapReduce

Instead of starting a master which starts simultaneous mappers and reducers on a cluster, let's decouple mappers' 
dependency on reducers by using cloud storage as intermediary. We can run a large MapReduce job with a single-thread
and zero communication. Or we can run the usual many parallel mappers, synchronizing only (via file IPC) the completion
of the stages of shuffle and reduce.

## Top-level:
  - API: MapReduce(filein, fileout, mapperClass, reducerClass, combinerClass)

  - input: `filein-SSSS-of-NNNN.jsonl.gz`
    e.g. `filein-0000-of-0004.jsonl.gz`, `filein-0001-of-0004.jsonl.gz`, ..., `filein-0003-of-0004.jsonl.gz`

  - output: `fileout-SSSS-of-NNNN.jsonl.gz`
    e.g. `fileout-0000-of-0004.jsonl.gz`, `fileout-0001-of-0004.jsonl.gz`, ..., `fileout-0003-of-0004.jsonl.gz`

## Mapper step:
  - For each input shard:
    - Map() is called for each line of the JSONL
    - The output is externally sorted by the new key (if changed)

  - Output is written to:
     - `map-filein-fileout-SSSS-of-NNNN.subshard-SSSS-of-NNNN.jsonl.gz`, e.g.

     - `map-filein-fileout-0001-of-0004.subshard-0000-of-0004.jsonl.gz`,
     - `map-filein-fileout-0001-of-0004.subshard-0001-of-0004.jsonl.gz`, ...
     - `map-filein-fileout-0001-of-0004.subshard-0003-of-0004.jsonl.gz`
     - ,

     - `map-filein-fileout-0001-of-0004.subshard-0000-of-0004.jsonl.gz`,
     - `map-filein-fileout-0001-of-0004.subshard-0001-of-0004.jsonl.gz`, ...
     - `map-filein-fileout-0001-of-0004.subshard-0003-of-0004.jsonl.gz`,

     - ...,

     - `map-filein-fileout-0003-of-0004.subshard-0000-of-0004.jsonl.gz`,
     - `map-filein-fileout-0003-of-0004.subshard-0001-of-0004.jsonl.gz`, ...
     - `map-filein-fileout-0003-of-0004.subshard-0003-of-0004.jsonl.gz`

  - The number of output files is equal to InputShards * OutputShards

## Shuffle step:

  - If the output of the external-sort was streamed to cloud storage, this step is already done.
  - Otherwise, upload files with AnyFileSystem copy between temporary directory (e.g. local) and reduce directory (e.g. s3://).

## Reducer step:

  - For each output shard:
    - Streaming K-way merge sort on `map-filein-fileout-SSSS-of-NNNN.subshard-*-of-0004.jsonl.gz`
    - Calls Reduce() for each Key and Value set

  - Output is written to: `fileout-SSSS-of-NNNN.jsonl.gz`
    e.g. `fileout-0000-of-0004.jsonl.gz`, `fileout-0001-of-0004.jsonl.gz`, ..., `fileout-0003-of-0004.jsonl.gz`

## Cleanup:

  - The map-filein-fileout files can be removed

