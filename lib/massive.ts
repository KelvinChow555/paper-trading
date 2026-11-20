import cached from "@/lib/redis";
import { toCents } from "@/lib/format";
import { CompanyProps, PricePointProps, QuoteProps } from "@/types";
// only allows 5 requests a minute.
const BASE_URL = "https://api.massive.com";

async function callApi(path: string) {
    let res;
    try {
        res = await fetch(`${BASE_URL}${path}${path.includes("?") ? "&" : "?"}apiKey=${process.env.STOCK_API_KEY}`, { cache: "no-store" });
    } catch {
        throw new Error("Couldn't reach the stock API. Please try again later.");
    }
    if (res.status === 429) {
        throw new Error("Too many requests. The free plan allows 5 per minute, so wait a minute and try again.");
    }
    if (res.status === 404) {
        return null;
    }
    if (!res.ok) {
        throw new Error(`The stock API returned an error (${res.status}).`);
    }
    return res.json();
}

async function getLogo(logoUrl?: string): Promise<string | null> {
    if (!logoUrl) {
        return null;
    }
    try {
        const res = await fetch(`${logoUrl}?apiKey=${process.env.STOCK_API_KEY}`);
        if (!res.ok) {
            return null;
        }
        const base64 = Buffer.from(await res.arrayBuffer()).toString("base64");
        return `data:${res.headers.get("content-type")};base64,${base64}`;
    } catch {
        return null;
    }
}
export async function getQuote(ticker: string): Promise<QuoteProps | null> {
    return cached(`quote:${ticker}`, 10 * 60, async () => {
        const data = await callApi(`/v2/aggs/ticker/${ticker}/prev`);
        if (!data || !data.results || data.results.length === 0) {
            return null;
        }
        const bar = data.results[0];
        return {
            close: toCents(bar.c),
            change: toCents(bar.c - bar.o),
            percent: ((bar.c - bar.o) / bar.o) * 100,
            date: new Date(bar.t).toLocaleDateString("en-US", { dateStyle: "long", timeZone: "America/New_York" }),
        };
    });
}

export async function getCompany(ticker: string): Promise<CompanyProps | null> {
    return cached(`company:${ticker}`, 24 * 60 * 60, async () => {
        const data = await callApi(`/v3/reference/tickers/${ticker}`);
        if (!data || !data.results) {
            return null;
        }
        const c = data.results;
        return {
            ticker: c.ticker,
            name: c.name,
            description: c.description ?? null,
            homepage: c.homepage_url ?? null,
            exchange: c.primary_exchange ?? null,
            marketCap: c.market_cap ?? null,
            employees: c.total_employees ?? null,
            listDate: c.list_date ?? null,
            logo: await getLogo(c.branding?.logo_url),
        };
    });
}

export async function getHistory(ticker: string, days: number): Promise<PricePointProps[]> {
    return cached(`history:${ticker}:${days}`, 60 * 60, async () => {
        const to = new Date();
        const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
        const day = (d: Date) => d.toISOString().slice(0, 10);
        const data = await callApi(`/v2/aggs/ticker/${ticker}/range/1/day/${day(from)}/${day(to)}?sort=asc`);
        if (!data || !data.results) {
            return [];
        }
        return data.results.map((bar: { c: number; t: number }) => ({
            date: new Date(bar.t).toISOString().slice(0, 10),
            close: bar.c,
        }));
    });
}
