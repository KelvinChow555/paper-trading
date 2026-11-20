"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn, signUp } from "@/lib/auth";
import { Button, Card, ErrorText, Form, Input } from "./Styles";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    async function submit(data: FormData) {
        setLoading(true);
        setError("");
        let result;
        if (mode === "login") {
            result = await signIn(data);
        } else {
            result = await signUp(data);
        }
        if (!result.ok) {
            setError(result.error);
            setLoading(false);
            return;
        }
        router.push("/portfolio");
        router.refresh();
    }
    return (
        <Card>
            <h1>{mode === "login" ? "Sign in" : "Create an account"}</h1>
            <Form
                onSubmit={(event) => {
                    event.preventDefault(); // keeps what you typed if there's an error
                    submit(new FormData(event.currentTarget));
                }}
            >
                {mode === "register" && <Input name="name" required placeholder="Your name" />}
                <Input name="email" type="email" required placeholder="Email" />
                <Input name="password" type="password" required placeholder="Password (at least 8 characters)" />
                {error && <ErrorText>{error}</ErrorText>}
                <Button type="submit" disabled={loading}>
                    {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
                </Button>
            </Form>
            {mode === "login" && <p>New here? <Link href="/register">Create an account</Link></p>}
            {mode === "register" && <p>Already have an account? <Link href="/login">Sign in</Link></p>}
        </Card>
    );
}
