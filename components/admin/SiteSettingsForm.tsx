"use client";

import { useState } from "react";
import { updateSiteSettings } from "@/app/actions/settings";
import { Loader2, Settings, AlertTriangle, Bell, Zap } from "lucide-react";

export default function SiteSettingsForm({ initialData }: { initialData: any }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: "success" | "error" } | null>(null);

    const [formData, setFormData] = useState({
        exchangeThreshold: Number(initialData?.exchangeThreshold || 10),
        maintenanceMode: initialData?.maintenanceMode || false,
        announcementActive: initialData?.announcementActive || false,
        announcementText: initialData?.announcementText || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await updateSiteSettings({
                ...formData
            });

            if (res.success) {
                setMessage({ text: res.message, type: "success" });
            } else {
                setMessage({ text: res.message, type: "error" });
            }
        } catch (error) {
            setMessage({ text: "Bir hata oluştu", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            {message && (
                <div className={`p-4 rounded-xl border font-bold flex items-center gap-3 ${message.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                    <div className={`w-2 h-2 rounded-full ${message.type === "success" ? "bg-emerald-400" : "bg-red-400"}`} />
                    {message.text}
                </div>
            )}

            <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 space-y-6">
                <h2 className="text-xl font-black text-white flex items-center gap-3 mb-6">
                    <Zap className="w-6 h-6 text-brand-cyan" />
                    Forex & Otomasyon Ayarları
                </h2>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Kur Değişim Eşiği (%)</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            required
                            value={formData.exchangeThreshold}
                            onChange={(e) => setFormData({ ...formData, exchangeThreshold: parseFloat(e.target.value) })}
                            className="w-32 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan font-black text-xl text-center"
                        />
                        <span className="text-slate-400 text-sm font-medium">
                            Anlık döviz kuru <span className="text-white font-bold">% {formData.exchangeThreshold}</span> oranında değiştiğinde tüm yabancı para endeksli ürünlerin TL fiyatları otomatik güncellenir.
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 space-y-6">
                <h2 className="text-xl font-black text-white flex items-center gap-3 mb-6">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                    Bakım & Güvenlik
                </h2>

                <div className="flex items-center justify-between p-5 bg-red-500/5 rounded-2xl border border-red-500/10">
                    <div>
                        <div className="text-white font-bold text-lg">Platform Bakım Modu</div>
                        <div className="text-sm font-medium text-slate-500 mt-1">Aktifleştirildiğinde, ziyaretçiler geçici bir bakım sayfası ile karşılaşır.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={formData.maintenanceMode} onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })} />
                        <div className="w-14 h-8 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-white after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-500"></div>
                    </label>
                </div>
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 space-y-6">
                <h2 className="text-xl font-black text-white flex items-center gap-3 mb-6">
                    <Bell className="w-6 h-6 text-brand-violet" />
                    Sistem Duyurusu
                </h2>

                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-white font-bold text-base">Global Banner Duyurusu</div>
                        <div className="text-sm font-medium text-slate-500 mt-1">Sitenin en üst kısmında yayınlanacak önemli bilgilendirme paneli.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={formData.announcementActive} onChange={(e) => setFormData({ ...formData, announcementActive: e.target.checked })} />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-violet"></div>
                    </label>
                </div>

                {formData.announcementActive && (
                    <div>
                        <textarea
                            rows={3}
                            value={formData.announcementText}
                            onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
                            className="w-full bg-black/40 border border-brand-violet/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-violet font-medium resize-none shadow-[0_0_15px_rgba(139,92,246,0.1)]"
                            placeholder="Kampanya mesajı, çalışma saati bilgisi vs."
                        ></textarea>
                    </div>
                )}
            </div>

            <div className="flex justify-end sticky bottom-8">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-4 bg-gradient-to-r from-brand-cyan to-brand-violet text-white rounded-2xl font-black text-lg transition-all hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center gap-3 group"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform" />}
                    Sistem Yapılandırmasını Kaydet
                </button>
            </div>
        </form>
    );
}
