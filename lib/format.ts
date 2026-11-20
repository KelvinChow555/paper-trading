// Money is stored in whole cents, so 12345 means $123.45.
export function toCents(dollars: number): number {
    return Math.round(dollars * 100);
}

export function money(cents: number): string {
    return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function signedMoney(cents: number): string {
    if (cents > 0) {
        return "+" + money(cents);
    }
    return money(cents);
}

export function percent(value: number): string {
    let sign = "";
    if (value > 0) {
        sign = "+";
    }
    return `${sign}${value.toFixed(2)}%`;
}

export function color(value: number | null): string {
    if (value === null || value === 0) {
        return "#6b7280";
    }
    if (value > 0) {
        return "#15803d";
    }
    return "#b91c1c";
}
