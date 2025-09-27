import { RedisClient } from "bun";
import type { EventType } from "src/@types/ws";
import { CONSUMER_NAME, GROUP_NAME, STREAM_KEY } from "./ws";

class Dragonfly {
  private client = new RedisClient();

  async ping() {
    return await this.client.ping();
  }

  async send(cmd: string, args: string[]) {
    return await this.client.send(cmd, args);
  }

  async setex(key: string, ex: string, data: unknown) {
    return await this.client.send("SETEX", [
      key,
      JSON.stringify(data),
      "EX",
      ex,
    ]);
  }

  async get(key: string) {
    return await this.client.send("GET", [key]);
  }

  async xadd(type: EventType, data: unknown) {
    return await this.client.send("XADD", [
      STREAM_KEY,
      "*",
      "type",
      type,
      "body",
      JSON.stringify(data),
    ]);
  }

  async xgroup() {
    return await this.client.send("XADD", [
      "GROUP",
      GROUP_NAME,
      CONSUMER_NAME,
      "BLOCK",
      "0", //change this for param later
      "STREAMS",
      STREAM_KEY,
      ">",
    ]);
  }

  async exists(key: string) {
    return await this.client.send("EXISTS", [key]);
  }

  async publish(channel: string, msg: unknown) {
    return await this.client.send("PUBLISH", [channel, JSON.stringify(msg)]);
  }

  async subscribe(channel: string) {
    return await this.client.send("SUBSCRIBE", [channel]);
  }

  //TODO: implementar esse amanhã
  async duplicate() { }
}

export const dragonfly = new Dragonfly();
