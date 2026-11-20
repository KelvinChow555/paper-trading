import { ObjectId } from "mongodb";
import { getCollection, ORDERS_COLLECTION, POSITIONS_COLLECTION, STARTING_CASH } from "@/db";
import { getQuote } from "@/lib/massive";
import { HoldingProps, OrderDoc, OrderProps, PortfolioProps, PositionDoc, QuoteProps, UserProps } from "@/types";
async function safeQuote(symbol: string): Promise<QuoteProps | null> {
    try {
        return await getQuote(symbol);
    } catch {
        return null;
    }
}

export async function getPortfolio(user: UserProps): Promise<PortfolioProps> {
    const positions = await getCollection<PositionDoc>(POSITIONS_COLLECTION);
    const held = await positions.find({ userId: new ObjectId(user.id) }).sort({ symbol: 1 }).toArray();
    const quotes = await Promise.all(held.map((p) => safeQuote(p.symbol)));

    const holdings: HoldingProps[] = held.map((p, i) => {
        const quote = quotes[i];
        if (!quote) {
            return { symbol: p.symbol, shares: p.shares, avgCost: Math.round(p.cost / p.shares), price: null, value: p.cost, gain: null };
        }
        const value = quote.close * p.shares;
        return { symbol: p.symbol, shares: p.shares, avgCost: Math.round(p.cost / p.shares), price: quote.close, value, gain: value - p.cost };
    });
    const invested = holdings.reduce((sum, h) => sum + h.value, 0);
    return {
        cash: user.cash,
        invested,
        total: user.cash + invested,
        totalReturn: user.cash + invested - STARTING_CASH,
        holdings,
    };
}

export async function getShares(userId: string, symbol: string): Promise<number> {
    const positions = await getCollection<PositionDoc>(POSITIONS_COLLECTION);
    const position = await positions.findOne({ userId: new ObjectId(userId), symbol });
    return position?.shares ?? 0;
}

export async function getOrders(userId: string): Promise<OrderProps[]> {
    const orders = await getCollection<OrderDoc>(ORDERS_COLLECTION);
    const docs = await orders.find({ userId: new ObjectId(userId) }).sort({ createdAt: -1 }).limit(100).toArray();
    return docs.map((o) => ({
        id: o._id.toHexString(),
        symbol: o.symbol,
        side: o.side,
        shares: o.shares,
        price: o.price,
        total: o.total,
        gain: o.gain,
        date: o.createdAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "America/New_York" }),
    }));
}

export async function getWatchlist(symbols: string[]): Promise<{ symbol: string; quote: QuoteProps | null }[]> {
    const quotes = await Promise.all(symbols.map((s) => safeQuote(s)));
    return symbols.map((symbol, i) => ({ symbol, quote: quotes[i] }));
}
