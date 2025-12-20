import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        // @ts-ignore: Stale Prisma types
        include: {
            category: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Ürünler</h1>
                <Link
                    href="/wolf-admin-1392a14/products/new"
                    className="relative z-10 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
                >
                    <Plus className="w-5 h-5" />
                    Ürün Ekle
                </Link>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-gray-400">
                        <tr>
                            <th className="p-4">Ürün</th>
                            <th className="p-4">Kategori</th>
                            <th className="p-4">Fiyat</th>
                            <th className="p-4">Stok</th>
                            <th className="p-4">Durum</th>
                            <th className="p-4 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {products.length > 0 ? (
                            products.map((product: any) => (
                                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-white">{product.title}</div>
                                        {product.isDeal && (
                                            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">Fırsat</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-gray-300">{product.category?.name || '-'}</td>
                                    <td className="p-4 text-white">
                                        {product.originalPrice && (
                                            <span className="text-gray-500 line-through text-sm mr-2">₺{Number(product.originalPrice).toLocaleString()}</span>
                                        )}
                                        ₺{Number(product.price).toLocaleString()}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock === 0 ? 'bg-red-500/20 text-red-400' :
                                            product.stock <= 3 ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-green-500/20 text-green-400'
                                            }`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-bold ${product.status === "On Sale"
                                                ? "bg-green-500/20 text-green-400"
                                                : "bg-red-500/20 text-red-400"
                                                }`}
                                        >
                                            {product.status === "On Sale" ? "Satışta" : "Satıldı"}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/wolf-admin-1392a14/products/${product.id}/edit`}
                                                className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <DeleteProductButton id={product.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-400">
                                    Henüz ürün bulunmuyor.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
