import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
    try {
        // @ts-ignore: Stale Prisma types
        let settings = await prisma.siteSettings.findFirst();

        if (!settings) {
            // Create default settings if not exists
            // @ts-ignore
            settings = await prisma.siteSettings.create({
                data: {
                    siteName: "Wolf Bilişim",
                    description: "Teknoloji Çözüm Ortağınız",
                    maintenanceMode: false
                }
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Error fetching settings:", error);
        return NextResponse.json(
            { error: "Error fetching settings" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { siteName, description, contactEmail, contactPhone, address, socialMedia, maintenanceMode } = body;

        // @ts-ignore: Stale Prisma types
        const firstSettings = await prisma.siteSettings.findFirst();

        let settings;
        if (firstSettings) {
            // @ts-ignore
            settings = await prisma.siteSettings.update({
                where: { id: firstSettings.id },
                data: {
                    siteName,
                    description,
                    contactEmail,
                    contactPhone,
                    address,
                    socialMedia: socialMedia ? JSON.stringify(socialMedia) : null,
                    maintenanceMode
                }
            });
        } else {
            // @ts-ignore
            settings = await prisma.siteSettings.create({
                data: {
                    siteName,
                    description,
                    contactEmail,
                    contactPhone,
                    address,
                    socialMedia: socialMedia ? JSON.stringify(socialMedia) : null,
                    maintenanceMode
                }
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Error updating settings:", error);
        return NextResponse.json(
            { error: "Error updating settings" },
            { status: 500 }
        );
    }
}
