import ErrorM from "@/component/ErrorM";

export default function TickerNotFound() {
    return <ErrorM title="Ticker not found" message="Check the symbol and try again, for example AAPL." />;
}
