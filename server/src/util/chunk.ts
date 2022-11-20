export function chunk(s: Uint8Array, startBytes: number, maxBytes: number) {
  /*
      buf.slice([start[, end]])
      start <integer> Where the new Buffer will start. Default: 0.
      end <integer> Where the new Buffer will end (not inclusive). Default: buf.length.
      Returns: <Buffer>
    */

  let buf = Buffer.from(s);
  const result = [];
  let readBuffer = true;
  let startChunkByte = startBytes;
  let endChunkByte = maxBytes;
  while (readBuffer) {
    // First round
    startChunkByte === 0 ? (endChunkByte = startChunkByte + maxBytes) : "";

    //Handle last chunk
    endChunkByte >= buf.length ? (readBuffer = false) : "";

    // addr: the position of the first bytes.  raw: the chunk of x bytes
    result.push({
      addr: startChunkByte,
      raw: buf.slice(startChunkByte, endChunkByte).toString("hex"),
    });

    startChunkByte = endChunkByte;
    endChunkByte = startChunkByte + maxBytes;
  }
  return result;
}
