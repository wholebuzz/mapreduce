import { DirectoryEntry, FileSystem } from '@wholebuzz/fs/lib/fs'
import { newParquetReader } from '@wholebuzz/fs/lib/parquet'
import { streamFilter } from '@wholebuzz/fs/lib/stream'
import { isShardedFilename, readShardFilenames } from '@wholebuzz/fs/lib/util'
import { DatabaseCopyFormat, guessFormatFromFilename } from 'dbcp/dist/format'
import { pumpReadable, ReadableStreamTree } from 'tree-stream'
import { InputSplit } from './types'

export const linestream = require('line-stream')

export async function getSplits(
  fileSystem: FileSystem,
  inputPaths: string[],
  inputSplitSize?: number
) {
  const inputSplits: InputSplit[] = []
  for (const path of inputPaths) {
    if (isShardedFilename(path)) {
      const { entries, numShards } = await readShardFilenames(fileSystem, path)
      for (let i = 0; i < numShards; i++) {
        inputSplits.push.apply(
          inputSplits,
          await getFileSplits(fileSystem, entries[i], inputSplitSize, { numShards, shardIndex: i })
        )
      }
    } else if (path.endsWith('/')) {
      const directoryStream = await fileSystem.readDirectoryStream(path, { recursive: true })
      await pumpReadable(
        directoryStream.pipe(
          streamFilter(async (file: DirectoryEntry) => {
            inputSplits.push.apply(
              inputSplits,
              await getFileSplits(fileSystem, file, inputSplitSize)
            )
          })
        ),
        undefined
      )
    } else {
      const status = await fileSystem.getFileStatus(path)
      inputSplits.push.apply(inputSplits, await getFileSplits(fileSystem, status, inputSplitSize))
    }
  }
  return inputSplits
}

export async function getFileSplits(
  fileSystem: FileSystem,
  file: DirectoryEntry,
  inputSplitSize: number | undefined,
  options?: {
    numShards?: number
    shardIndex?: number
  }
) {
  if (inputSplitSize && file.size === undefined) {
    file.size = (await fileSystem.getFileStatus(file.url)).size
  }
  if (inputSplitSize && file.size && !file.url.endsWith('.gz')) {
    const numSplits = file.size / inputSplitSize
    if (numSplits > 1) {
      const format = guessFormatFromFilename(file.url)
      switch (format) {
        case DatabaseCopyFormat.jsonl: {
          const result: InputSplit[] = []
          let lastByteOffset = 0
          while (lastByteOffset < file.size) {
            let endByteOffset
            if (lastByteOffset + inputSplitSize >= file.size) {
              endByteOffset = file.size
            } else {
              const probe = await fileSystem.openReadableFile(file.url, {
                byteOffset: lastByteOffset + inputSplitSize,
              })
              const newlineOffset = await streamIndexOfNewLine(probe)
              endByteOffset =
                newlineOffset !== undefined
                  ? lastByteOffset + inputSplitSize + newlineOffset
                  : file.size
            }
            result.push({
              ...options,
              url: file.url,
              byteOffsetRange: [lastByteOffset, endByteOffset],
            })
            lastByteOffset = endByteOffset
          }
          return result
        }

        case DatabaseCopyFormat.parquet: {
          const result: InputSplit[] = []
          const reader = await newParquetReader(fileSystem, file.url)
          const numRowGroups = reader.metadata.row_groups.length
          const splitSize = Math.trunc(numRowGroups / numSplits)
          for (let rowGroup = 0; rowGroup < numRowGroups; rowGroup += splitSize) {
            result.push({
              ...options,
              url: file.url,
              parquetRowGroupRange: [rowGroup, Math.min(rowGroup + splitSize, numRowGroups)],
            })
          }
          await reader.close()
          return result
        }
      }
    }
  }
  return [
    {
      ...options,
      url: file.url,
    },
  ]
}

async function streamIndexOfNewLine(readable: ReadableStreamTree) {
  let seen = 0
  let result: number | undefined
  const s = linestream()
  s.on('data', (line: any) => {
    if (seen++ === 1 && result === undefined) {
      result = line.start
      readable.node.stream.destroy()
    }
  })
  try {
    await pumpReadable(readable.pipe(s), undefined)
  } catch (_err) {
    /* */
  }
  return result
}
