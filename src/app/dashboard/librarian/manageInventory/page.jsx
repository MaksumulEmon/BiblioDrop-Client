import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ManageInventory from "@/Components/ManageInventory";

export default async function Page() {

    const session = await auth.api.getSession({
        headers: await headers()
    });

    return (
        <ManageInventory userId={session?.user?.id} />
    );
}