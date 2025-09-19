import { hostname } from "node:os";

export class Snowflake {
  private workerBits: bigint = 10n;
  private sequenceBits: bigint = 12n;
  private EPOCH: bigint = 10n;
  private maxSequence: bigint = (1n << this.sequenceBits) - 1n;
  private workerId: bigint = BigInt(
    hostname()
      .split("")
      .reduce((acc, c) => acc + c.charCodeAt(0), 0 + process.pid) & 0x3ff,
  );
  private lastTimestamp: bigint = 0n;
  private sequence: bigint = 0n;

  public async create(): Promise<bigint> {
    let ts = BigInt(Date.now());

    if (ts === this.lastTimestamp) {
      this.sequence = (this.sequence + 1n) & this.maxSequence;
      if (this.sequence === 0n) {
        ts = this.wait(this.lastTimestamp);
      }
    }

    if (ts !== this.lastTimestamp) {
      this.sequence = 0n;
    }

    this.lastTimestamp = ts;
    return (
      ((ts - this.EPOCH) << (this.workerBits + this.sequenceBits)) |
      (this.workerId << this.sequenceBits) |
      this.sequence
    );
  }

  private wait(lastTimestamp: bigint): bigint {
    let ts = BigInt(Date.now());
    while (ts <= lastTimestamp) {
      ts = BigInt(Date.now());
    }
    return ts;
  }

  public decode(id: bigint) {
    const sequenceMask = (1n << 12n) - 1n;
    const workerMask = ((1n << 10n) - 1n) << 12n;

    const sequence = id & sequenceMask;
    const workerId = (id & workerMask) >> 12n;
    const ts = (id >> (10n + 12n)) + this.EPOCH;

    return {
      timestamp: Number(ts),
      workerId: Number(workerId),
      sequence: Number(sequence),
    };
  }
}
