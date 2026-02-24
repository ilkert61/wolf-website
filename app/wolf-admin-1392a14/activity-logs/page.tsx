import prisma from "@/lib/prisma";
import { ShieldAlert, Terminal } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ActivityLogsPage() {
    const logs = await prisma.activityLog.findMany({
        include: { admin: true },
        orderBy: { createdAt: "desc" },
        take: 500
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
                        <ShieldAlert className="w-8 h-8 text-brand-violet" />
                        Güvenlik Denetimleri
                    </h1>
                    <p className="text-slate-400 font-medium">Panel içindeki tüm hareketleriniz ve veritabanı olayları 60 gün saklanır.</p>
                </div>
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6">
                <div className="space-y-4">
                    {logs.length > 0 ? (
                        logs.map((log: any) => (
                            <div key={log.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-start sm:items-center flex-col sm:flex-row gap-4 hover:border-brand-violet/30 hover:bg-white/[0.04] transition-all">

                                <div className="w-12 h-12 rounded-xl bg-[#020202] border border-white/10 flex items-center justify-center shrink-0">
                                    <Terminal className="w-5 h-5 text-slate-500" />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-sm font-black text-white">{log.action}</span>
                                        <span className="px-2 py-0.5 bg-brand-violet/10 text-brand-violet text-[10px] font-bold uppercase tracking-widest rounded-md">
                                            {log.admin ? log.admin.username : "SİSTEM"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-400 font-mono break-all">{log.details || "Detay yok"}</p>
                                </div>

                                <div className="text-right sm:w-32 shrink-0">
                                    <div className="text-sm font-bold text-slate-300">{new Date(log.createdAt).toLocaleDateString('tr-TR')}</div>
                                    <div className="text-xs text-slate-500 font-mono">{new Date(log.createdAt).toLocaleTimeString('tr-TR')}</div>
                                </div>

                            </div>
                        ))
                    ) : (
                        <div className="p-10 text-center text-slate-500 font-bold">Aktivite bulunamadı.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
