import { sql } from "drizzle-orm";
import { app } from "src/app";
import { dragonfly } from "src/common/dragonfly";
import { db } from "src/db/client";

export const check = async () => {
  //@ts-expect-error
  const { readyAt } = app;
  const [healthCache, healthDatabase] = await Promise.allSettled([
    timestamp(() => redis.ping()),
    timestamp(() => db.execute(sql`SELECT 'salve'`)),
  ]);
  if (
    healthDatabase.status === "rejected" ||
    healthCache.status === "rejected"
  ) {
    //@ts-expect-error
    console.log(healthDatabase.reason);
    //@ts-expect-error
    console.log(healthCache.reason);
  }
  return {
    readyAt,
    cache:
      healthCache.status === "rejected"
        ? { ok: false }
        : { ok: true, reply: healthCache.value.reply },
    db:
      healthDatabase.status === "rejected"
        ? { ok: false }
        : { ok: true, reply: healthDatabase.value.reply },
    uptime: Date.now() - readyAt,
    ok:
      healthCache.status === "fulfilled" &&
      healthDatabase.status === "fulfilled",
  };
};

export const timestamp = async <T>(func: () => Promise<T>) => {
  const start = performance.now();

  await func();

  return {
    reply: performance.now() - start,
  };
};
