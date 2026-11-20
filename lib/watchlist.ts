"use server"
import { revalidatePath } from "next/cache";
import { getCollection, USERS_COLLECTION } from "@/db";
import { getCompany } from "@/lib/massive";
import { getUserDoc } from "@/lib/session";
import { isValidTicker } from "@/lib/validation";
import { Result, UserDoc } from "@/types";

const MAX = 20;

export async function addToWatchlist(ticker: string): Promise<Result> {
    const user = await getUserDoc();
    const symbol = ticker.trim().toUpperCase();
    if (!user) {
        return { ok: false, error: "Please sign in first" };
    } else if (!isValidTicker(symbol)) {
        return { ok: false, error: "Invalid ticker" };
    } else if (user.watchlist.length >= MAX) {
        return { ok: false, error: `Your watchlist is full (${MAX} tickers). Remove one first.` };
    }
    try {
        if (!(await getCompany(symbol))) {
            return { ok: false, error: `${symbol} isn't a ticker we have data for` };
        }
    } catch (error) {
        return { ok: false, error: (error as Error).message };
    }
    const users = await getCollection<UserDoc>(USERS_COLLECTION);
    await users.updateOne({ _id: user._id }, { $addToSet: { watchlist: symbol } });
    revalidatePath("/", "layout");
    return { ok: true, message: `Added ${symbol} to your watchlist` };
}

export async function removeFromWatchlist(ticker: string): Promise<Result> {
    const user = await getUserDoc();
    if (!user) {
        return { ok: false, error: "Please sign in first" };
    }
    const users = await getCollection<UserDoc>(USERS_COLLECTION);
    await users.updateOne({ _id: user._id }, { $pull: { watchlist: ticker } });
    revalidatePath("/", "layout");
    return { ok: true, message: `Removed ${ticker}` };
}
