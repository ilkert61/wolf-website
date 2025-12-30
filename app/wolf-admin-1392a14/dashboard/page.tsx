import prisma from "@/lib/prisma";
import Link from "next/link";
import { Clock, ArrowRight, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import DashboardWidgets from "@/components/admin/DashboardWidgets";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    // Initial counts
    const productCount = await prisma.product.count();
    // @ts-ignore
    const categoryCount = await prisma.category.count();

    let financeCount = 0;
    let pendingFinanceCount = 0;
    let secondHandCount = 0;
    let pendingSecondHandCount = 0;
    let recentProducts: any[] = [];

    try {
        // @ts-ignore
        financeCount = await prisma.financeApplication.count();
        // @ts-ignore
        pendingFinanceCount = await prisma.financeApplication.count({
            where: { status: "Beklemede" }
        });
        // @ts-ignore
        secondHandCount = await prisma.secondHandListing.count();
        // @ts-ignore
        pendingSecondHandCount = await prisma.secondHandListing.count({
            where: { status: "PENDING" }
        });
        // @ts-ignore
        recentProducts = await prisma.product.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { category: true }
        });
    } catch (error) {
        console.log("Some models not available:", error);
    }

    const stats = {
        productCount,
        categoryCount,
        financeCount,
        pendingFinanceCount,
        secondHandCount,
        pendingSecondHandCount
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
                    <p className="text-gray-400 mt-1">Wolf Bilişim sistemine hoş geldiniz.</p>
                </div>
                <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium text-gray-400">Son Güncelleme</div>
                    <div className="text-white font-mono">{new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
            </div>

            {/* Widgets */}
            <DashboardWidgets stats={stats} />

            {/* Quick Actions & Recent Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Actions */}
                <div className="bg-[#16181d] border border-white/5 rounded-2xl p-6 h-full">
                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                        Hızlı İşlemler
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            href="/wolf-admin-1392a14/products/new"
                            className="bg-white/5 hover:bg-white/10 p-4 rounded-xl transition-all group border border-white/5 hover:border-blue-500/30"
                        >
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <span className="text-xl text-blue-400 font-light">+</span>
                            </div>
                            <div className="font-semibold text-white">Yeni Ürün</div>
                            <div className="text-xs text-gray-500 mt-1">Envantere ürün ekle</div>
                        </Link>

                        <Link
                            href="/wolf-admin-1392a14/finance"
                            className="bg-white/5 hover:bg-white/10 p-4 rounded-xl transition-all group border border-white/5 hover:border-green-500/30"
                        >
                            <div className="relative w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <span className="text-xl text-green-400 font-light">$</span>
                                {pendingFinanceCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#16181d]" />
                                )}
                            </div>
                            <div className="font-semibold text-white">Finans</div>
                            <div className="text-xs text-gray-500 mt-1">Başvuruları yönet</div>
                        </Link>
                    </div>
                </div>

                {/* Recent Products */}
                <div className="bg-[#16181d] border border-white/5 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-purple-400" />
                        Son Eklenenler
                    </h2>
                    {recentProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500 border-2 border-dashed border-white/5 rounded-xl">
                            <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                            <p>Henüz ürün bulunmuyor</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentProducts.map((product: any) => (
                                <Link
                                    key={product.id}
                                    href={`/wolf-admin-1392a14/products/${product.id}/edit`}
                                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/10 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gray-600/20 flex items-center justify-center text-gray-400 text-xs font-bold">
                                            IMG
                                        </div>
                                        <div>
                                            <div className="font-medium text-white group-hover:text-cyber-cyan transition-colors">{product.title}</div>
                                            <div className="text-xs text-gray-500">{product.category?.name}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-white">₺{Number(product.price).toLocaleString()}</div>
                                            <div className={`text-xs ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {product.stock > 0 ? 'Stokta' : 'Tükendi'}
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
