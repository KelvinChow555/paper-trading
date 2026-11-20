export function isValidTicker(ticker: string): boolean {
    return /^[A-Z][A-Z0-9.-]{0,9}$/.test(ticker);
}

export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidShares(shares: number): boolean {
    return Number.isInteger(shares) && shares >= 1 && shares <= 100000;
}
