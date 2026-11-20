"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { signOut } from "@/lib/auth";
import { LightButton } from "./Styles";

const Bar = styled.header`
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 24px;
    background: white;
    border-bottom: 1px solid #e5e7eb;
`;

const Brand = styled(Link)`
    flex: 1;
    color: #111827;
    font-weight: bold;
    text-decoration: none;
`;

export default function NavBar({ name }: { name: string | null }) {
    const router = useRouter();
    async function logout() {
        await signOut();
        router.push("/");
        router.refresh();
    }
    return (
        <Bar>
            <Brand href="/">Paper Trade</Brand>
            {name && (
                <>
                    <Link href="/portfolio">Portfolio</Link>
                    <Link href="/orders">Orders</Link>
                    <span>{name}</span>
                    <LightButton onClick={logout}>Sign out</LightButton>
                </>
            )}
            {!name && (
                <>
                    <Link href="/login">Sign in</Link>
                    <Link href="/register">Create account</Link>
                </>
            )}
        </Bar>
    );
}
