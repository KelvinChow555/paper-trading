import React from "react";
import type { Metadata } from "next";
import GlobalStyle from "@/component/GlobalStyle";
import NavBar from "@/component/NavBar";
import Registry from "@/component/Registry";
import { getUser } from "@/lib/session";

export const metadata: Metadata = {
    title: "Paper Trade",
    description: "Practice trading US stocks with $100,000 of virtual cash",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const user = await getUser();
    return (
        <html lang="en">
            <body>
                <Registry>
                    <GlobalStyle />
                    <NavBar name={user?.name ?? null} />
                    {children}
                </Registry>
            </body>
        </html>
    );
}
