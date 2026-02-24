import prisma from "@/lib/prisma";
import Link from "next/link";
import { Clock, ArrowRight, TrendingUp, AlertCircle, RefreshCw, BarChart2 } from "lucide-react";
import DashboardWidgets from "@/components/admin/DashboardWidgets";
import ForexSyncButton from "@/components/admin/ForexSyncButton";
import { getLiveRates } from "@/app/actions/forex";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    // Initial counts
    const productCount = await prisma.product.count();
    const categoryCount = await prisma.category.count();

    // Rates
    const rates = await getLiveRates();

    let financeCount = 0;
    let pendingFinanceCount = 0;
    let secondHandCount = 0;
    let pendingSecondHandCount = 0;
    let recentProducts: any[] = [];

    try {
        financeCount = await prisma.financeRequest.count();
        pendingFinanceCount = await prisma.financeRequest.count({
            where: { status: "Beklemede" }
        });
        secondHandCount = await prisma.secondHandListing.count();
        pendingSecondHandCount = await prisma.secondHandListing.count({
            where: { status: "PENDING" }
        });
        recentProducts = await prisma.product.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { category: true }
        });
    } catch (error) {
        console.log("Bazı modeller yüklenemedi:", error);
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
        <div className="space-y-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">Merkezi Denetim</h1>
                    <p className="text-slate-400 font-medium">Bütün operasyonların tek ekran yönetimi.</p>
                </div>
                <div className="text-right hidden sm:block px-6 py-3 bg-[#0a0a0a] rounded-2xl border border-white/5">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Giriş Saati</div>
                    <div className="text-white font-mono font-bold text-lg">{new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
            </div>

            {/* Widgets Section */}
            <DashboardWidgets stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Forex Rates & Automation Card */}
                <div className="lg:col-span-1 bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 h-full relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/20 blur-[50px] -z-10 group-hover:bg-brand-cyan/30 transition-colors" />

                    <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                            <BarChart2 className="w-5 h-5 text-brand-cyan" />
                        </div>
                        Canlı Kurlar
                    </h2>

                    <div className="space-y-4 mb-8">
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                            <span className="font-bold text-slate-400">USD / TRY</span>
                            <span className="text-2xl font-black text-white">{rates?.USD ? rates.USD.toFixed(2) : "0.00"} ₺</span>
                        </div>
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                            <span className="font-bold text-slate-400">EUR / TRY</span>
                            <span className="text-2xl font-black text-white">{rates?.EUR ? rates.EUR.toFixed(2) : "0.00"} ₺</span>
                        </div>
                    </div>

                    <p className="text-sm text-slate-500 font-medium mb-6">
                        Kur değişimi sitenizdeki dolar/euro indeksli ürünlerin fiyatlarını EŞİK sınırı geçildiğinde günceller.
                    </p>

                    <ForexSyncButton />
                </div>

                {/* Quick Actions & Recent */}
                <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Actions */}
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 h-full relative overflow-hidden">
                        <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                            </div>
                            Hızlı İşlemler
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            <Link
                                href="/wolf-admin-1392a14/products/new"
                                className="bg-white/5 hover:bg-blue-500/10 p-5 rounded-2xl transition-all group border border-white/5 hover:border-blue-500/30 flex items-center gap-5"
                            >
                                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all text-blue-500">
                                    <span className="text-2xl font-light leading-none">+</span>
                                </div>
                                <div>
                                    <div className="font-black text-white text-lg">Yeni Ürün Ekle</div>
                                    <div className="text-sm font-medium text-slate-500 mt-1">Döviz bazlı fiyat girin</div>
                                </div>
                            </Link>

                            <Link
                                href="/wolf-admin-1392a14/finance"
                                className="bg-white/5 hover:bg-emerald-500/10 p-5 rounded-2xl transition-all group border border-white/5 hover:border-emerald-500/30 flex items-center gap-5"
                            >
                                <div className="relative w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all text-emerald-500">
                                    <span className="text-xl font-black leading-none">₺</span>
                                    {pendingFinanceCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#0a0a0a] animate-bounce" />
                                    )}
                                </div>
                                <div>
                                    <div className="font-black text-white text-lg">Finans İşlemleri</div>
                                    <div className="text-sm font-medium text-slate-500 mt-1">Bireysel ve Kurumsal Talepler</div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Recent Products */}
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8">
                        <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-brand-violet" />
                            </div>
                            Son Envanterler
                        </h2>
                        {recentProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-500 border-2 border-dashed border-white/5 rounded-2xl bg-white/5">
                                <AlertCircle className="w-10 h-10 mb-3 opacity-50 text-slate-400" />
                                <p className="font-bold">Henüz ürün bulunmuyor</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {recentProducts.map((product: any) => (
                                    <Link
                                        key={product.id}
                                        href={`/wolf-admin-1392a14/products/${product.id}/edit`}
                                        className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-transparent hover:border-white/10 hover:bg-white/10 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-slate-500 text-[10px] font-black tracking-widest border border-white/5 overflow-hidden">
                                                {product.images?.[0] ? <img src={product.images[0].url} className="w-full h-full object-cover" /> : "IMG"}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-200 group-hover:text-white transition-colors">{product.title}</div>
                                                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{product.category?.name || "Kategorisiz"}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="text-sm font-black text-white">₺{Number(product.price).toLocaleString()}</div>
                                                <div className={`text-[10px] uppercase tracking-widest font-bold mt-0.5 ${product.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                    {product.stock > 0 ? 'Stokta' : 'Tükendi'}
                                                </div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-brand-cyan transition-colors" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
