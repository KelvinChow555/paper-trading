import Link from "next/link";
import { notFound } from "next/navigation";
import CompanyInfo from "@/component/CompanyInfo";
import ErrorM from "@/component/ErrorM";
import PriceChart from "@/component/PriceChart";
import TradeForm from "@/component/TradeForm";
import WatchButton from "@/component/WatchButton";
import { Card, Gray, Main } from "@/component/Styles";
import { color, money, percent } from "@/lib/format";
import { getCompany, getHistory, getQuote } from "@/lib/massive";
import { getShares } from "@/lib/portfolio";
import { getUser } from "@/lib/session";
import { isValidTicker } from "@/lib/validation";

export default async function StockPage({ params, searchParams }: { params: Promise<{ ticker: string }>; searchParams: Promise<{ days?: string }> }) {
    const { ticker } = await params;
    const { days } = await searchParams;
    const symbol = decodeURIComponent(ticker).toUpperCase();
    if (!isValidTicker(symbol)) {
        notFound();
    }
    let range = Number(days);
    if (![30, 90, 180, 365].includes(range)) {
        range = 90;
    }
    let company;
    let quote;
    let history;
    try {
        company = await getCompany(symbol);
        quote = await getQuote(symbol);
        history = await getHistory(symbol, range);
    } catch (error) {
        return <ErrorM title={`Couldn't load ${symbol}`} message={(error as Error).message} />;
    }
    if (!company) {
        notFound();
    }
    const user = await getUser();
    let owned = 0;
    if (user) {
        owned = await getShares(user.id, symbol);
    }
    return (
        <Main>
            <Link href="/">Back to search</Link>
            <Card>
                <CompanyInfo company={company} />
            </Card>
            <Card>
                {quote && (
                    <div>
                        <Gray>Latest close: {quote.date}</Gray>
                        <h2>
                            {money(quote.close)}{" "}
                            <span style={{ color: color(quote.change) }}>{percent(quote.percent)}</span>
                        </h2>
                    </div>
                )}
                {!quote && <Gray>No price data for {symbol}.</Gray>}
                <PriceChart points={history} ticker={symbol} days={range} />
            </Card>
            <Card>
                {user && quote && <TradeForm ticker={symbol} price={quote.close} cash={user.cash} owned={owned} />}
                {user && !quote && <Gray>You can&apos;t trade {symbol} without a price.</Gray>}
                {!user && <p><Link href="/login">Sign in</Link> to trade {symbol}.</p>}
                {user && (
                    <p>
                        <WatchButton ticker={symbol} watching={user.watchlist.includes(symbol)} />
                    </p>
                )}
            </Card>
        </Main>
    );
}
