import { NextResponse } from "next/server";
import { getLiveRates } from "@/app/actions/forex";
import { getSession } from "@/lib/auth";

export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const rates = await getLiveRates();
        return NextResponse.json(rates);
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch rates" }, { status: 500 });
    }
}
