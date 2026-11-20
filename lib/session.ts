import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { getCollection, SESSIONS_COLLECTION, USERS_COLLECTION } from "@/db";
import { SessionDoc, UserDoc, UserProps } from "@/types";

const COOKIE = "session";
const DAYS = 7;

function hash(token: string): string {
    return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: ObjectId) {
    const token = randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + DAYS * 24 * 60 * 60 * 1000);
    const sessions = await getCollection<SessionDoc>(SESSIONS_COLLECTION);
    await sessions.insertOne({ token: hash(token), userId, expiresAt });
    const cookieStore = await cookies();
    cookieStore.set(COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: expiresAt,
    });
}

export async function deleteSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE)?.value;
    if (token) {
        const sessions = await getCollection<SessionDoc>(SESSIONS_COLLECTION);
        await sessions.deleteOne({ token: hash(token) });
    }
    cookieStore.delete(COOKIE);
}

export async function getUserDoc(): Promise<UserDoc | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE)?.value;
    if (!token) {
        return null;
    }
    const sessions = await getCollection<SessionDoc>(SESSIONS_COLLECTION);
    const session = await sessions.findOne({ token: hash(token), expiresAt: { $gt: new Date() } });
    if (!session) {
        return null;
    }
    const users = await getCollection<UserDoc>(USERS_COLLECTION);
    return users.findOne({ _id: session.userId });
}
export async function getUser(): Promise<UserProps | null> {
    const user = await getUserDoc();
    if (!user) {
        return null;
    }
    return { id: user._id.toHexString(), name: user.name, cash: user.cash, watchlist: user.watchlist };
}
