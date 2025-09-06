import { hostname } from "os"

const workerBits = 10n;
const sequenceBits = 12n;
const EPOCH = 1735771200000n;

const maxSequence = (1n << sequenceBits) - 1n;

const workerId = BigInt(
  hostname()
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0 + process.pid) & 0x3ff
)

let lastTimestamp = 0n;
let sequence = 0n;

async function waitNextMillis(lastTimestamp: bigint): Promise<bigint> {
  let ts = BigInt(Date.now())
  while (ts <= lastTimestamp) {
    ts = BigInt(Date.now())
  }
  return ts;
}

export const snowflake = async () => {
  let ts = BigInt(Date.now())

  if (ts === lastTimestamp) {
    sequence = (sequence + 1n) & maxSequence
    if (sequence === 0n) {
      ts = await waitNextMillis(lastTimestamp)
    }
  }

  lastTimestamp = ts
  return ((ts - EPOCH) << (workerBits + sequenceBits) | (workerId << sequenceBits) | sequence)
}
