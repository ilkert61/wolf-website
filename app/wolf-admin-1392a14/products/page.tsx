import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Search, DollarSign, Package } from "lucide-react";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        include: {
            category: true,
            images: { take: 1, orderBy: { order: "asc" } }
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">Envanter</h1>
                    <p className="text-slate-400 font-medium">Bütün ürünleri, fiyatlandırma kuralları ve stok durumlarını yönetin.</p>
                </div>
                <Link
                    href="/wolf-admin-1392a14/products/new"
                    className="flex flex-col lg:flex-row lg:items-center gap-4 group bg-gradient-to-r from-brand-cyan to-brand-violet px-6 py-4 rounded-2xl hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex-shrink-0"
                >
                    <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <div className="font-black text-white text-lg leading-none mb-1">Yeni Ürün Ekle</div>
                        <div className="text-[11px] font-bold text-white/70 uppercase tracking-widest">Global Piyasaya Sun</div>
                    </div>
                </Link>
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Envanterde ara..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/50 transition-all font-medium"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    </div>
                    <div className="text-sm font-bold text-slate-500">
                        Toplam <span className="text-white bg-white/10 px-2 py-0.5 rounded-md ml-1">{products.length}</span> Ürün
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#020202] text-slate-400 text-xs uppercase tracking-widest font-bold font-sans">
                            <tr>
                                <th className="p-6 border-b border-white/5">Ürün Modeli</th>
                                <th className="p-6 border-b border-white/5">Kategori</th>
                                <th className="p-6 border-b border-white/5 w-48">Fiyatlandırma</th>
                                <th className="p-6 border-b border-white/5 text-center">Stok</th>
                                <th className="p-6 border-b border-white/5 text-center">Durum</th>
                                <th className="p-6 border-b border-white/5 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {products.length > 0 ? (
                                products.map((product: any) => (
                                    <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-[#020202] border border-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                    {product.images?.[0] ? (
                                                        <img src={product.images[0].url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                    ) : (
                                                        <Package className="w-5 h-5 text-slate-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-black text-white text-base group-hover:text-brand-cyan transition-colors">{product.title}</div>
                                                    {product.isDeal && (
                                                        <span className="inline-block mt-1 text-[10px] bg-brand-violet/20 text-brand-violet px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Fırsat</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="text-sm font-bold text-slate-400">{product.category?.name || '-'}</span>
                                        </td>
                                        <td className="p-6">
                                            {/* Forex logic display */}
                                            {product.currency !== "TRY" ? (
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-1 text-xs font-bold text-slate-500 mb-1">
                                                        <span className="bg-white/10 px-1.5 rounded text-white">{product.currency}</span>
                                                        <span>Girişli</span>
                                                    </div>
                                                    <div className="font-black text-white text-lg">
                                                        ₺{Number(product.price).toLocaleString()}
                                                    </div>
                                                    <div className="text-[10px] text-emerald-400/80 font-bold uppercase mt-0.5">
                                                        ~ {Number(product.basePrice).toLocaleString()} {product.currency}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="font-black text-white text-lg">
                                                    ₺{Number(product.price).toLocaleString()}
                                                    <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">
                                                        Sabit TL
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-6 text-center">
                                            <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-black text-sm ${product.stock === 0 ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                product.stock <= 3 ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                }`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="p-6 text-center">
                                            <div className="flex items-center justify-center">
                                                <span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${product.status === "On Sale"
                                                    ? "bg-emerald-500/10 text-emerald-400"
                                                    : "bg-red-500/10 text-red-400"
                                                    }`}
                                                >
                                                    <div className={`w-1.5 h-1.5 rounded-full ${product.status === "On Sale" ? "bg-emerald-400" : "bg-red-400"}`} />
                                                    {product.status === "On Sale" ? "Satışta" : "Satıldı"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/wolf-admin-1392a14/products/${product.id}/edit`}
                                                    className="w-10 h-10 rounded-xl bg-blue-500/10 hover:bg-blue-500 flex items-center justify-center text-blue-500 hover:text-white transition-all"
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
                                    <td colSpan={6} className="p-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <DollarSign className="w-10 h-10 opacity-20" />
                                            <span className="font-bold">Henüz ürün veritabanında bulunmuyor.</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
