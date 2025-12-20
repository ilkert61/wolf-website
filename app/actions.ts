"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete("session");
    } catch (error) {
        console.error("Logout error:", error);
    }
    redirect("/wolf-admin-1392a14/login");
}
