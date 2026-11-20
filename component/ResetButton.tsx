"use client"
import { useState } from "react";
import { resetAccount } from "@/lib/trade";
import { LightButton } from "./Styles";

export default function ResetButton() {
    const [loading, setLoading] = useState(false);
    async function reset() {
        if (!window.confirm("Start over with $100,000 and no shares? Your order history stays.")) {
            return;
        }
        setLoading(true);
        await resetAccount();
        setLoading(false);
    }
    return (
        <LightButton onClick={reset} disabled={loading}>
            {loading ? "Resetting..." : "Reset account"}
        </LightButton>
    );
}
