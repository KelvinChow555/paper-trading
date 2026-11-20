"use client"
import Link from "next/link";
import { color, money, percent } from "@/lib/format";
import { QuoteProps } from "@/types";
import { Gray, Table } from "./Styles";
import WatchButton from "./WatchButton";

export default function Watchlist({ items }: { items: { symbol: string; quote: QuoteProps | null }[] }) {
    if (items.length === 0) {
        return <Gray>Your watchlist is empty. Add tickers from their stock page.</Gray>;
    }
    return (
        <Table>
            <tbody>
                {items.map((item) => (
                    <tr key={item.symbol}>
                        <td><Link href={`/stock/${item.symbol}`}>{item.symbol}</Link></td>
                        <td>{item.quote ? money(item.quote.close) : "N/A"}</td>
                        <td style={{ color: color(item.quote?.percent ?? null) }}>{item.quote ? percent(item.quote.percent) : ""}</td>
                        <td><WatchButton ticker={item.symbol} watching={true} /></td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}
