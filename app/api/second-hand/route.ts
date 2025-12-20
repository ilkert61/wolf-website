
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { getSession } from "@/lib/auth";

// GET - Fetch all listings (Admin only)
export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const listings = await prisma.secondHandListing.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(listings);
    } catch (error) {
        console.error("Error fetching second hand listings:", error);
        return NextResponse.json(
            { error: "Error fetching listings" },
            { status: 500 }
        );
    }
}

// Validation Schema
const secondHandSchema = z.object({
    personalInfo: z.object({
        name: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
        surname: z.string().min(2, "Soyad en az 2 karakter olmalıdır"),
        phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
        email: z.string().email("Geçerli bir email adresi giriniz").optional().or(z.literal("")),
    }),
    productInfo: z.object({
        brand: z.string().min(1, "Marka seçiniz"),
        model: z.string().min(1, "Model giriniz"),
        description: z.string().optional(),
        estimatedPrice: z.string().optional(),
    }),
    condition: z.enum(["SIFIR_GIBI", "COK_IYI", "IYI", "ORTA"]),
    accessories: z.array(z.string()).optional(),
    images: z.array(z.string()).min(1, "En az 1 fotoğraf yüklemelisiniz"),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate Input
        const validationResult = secondHandSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: "Validation Error", details: validationResult.error.flatten() },
                { status: 400 }
            );
        }

        const { personalInfo, productInfo, condition, accessories, images } = validationResult.data;

        // Create Listing
        const listing = await prisma.secondHandListing.create({
            data: {
                personalInfo: JSON.stringify(personalInfo),
                productInfo: JSON.stringify(productInfo),
                condition,
                accessories: accessories ? JSON.stringify(accessories) : null,
                images: JSON.stringify(images),
                status: "PENDING",
            },
        });

        return NextResponse.json({ success: true, listingId: listing.id });
    } catch (error) {
        console.error("Error creating second hand listing:", error);
        return NextResponse.json(
            { error: "Sunucu hatası oluştu, lütfen daha sonra tekrar deneyiniz." },
            { status: 500 }
        );
    }
}
