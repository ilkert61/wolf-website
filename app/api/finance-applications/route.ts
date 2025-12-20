import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET - Tüm finans başvurularını getir
export async function GET(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    try {
        const whereClause: any = {};
        if (status && status !== "all") {
            whereClause.status = status;
        }

        // @ts-ignore replacement
        const applications = await prisma.financeApplication.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(applications);
    } catch (error) {
        console.error("Error fetching finance applications:", error);
        return NextResponse.json(
            { error: "Failed to fetch applications" },
            { status: 500 }
        );
    }
}

// POST - Yeni finans başvurusu oluştur (public endpoint)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, email, deviceType, brandModel, estimatedValue, message } = body;

        if (!name || !phone || !deviceType || !brandModel) {
            return NextResponse.json(
                { error: "Required fields missing" },
                { status: 400 }
            );
        }

        // @ts-ignore
        const application = await prisma.financeApplication.create({
            data: {
                name,
                phone,
                email: email || null,
                deviceType,
                brandModel,
                estimatedValue: estimatedValue || null,
                message: message || null,
                status: "Beklemede",
            },
        });

        return NextResponse.json(application);
    } catch (error) {
        console.error("Error creating finance application:", error);
        return NextResponse.json(
            { error: "Failed to create application" },
            { status: 500 }
        );
    }
}
