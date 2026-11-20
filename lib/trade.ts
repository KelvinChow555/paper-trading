"use server"
import { revalidatePath } from "next/cache";
import { getClient, getCollection, ORDERS_COLLECTION, POSITIONS_COLLECTION, STARTING_CASH, USERS_COLLECTION } from "@/db";
import { money } from "@/lib/format";
import { getQuote } from "@/lib/massive";
import { getUserDoc } from "@/lib/session";
import { isValidShares, isValidTicker } from "@/lib/validation";
import { OrderDoc, PositionDoc, Result, UserDoc } from "@/types";
export async function placeOrder(ticker: string, side: "BUY" | "SELL", shares: number): Promise<Result> {
    const user = await getUserDoc();
    if (!user) {
        return { ok: false, error: "Please sign in first" };
    }
    const symbol = ticker.trim().toUpperCase();
    if (!isValidTicker(symbol)) {
        return { ok: false, error: "Invalid ticker" };
    } else if (!isValidShares(shares)) {
        return { ok: false, error: "Shares must be a whole number from 1 to 100,000" };
    }
    let quote;
    try {
        quote = await getQuote(symbol);
    } catch (error) {
        return { ok: false, error: (error as Error).message };
    }
    if (!quote) {
        return { ok: false, error: `No price found for ${symbol}` };
    }
    const price = quote.close;
    const total = price * shares;

    const users = await getCollection<UserDoc>(USERS_COLLECTION);
    const positions = await getCollection<PositionDoc>(POSITIONS_COLLECTION);
    const orders = await getCollection<OrderDoc>(ORDERS_COLLECTION);
    const session = (await getClient()).startSession();
    try {
        await session.withTransaction(async () => {
            let gain: number | null = null;
            if (side === "BUY") {
                const paid = await users.updateOne({ _id: user._id, cash: { $gte: total } }, { $inc: { cash: -total } }, { session });
                if (paid.modifiedCount === 0) {
                    throw new Error(`Not enough cash: this costs ${money(total)}`);
                }
                await positions.updateOne(
                    { userId: user._id, symbol },
                    { $inc: { shares: shares, cost: total } },
                    { upsert: true, session },
                );
            } else {
                const position = await positions.findOne({ userId: user._id, symbol }, { session });
                if (!position || position.shares < shares) {
                    throw new Error(`You only own ${position?.shares ?? 0} shares of ${symbol}`);
                }
                const costSold = Math.round((position.cost * shares) / position.shares);
                gain = total - costSold;
                if (position.shares === shares) {
                    await positions.deleteOne({ _id: position._id }, { session });
                } else {
                    await positions.updateOne({ _id: position._id }, { $inc: { shares: -shares, cost: -costSold } }, { session });
                }
                await users.updateOne({ _id: user._id }, { $inc: { cash: total } }, { session });
            }
            await orders.insertOne({ userId: user._id, symbol, side, shares, price, total, gain, createdAt: new Date() }, { session });
        });
    } catch (error) {
        return { ok: false, error: (error as Error).message };
    } finally {
        await session.endSession();
    }
    revalidatePath("/", "layout"); // show the new cash and shares on every page
    const verb = side === "BUY" ? "Bought" : "Sold";
    return { ok: true, message: `${verb} ${shares} ${symbol} at ${money(price)}` };
}

export async function resetAccount(): Promise<Result> {
    const user = await getUserDoc();
    if (!user) {
        return { ok: false, error: "Please sign in first" };
    }
    const users = await getCollection<UserDoc>(USERS_COLLECTION);
    const positions = await getCollection<PositionDoc>(POSITIONS_COLLECTION);
    const session = (await getClient()).startSession();
    try {
        await session.withTransaction(async () => {
            await positions.deleteMany({ userId: user._id }, { session });
            await users.updateOne({ _id: user._id }, { $set: { cash: STARTING_CASH } }, { session });
        });
    } finally {
        await session.endSession();
    }
    revalidatePath("/", "layout");
    return { ok: true, message: "Your account is back to $100,000" };
}
