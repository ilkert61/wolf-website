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
        const { title, description, price, originalPrice, stock, isDeal, categoryId, images, attributes, status } = body;

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
                    originalPrice: originalPrice ? Number(originalPrice) : null,
                    stock: stock !== undefined ? Number(stock) : undefined,
                    isDeal: isDeal !== undefined ? isDeal : undefined,
                    categoryId: categoryId ? Number(categoryId) : undefined,
                    attributes: attributes ? JSON.stringify(attributes) : undefined,
                    status,
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
