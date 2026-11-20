import { ObjectId } from "mongodb";

// ---------- What MongoDB stores (money is always whole cents) ----------
export type UserDoc = {
    _id: ObjectId;
    name: string;
    email: string;
    passwordHash: string;
    cash: number;
    watchlist: string[];
};
export type SessionDoc = {
    token: string; // a hash of the cookie, never the cookie itself
    userId: ObjectId;
    expiresAt: Date;
};
export type PositionDoc = {
    userId: ObjectId;
    symbol: string;
    shares: number;
    cost: number; // total paid for the shares still held
};
export type OrderDoc = {
    userId: ObjectId;
    symbol: string;
    side: "BUY" | "SELL";
    shares: number;
    price: number;
    total: number;
    gain: number | null; // only for sells
    createdAt: Date;
};

// ---------- What the pages show ----------
export type UserProps = {
    id: string;
    name: string;
    cash: number;
    watchlist: string[];
};
export type QuoteProps = {
    close: number; // in cents
    change: number; // in cents
    percent: number;
    date: string;
};
export type CompanyProps = {
    ticker: string;
    name: string;
    description: string | null;
    homepage: string | null;
    exchange: string | null;
    marketCap: number | null;
    employees: number | null;
    listDate: string | null;
    logo: string | null;
};
export type PricePointProps = {
    date: string;
    close: number; // in dollars, only used to draw the chart
};
export type HoldingProps = {
    symbol: string;
    shares: number;
    avgCost: number;
    price: number | null;
    value: number;
    gain: number | null;
};
export type PortfolioProps = {
    cash: number;
    invested: number;
    total: number;
    totalReturn: number;
    holdings: HoldingProps[];
};
export type OrderProps = {
    id: string;
    symbol: string;
    side: "BUY" | "SELL";
    shares: number;
    price: number;
    total: number;
    gain: number | null;
    date: string;
};
export type Result =
    | { ok: true; message: string }
    | { ok: false; error: string };
