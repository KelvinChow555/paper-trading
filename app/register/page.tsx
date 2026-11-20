import { redirect } from "next/navigation";
import AuthForm from "@/component/AuthForm";
import { Main } from "@/component/Styles";
import { getUser } from "@/lib/session";

export default async function RegisterPage() {
    if (await getUser()) {
        redirect("/portfolio");
    }
    return (
        <Main>
            <AuthForm mode="register" />
        </Main>
    );
}
