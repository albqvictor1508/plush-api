import { app } from "src/app";
import { redis } from "src/common/cache";
import { db } from "src/db/client";

export const check = async () => {
  //@ts-expect-error
  const { readyAt } = app;
  const [healhCache, healthDatabase] = await Promise.allSettled([
    timestamp<string>(() => redis.ping()),
    timestamp(() => db.execute(`SELECT 'salve'`)),
  ]);

  return {
    readyAt,
    cache:
      healhCache.status === "rejected"
        ? { ok: false }
        : { ok: true, reply: healhCache.value.reply },
    db:
      healthDatabase.status === "rejected"
        ? { ok: false }
        : { ok: true, reply: healthDatabase.value.reply },
  };
};

export const timestamp = async <T>(func: () => Promise<T>) => {
  const start = performance.now();

  await func();

  return {
    reply: performance.now() - start,
  };
};
