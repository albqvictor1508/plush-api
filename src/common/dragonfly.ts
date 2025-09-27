import { RedisClient } from "bun";

class Dragonfly {
  private client = new RedisClient();

  async send(cmd: string, args: string[]) {
    return await this.client.send(cmd, args);
  }

  async setex(key: string, ex: string, data: any) {
    return await this.client.send("SETEX", [key, data, "EX", ex]);
  }

  async get(key: string) {
    return await this.client.send("GET", [key]);
  }
}
