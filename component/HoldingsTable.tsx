"use client"
import Link from "next/link";
import { color, money, signedMoney } from "@/lib/format";
import { HoldingProps } from "@/types";
import { Gray, Table } from "./Styles";

export default function HoldingsTable({ holdings }: { holdings: HoldingProps[] }) {
    if (holdings.length === 0) {
        return <Gray>You don&apos;t own any shares yet. Search for a ticker to make your first trade.</Gray>;
    }
    return (
        <Table>
            <thead>
                <tr>
                    <th>Ticker</th>
                    <th>Shares</th>
                    <th>Avg cost</th>
                    <th>Price</th>
                    <th>Value</th>
                    <th>Gain</th>
                </tr>
            </thead>
            <tbody>
                {holdings.map((h) => (
                    <tr key={h.symbol}>
                        <td><Link href={`/stock/${h.symbol}`}>{h.symbol}</Link></td>
                        <td>{h.shares}</td>
                        <td>{money(h.avgCost)}</td>
                        <td>{h.price === null ? "N/A" : money(h.price)}</td>
                        <td>{money(h.value)}</td>
                        <td style={{ color: color(h.gain) }}>{h.gain === null ? "N/A" : signedMoney(h.gain)}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}
