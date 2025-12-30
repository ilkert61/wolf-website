import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort");

    try {
        const whereClause: any = {};

        // Category Filter
        if (categoryId) {
            whereClause.categoryId = parseInt(categoryId);
        }

        // Price Range Filter
        if (minPrice || maxPrice) {
            whereClause.price = {};
            if (minPrice) whereClause.price.gte = Number(minPrice);
            if (maxPrice) whereClause.price.lte = Number(maxPrice);
        }

        // Deal of the Week Filter
        const isDeal = searchParams.get("isDeal");
        if (isDeal === "true") {
            whereClause.isDeal = true;
        }

        // Attribute Filter
        // Extract all params that start with "attr_"
        const attributeFilters: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            if (key.startsWith("attr_")) {
                const attrName = key.replace("attr_", "");
                attributeFilters[attrName] = value;
            }
        });

        // Since attributes are stored as a JSON string, we can't easily query them directly with Prisma/SQLite 
        // in a way that maps perfectly to "contains key-value pair".
        // However, we can fetch products first and filter in memory, OR use raw queries.
        // For simplicity and compatibility with the current setup (small scale), we'll fetch and filter in memory if attributes are present.
        // Note: In a real production Postgres/MySQL app, we would use Json filters.

        const products = await prisma.product.findMany({
            // @ts-ignore: Stale Prisma types
            where: whereClause,
            // @ts-ignore: Stale Prisma types
            include: {
                category: true,
                images: {
                    orderBy: {
                        order: 'asc'
                    }
                }
            },
            orderBy: sort === 'price_asc' ? { price: 'asc' } :
                sort === 'price_desc' ? { price: 'desc' } :
                    { createdAt: 'desc' }
        });

        // In-memory attribute filtering
        let filteredProducts = products;
        if (Object.keys(attributeFilters).length > 0) {
            filteredProducts = products.filter((product: any) => {
                if (!product.attributes) return false;
                try {
                    const productAttrs = JSON.parse(product.attributes);
                    // Check if product has all requested attributes with matching values
                    return Object.entries(attributeFilters).every(([key, value]) => {
                        // If value is "true" (checkbox), just check existence? 
                        // Or if we pass specific values e.g. attr_Brand=Asus
                        return productAttrs[key] === value;
                    });
                } catch (e) {
                    return false;
                }
            });
        }

        return NextResponse.json(filteredProducts);
    } catch (error) {
        return NextResponse.json(
            { error: "Error fetching products" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    // Session protection - only authenticated admins can create products
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, description, price, originalPrice, stock, isDeal, categoryId, images, attributes, status } = body;

        // Create product with relations
        const product = await prisma.product.create({
            data: {
                title,
                description,
                price: Number(price),
                originalPrice: originalPrice ? Number(originalPrice) : null,
                stock: stock !== undefined ? Number(stock) : 1,
                isDeal: isDeal || false,
                // @ts-ignore: Stale Prisma types
                categoryId: Number(categoryId),
                status: status || "On Sale",
                // @ts-ignore: Stale Prisma types
                attributes: attributes ? JSON.stringify(attributes) : null,
                // @ts-ignore: Stale Prisma types
                images: {
                    create: images && images.length > 0 ? images.map((img: any, index: number) => ({
                        url: img.url,
                        isMain: index === 0, // First image is main by default
                        order: index
                    })) : []
                }
            },
            // @ts-ignore: Stale Prisma types
            include: {
                category: true,
                images: true
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json(
            { error: "Error creating product" },
            { status: 500 }
        );
    }
}
