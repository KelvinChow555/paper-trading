import dns from "node:dns";
import { MongoClient, Db, Collection, Document } from "mongodb";

const MONGO_URI = process.env.MONGO_URI as string;
if (!MONGO_URI) {
    throw new Error("MONGO_URI environmental variable is undefined");
}
const DB_NAME = "paper-trading-db";
export const USERS_COLLECTION = "users";
export const SESSIONS_COLLECTION = "sessions";
export const POSITIONS_COLLECTION = "positions";
export const ORDERS_COLLECTION = "orders";
export const STARTING_CASH = 100000 * 100;

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getClient(): Promise<MongoClient> {
    if (!client) {
        try {
            client = await new MongoClient(MONGO_URI).connect();
        } catch (error) {
            // Some Wi-Fi routers can't look up mongodb+srv:// addresses. Ask a public DNS server instead.
            if (!(error as Error).message.startsWith("querySrv")) {
                throw error;
            }
            dns.setServers(["1.1.1.1", "8.8.8.8"]);
            client = await new MongoClient(MONGO_URI).connect();
        }
    }
    return client;
}

async function connect(): Promise<Db> {
    const database = (await getClient()).db(DB_NAME);
    // The database itself stops duplicates, whatever the code does.
    await database.collection(USERS_COLLECTION).createIndex({ email: 1 }, { unique: true });
    await database.collection(SESSIONS_COLLECTION).createIndex({ token: 1 }, { unique: true });
    await database.collection(SESSIONS_COLLECTION).createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // MongoDB deletes old sessions
    await database.collection(POSITIONS_COLLECTION).createIndex({ userId: 1, symbol: 1 }, { unique: true });
    await database.collection(ORDERS_COLLECTION).createIndex({ userId: 1, createdAt: -1 });
    return database;
}

export async function getCollection<T extends Document>(collectionName: string): Promise<Collection<T>> {
    if (!db) {
        db = await connect();
    }
    return db.collection<T>(collectionName);
}
