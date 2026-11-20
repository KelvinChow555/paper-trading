import { redirect } from "next/navigation";
import OrdersTable from "@/component/OrdersTable";
import { Card, Main } from "@/component/Styles";
import { getOrders } from "@/lib/portfolio";
import { getUser } from "@/lib/session";

export default async function OrdersPage() {
    const user = await getUser();
    if (!user) {
        redirect("/login");
    }
    const orders = await getOrders(user.id);
    return (
        <Main>
            <h1>Your orders</h1>
            <Card>
                <OrdersTable orders={orders} />
            </Card>
        </Main>
    );
}
