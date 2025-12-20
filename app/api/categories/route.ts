import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
    try {
        // @ts-ignore: Stale Prisma types
        const categories = await prisma.category.findMany({
            orderBy: { order: "asc" },
            include: {
                _count: {
                    select: { products: true, children: true },
                },
                children: {
                    orderBy: { order: "asc" },
                    include: {
                        _count: {
                            select: { products: true }
                        }
                    }
                }
            },
        });

        // Filter to only return root categories (where parentId is null) if needed, 
        // but for the admin tree we might want all and structure them.
        // For simplicity, let's return all and let the client build the tree from parentIds if needed,
        // OR return the tree directly. Given the 'include: { children: ... }', 
        // findMany will return all matched.
        // Default behavior: return all, but we probably want a tree.
        // Actually, if we just want roots that have children included:

        // Let's modify the query to get roots only, with recursive children? 
        // Prisma doesn't do deep infinite recursion easily. 
        // Better approach: Get ALL categories flat, build tree on client.
        // BUT, user asked for "Parents" functionality.

        // Let's stick to returning ALL categories flat (but ordered) and let the Frontend use 'parentId' to build the tree.
        // That is robust.

        // Re-query without specific structure constraint, just ordered.
        // @ts-ignore
        const allCategories = await prisma.category.findMany({
            orderBy: { order: "asc" },
            include: {
                _count: { select: { products: true } }
            }
        });

        return NextResponse.json(allCategories);
    } catch (error) {
        return NextResponse.json(
            { error: "Error fetching categories" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, slug, description, imageUrl, attributes, parentId } = body;

        // Validations
        if (!name || !slug) {
            return NextResponse.json({ error: "Name and Slug are required" }, { status: 400 });
        }

        // Get max order to put this at the end
        // @ts-ignore
        const lastCategory = await prisma.category.findFirst({
            where: { parentId: parentId || null },
            orderBy: { order: 'desc' },
        });
        const newOrder = (lastCategory?.order ?? -1) + 1;

        // @ts-ignore: Stale Prisma types
        const category = await prisma.category.create({
            data: {
                name,
                slug,
                description,
                imageUrl,
                attributes: attributes ? JSON.stringify(attributes) : null,
                parentId: parentId ? Number(parentId) : null,
                order: newOrder,
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error("Create category error:", error);
        return NextResponse.json(
            { error: "Error creating category" },
            { status: 500 }
        );
    }
}

// Bulk Update / Reorder Endpoint
export async function PUT(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();

        // Check if body is an array for Bulk Update
        if (Array.isArray(body)) {
            // body: { id: number, order: number, parentId: number | null }[]
            const updates = body;

            // Transaction for atomicity
            // @ts-ignore
            await prisma.$transaction(
                updates.map((item: any) =>
                    // @ts-ignore
                    prisma.category.update({
                        where: { id: item.id },
                        data: {
                            order: item.order,
                            parentId: item.parentId
                        }
                    })
                )
            );

            return NextResponse.json({ success: true, message: "Categories reordered successfully" });
        }

        return NextResponse.json({ error: "Invalid data format" }, { status: 400 });

    } catch (error) {
        console.error("Reorder categories error:", error);
        return NextResponse.json(
            { error: "Error reordering categories" },
            { status: 500 }
        );
    }
}
