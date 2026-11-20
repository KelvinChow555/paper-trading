"use client"
import Link from "next/link";
import { color, money, signedMoney } from "@/lib/format";
import { OrderProps } from "@/types";
import { Gray, Table } from "./Styles";

export default function OrdersTable({ orders }: { orders: OrderProps[] }) {
    if (orders.length === 0) {
        return <Gray>No orders yet.</Gray>;
    }
    return (
        <Table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Side</th>
                    <th>Ticker</th>
                    <th>Shares</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Gain</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((o) => (
                    <tr key={o.id}>
                        <td>{o.date}</td>
                        <td>{o.side === "BUY" ? "Buy" : "Sell"}</td>
                        <td><Link href={`/stock/${o.symbol}`}>{o.symbol}</Link></td>
                        <td>{o.shares}</td>
                        <td>{money(o.price)}</td>
                        <td>{money(o.total)}</td>
                        <td style={{ color: color(o.gain) }}>{o.gain === null ? "" : signedMoney(o.gain)}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}
