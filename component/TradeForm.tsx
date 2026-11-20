"use client"
import { useState } from "react";
import styled from "styled-components";
import { placeOrder } from "@/lib/trade";
import { money } from "@/lib/format";
import { Result } from "@/types";
import { Button, ErrorText, Form, Gray, Input, SuccessText } from "./Styles";

const Sides = styled.div`
    display: flex;
    gap: 8px;
`;

const SideButton = styled.button<{ $selected: boolean }>`
    flex: 1;
    padding: 8px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: ${(props) => (props.$selected ? "#111827" : "white")};
    color: ${(props) => (props.$selected ? "white" : "#111827")};
    font-size: 16px;
    cursor: pointer;
`;

export default function TradeForm({ ticker, price, cash, owned }: { ticker: string; price: number; cash: number; owned: number }) {
    const [side, setSide] = useState<"BUY" | "SELL">("BUY");
    const [shares, setShares] = useState("1");
    const [result, setResult] = useState<Result | null>(null);
    const [loading, setLoading] = useState(false);
    const count = Number(shares);
    async function submit() {
        setLoading(true);
        setResult(await placeOrder(ticker, side, count));
        setLoading(false);
    }
    return (
        <Form action={submit}>
            <h2>Trade {ticker}</h2>
            <Sides>
                <SideButton type="button" $selected={side === "BUY"} onClick={() => setSide("BUY")}>Buy</SideButton>
                <SideButton type="button" $selected={side === "SELL"} onClick={() => setSide("SELL")}>Sell</SideButton>
            </Sides>
            <Input type="number" min={1} step={1} value={shares} onChange={(event) => setShares(event.target.value)} aria-label="Shares" />
            <Gray>
                Estimated total: {money(price * (count || 0))}. You have {money(cash)} cash and own {owned} shares.
            </Gray>
            {result && !result.ok && <ErrorText>{result.error}</ErrorText>}
            {result && result.ok && <SuccessText>{result.message}</SuccessText>}
            <Button type="submit" disabled={loading || !(count >= 1)}>
                {loading ? "Placing order..." : side === "BUY" ? "Buy" : "Sell"}
            </Button>
        </Form>
    );
}
