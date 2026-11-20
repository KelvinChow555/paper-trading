import { redirect } from "next/navigation";
import AuthForm from "@/component/AuthForm";
import { Main } from "@/component/Styles";
import { getUser } from "@/lib/session";

export default async function LoginPage() {
    if (await getUser()) {
        redirect("/portfolio");
    }
    return (
        <Main>
            <AuthForm mode="login" />
        </Main>
    );
}
