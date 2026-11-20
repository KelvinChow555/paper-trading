import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL as string;
if (!REDIS_URL) {
    throw new Error("REDIS_URL environmental variable is undefined");
}

let redis: Redis | null = null;

function getRedis(): Redis {
    if (!redis) {
        // Give up quickly if Redis is down, so the page still loads (just without the cache).
        redis = new Redis(REDIS_URL, { maxRetriesPerRequest: 1, commandTimeout: 500 });
        redis.on("error", () => {});
    }
    return redis;
}

// Returns the saved copy if Redis has one. Otherwise runs load() and saves the answer for `seconds`.
export default async function cached<T>(key: string, seconds: number, load: () => Promise<T>): Promise<T> {
    try {
        const saved = await getRedis().get(key);
        if (saved) {
            return JSON.parse(saved) as T;
        }
    } catch {
        // Redis is down: skip the cache
    }
    const value = await load();
    if (value !== null) {
        try {
            await getRedis().set(key, JSON.stringify(value), "EX", seconds);
        } catch {
            // Redis is down: skip the cache
        }
    }
    return value;
}
