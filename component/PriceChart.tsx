"use client"
import Link from "next/link";
import styled from "styled-components";
import { PricePointProps } from "@/types";
import { Gray } from "./Styles";

const RANGES = [
    { days: 30, label: "1M" },
    { days: 90, label: "3M" },
    { days: 180, label: "6M" },
    { days: 365, label: "1Y" },
];

const Tabs = styled.div`
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
`;

const Tab = styled(Link)<{ $active: boolean }>`
    color: ${(props) => (props.$active ? "#111827" : "#6b7280")};
    font-weight: ${(props) => (props.$active ? "bold" : "normal")};
    text-decoration: none;
`;

const Svg = styled.svg`
    width: 100%;
    height: 220px;
`;

const WIDTH = 600;
const HEIGHT = 200;

export default function PriceChart({ points, ticker, days }: { points: PricePointProps[]; ticker: string; days: number }) {
    let chart = <Gray>Not enough price history to draw a chart.</Gray>;
    if (points.length >= 2) {
        const closes = points.map((p) => p.close);
        const min = Math.min(...closes);
        const max = Math.max(...closes);
        // Turn each price into an x,y position inside the box
        const line = points
            .map((p, i) => {
                const x = (i / (points.length - 1)) * WIDTH;
                const y = HEIGHT - ((p.close - min) / (max - min || 1)) * HEIGHT;
                return `${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(" ");
        const up = closes[closes.length - 1] >= closes[0];
        chart = (
            <>
                <Svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" role="img" aria-label={`${ticker} closing prices`}>
                    <polyline points={line} fill="none" stroke={up ? "#15803d" : "#b91c1c"} strokeWidth="2" vectorEffect="non-scaling-stroke" />
                </Svg>
                <Gray>
                    {points[0].date}: ${closes[0].toFixed(2)} → {points[points.length - 1].date}: ${closes[closes.length - 1].toFixed(2)}
                </Gray>
            </>
        );
    }
    return (
        <div>
            <Tabs>
                {RANGES.map((range) => (
                    <Tab key={range.days} href={`/stock/${ticker}?days=${range.days}`} $active={range.days === days}>
                        {range.label}
                    </Tab>
                ))}
            </Tabs>
            {chart}
        </div>
    );
}
