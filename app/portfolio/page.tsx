import { redirect } from "next/navigation";
import ErrorM from "@/component/ErrorM";
import HoldingsTable from "@/component/HoldingsTable";
import ResetButton from "@/component/ResetButton";
import Watchlist from "@/component/Watchlist";
import { Card, Grid, Label, Main, Value } from "@/component/Styles";
import { color, money, signedMoney } from "@/lib/format";
import { getPortfolio, getWatchlist } from "@/lib/portfolio";
import { getUser } from "@/lib/session";

export default async function PortfolioPage() {
    const user = await getUser();
    if (!user) {
        redirect("/login");
    }
    let portfolio;
    let watchlist;
    try {
        portfolio = await getPortfolio(user);
        watchlist = await getWatchlist(user.watchlist);
    } catch (error) {
        return <ErrorM title="Couldn't load your portfolio" message={(error as Error).message} />;
    }
    return (
        <Main>
            <h1>Your portfolio</h1>
            <Card>
                <Grid>
                    <div>
                        <Label>Account value</Label>
                        <Value>{money(portfolio.total)}</Value>
                    </div>
                    <div>
                        <Label>Cash</Label>
                        <Value>{money(portfolio.cash)}</Value>
                    </div>
                    <div>
                        <Label>Invested</Label>
                        <Value>{money(portfolio.invested)}</Value>
                    </div>
                    <div>
                        <Label>Total return</Label>
                        <Value style={{ color: color(portfolio.totalReturn) }}>{signedMoney(portfolio.totalReturn)}</Value>
                    </div>
                </Grid>
            </Card>
            <Card>
                <h2>Holdings</h2>
                <HoldingsTable holdings={portfolio.holdings} />
            </Card>
            <Card>
                <h2>Watchlist</h2>
                <Watchlist items={watchlist} />
            </Card>
            <Card>
                <h2>Start over</h2>
                <ResetButton />
            </Card>
        </Main>
    );
}
