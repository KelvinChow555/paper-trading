"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";
import { Button, Input } from "./Styles";

const Row = styled.form`
    display: flex;
    gap: 8px;

    input {
        flex: 1;
    }
`;

export default function SearchForm() {
    const [ticker, setTicker] = useState("");
    const router = useRouter();
    return (
        <Row
            onSubmit={(event) => {
                event.preventDefault();
                router.push(`/stock/${ticker.trim().toUpperCase()}`);
            }}
        >
            <Input value={ticker} onChange={(event) => setTicker(event.target.value)} placeholder="e.g. AAPL" />
            <Button type="submit" disabled={ticker.trim() === ""}>
                Search
            </Button>
        </Row>
    );
}
