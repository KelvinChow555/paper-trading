"use server"
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { getCollection, STARTING_CASH, USERS_COLLECTION } from "@/db";
import { createSession, deleteSession } from "@/lib/session";
import { isValidEmail } from "@/lib/validation";
import { Result, UserDoc } from "@/types";

export async function signUp(data: FormData): Promise<Result> {
    const name = String(data.get("name")).trim();
    const email = String(data.get("email")).trim().toLowerCase();
    const password = String(data.get("password"));
    if (name === "" || name.length > 40) {
        return { ok: false, error: "Enter a name of up to 40 characters" };
    } else if (!isValidEmail(email)) {
        return { ok: false, error: "Enter a valid email address" };
    } else if (password.length < 8 || password.length > 72) {
        return { ok: false, error: "The password must be 8 to 72 characters" };
    }
    const users = await getCollection<UserDoc>(USERS_COLLECTION);
    if (await users.findOne({ email })) {
        return { ok: false, error: "An account with this email already exists. Try signing in." };
    }
    const user: UserDoc = {
        _id: new ObjectId(),
        name,
        email,
        passwordHash: await bcrypt.hash(password, 12),
        cash: STARTING_CASH,
        watchlist: ["AAPL", "NVDA"],
    };
    await users.insertOne(user);
    await createSession(user._id);
    return { ok: true, message: "Welcome!" };
}

export async function signIn(data: FormData): Promise<Result> {
    const email = String(data.get("email")).trim().toLowerCase();
    const password = String(data.get("password"));
    const users = await getCollection<UserDoc>(USERS_COLLECTION);
    const user = await users.findOne({ email });
    // The same message either way, so nobody can find out which emails have accounts.
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return { ok: false, error: "Incorrect email or password" };
    }
    await createSession(user._id);
    return { ok: true, message: "Signed in" };
}

export async function signOut() {
    await deleteSession();
}
