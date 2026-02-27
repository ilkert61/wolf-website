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

        const applications = await prisma.financeRequest.findMany({
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
        const { fullName, phone, email, deviceType, brandModel, deviceCondition, requestedAmount, message } = body;

        if (!fullName || !phone || !deviceType || !brandModel) {
            return NextResponse.json(
                { error: "Required fields missing" },
                { status: 400 }
            );
        }

        // Basic validations
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
        }

        const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
        if (!phoneRegex.test(phone)) {
            return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 });
        }

        const application = await prisma.financeRequest.create({
            data: {
                fullName,
                phone,
                email: email || null,
                deviceType,
                brandModel,
                deviceCondition: deviceCondition || null,
                requestedAmount: requestedAmount ? parseFloat(requestedAmount) : null,
                message: message || null,
                images: [],
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
