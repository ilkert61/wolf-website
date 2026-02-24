import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idStr } = await params;
    const id = Number(idStr);
    if (isNaN(id)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    try {
        const product = await prisma.product.findUnique({
            where: { id },
            // @ts-ignore: Stale Prisma types
            include: {
                images: {
                    orderBy: { order: 'asc' }
                },
                category: true
            }
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch product" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: idStr } = await params;
    const id = Number(idStr);
    if (isNaN(id)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    try {
        const body = await request.json();
        const { title, description, price, basePrice, currency, exchangeRateUsed, originalPrice, stock, isDeal, categoryId, images, attributes, status, metaTitle, metaDescription, keywords } = body;

        // Transaction to handle product update and images
        // @ts-ignore: Stale Prisma types causing inference issues
        const product = await prisma.$transaction(async (tx: any) => {
            // 1. Update basic product info
            const updatedProduct = await tx.product.update({
                where: { id },
                data: {
                    title,
                    description,
                    price: price ? Number(price) : undefined,
                    basePrice: basePrice !== undefined ? (basePrice ? Number(basePrice) : null) : undefined,
                    currency: currency !== undefined ? currency : undefined,
                    exchangeRateUsed: exchangeRateUsed !== undefined ? (exchangeRateUsed ? Number(exchangeRateUsed) : null) : undefined,
                    originalPrice: originalPrice !== undefined ? (originalPrice ? Number(originalPrice) : null) : undefined,
                    stock: stock !== undefined ? Number(stock) : undefined,
                    isDeal: isDeal !== undefined ? isDeal : undefined,
                    categoryId: categoryId ? Number(categoryId) : undefined,
                    attributes: attributes ? JSON.stringify(attributes) : undefined,
                    status,
                    metaTitle: metaTitle !== undefined ? metaTitle : undefined,
                    metaDescription: metaDescription !== undefined ? metaDescription : undefined,
                    keywords: keywords !== undefined ? keywords : undefined,
                },
            });

            // 2. Handle images if provided
            if (images && Array.isArray(images)) {
                // Delete existing images
                await tx.productImage.deleteMany({
                    where: { productId: id }
                });

                // Create new images
                if (images.length > 0) {
                    await tx.productImage.createMany({
                        data: images.map((img: any, index: number) => ({
                            url: img.url,
                            isMain: index === 0,
                            order: index,
                            productId: id
                        }))
                    });
                }
            }

            return updatedProduct;
        });

        // Optionally create a PriceLog if basePrice or currency changed manually, but the general sync does that.
        // For manual edits, we could add logs, but that's an advanced audit trail feature. We'll skip manual price log for now unless requested.

        return NextResponse.json(product);
    } catch (error) {
        console.error("Update product error:", error);
        return NextResponse.json(
            { error: "Failed to update product" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: idStr } = await params;
    const id = Number(idStr);
    if (isNaN(id)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    try {
        // Logging the delete to ActivityLog
        await prisma.activityLog.create({
            data: {
                action: "Ürün Silindi",
                details: `Ürün ID: ${id} silindi.`
            }
        });

        await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete product error:", error);
        return NextResponse.json(
            { error: "Failed to delete product" },
            { status: 500 }
        );
    }
}
