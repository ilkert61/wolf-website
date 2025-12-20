import prisma from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: idStr } = await params;
    const id = Number(idStr);
    if (isNaN(id)) notFound();

    const product = await prisma.product.findUnique({
        where: { id },
        // @ts-ignore: Stale Prisma types
        include: {
            images: {
                orderBy: { order: 'asc' }
            },
        }
    });

    if (!product) notFound();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Ürünü Düzenle</h1>
            <ProductForm
                initialData={{
                    id: product.id,
                    title: product.title,
                    description: product.description,
                    price: Number(product.price),
                    // @ts-ignore: Stale Prisma types
                    categoryId: product.categoryId,
                    status: product.status,
                    // @ts-ignore: Stale Prisma types
                    images: product.images,
                    // @ts-ignore: Stale Prisma types
                    // @ts-ignore: Stale Prisma types
                    attributes: product.attributes || "{}",
                    isDeal: product.isDeal || false
                }}
                isEdit
            />
        </div>
    );
}
