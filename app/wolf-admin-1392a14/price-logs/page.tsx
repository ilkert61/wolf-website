import prisma from "@/lib/prisma";
import { History, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PriceLogsPage() {
    const logs = await prisma.priceLog.findMany({
        include: {
            product: true,
            admin: true
        },
        orderBy: { createdAt: "desc" },
        take: 100 // Last 100 logs
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
                        <History className="w-8 h-8 text-brand-cyan" />
                        Fiyat Geçmişi & Loglar
                    </h1>
                    <p className="text-slate-400 font-medium">Sistemdeki kur dalgalanmaları ve yönetici müdahalelerinden kaynaklanan tüm fiyat değişimleri (Son 100).</p>
                </div>
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#020202] text-slate-400 text-xs uppercase tracking-widest font-bold font-sans">
                            <tr>
                                <th className="p-6 border-b border-white/5">Tarih</th>
                                <th className="p-6 border-b border-white/5">Ürün</th>
                                <th className="p-6 border-b border-white/5 text-center">Değişim</th>
                                <th className="p-6 border-b border-white/5">Sebeb / Açıklama</th>
                                <th className="p-6 border-b border-white/5 text-right">Yetkili</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {logs.length > 0 ? (
                                logs.map((log: any) => {
                                    const isIncrease = Number(log.newPrice) > Number(log.oldPrice);

                                    return (
                                        <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="p-6">
                                                <div className="text-sm font-bold text-white">
                                                    {new Date(log.createdAt).toLocaleDateString('tr-TR')}
                                                </div>
                                                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                                    {new Date(log.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="font-bold text-slate-200">{log.product?.title || "Silinmiş Ürün"}</div>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">ID: {log.productId}</div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center justify-center gap-4">
                                                    <span className="text-sm font-bold text-slate-400 line-through">₺{Number(log.oldPrice).toLocaleString()}</span>
                                                    <ArrowRight className="w-4 h-4 text-slate-600" />
                                                    <span className={`text-base font-black flex items-center gap-1.5 px-3 py-1 rounded-lg ${isIncrease ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                                        {isIncrease ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                                        ₺{Number(log.newPrice).toLocaleString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="text-sm text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5 leading-relaxed font-medium">
                                                    {log.reason}
                                                </div>
                                            </td>
                                            <td className="p-6 text-right">
                                                {log.admin ? (
                                                    <div className="inline-flex flex-col items-end">
                                                        <span className="text-sm font-bold text-brand-violet">{log.admin.username}</span>
                                                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Manuel İşlem</span>
                                                    </div>
                                                ) : (
                                                    <div className="inline-flex flex-col items-end">
                                                        <span className="text-sm font-bold text-brand-cyan">SİSTEM OTO</span>
                                                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Forex Bot</span>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <History className="w-10 h-10 opacity-20" />
                                            <span className="font-bold">Henüz kaydedilmiş bir fiyat değişimi yok.</span>
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
