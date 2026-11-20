import Link from "next/link";
import SearchForm from "@/component/SearchForm";
import { Gray, Main } from "@/component/Styles";
import { getUser } from "@/lib/session";

export default async function Home() {
    const user = await getUser();
    return (
        <Main>
            <h1>Paper Trade</h1>
            <Gray>Look up any US stock and practice buying and selling with $100,000 of virtual cash.</Gray>
            <SearchForm />
            {user && <p>Welcome back, {user.name}. <Link href="/portfolio">Go to your portfolio</Link></p>}
            {!user && <p><Link href="/register">Create a free account</Link> to start trading.</p>}
        </Main>
    );
}
