"use client"
import { useState } from "react";
import { addToWatchlist, removeFromWatchlist } from "@/lib/watchlist";
import { LightButton } from "./Styles";

export default function WatchButton({ ticker, watching }: { ticker: string; watching: boolean }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    async function toggle() {
        setLoading(true);
        const result = watching ? await removeFromWatchlist(ticker) : await addToWatchlist(ticker);
        setError(result.ok ? "" : result.error);
        setLoading(false);
    }
    return (
        <span>
            <LightButton onClick={toggle} disabled={loading}>
                {watching ? "Remove from watchlist" : "Add to watchlist"}
            </LightButton>
            {error && <span style={{ color: "#b91c1c", marginLeft: 8 }}>{error}</span>}
        </span>
    );
}
