"use client";

import { useState } from "react";
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { syncProductPrices } from "@/app/actions/forex";

export default function ForexSyncButton() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: "success" | "error" } | null>(null);

    const handleSync = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const res = await syncProductPrices(undefined, true);
            if (res.success) {
                setMessage({ text: res.message, type: "success" });
            } else {
                setMessage({ text: res.message, type: "error" });
            }
        } catch (err: any) {
            setMessage({ text: "Bir hata oluştu.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <button
                onClick={handleSync}
                disabled={loading}
                className="w-full bg-brand-cyan/10 hover:bg-brand-cyan text-brand-cyan hover:text-white border border-brand-cyan/30 rounded-2xl py-4 flex items-center justify-center gap-3 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed group"
            >
                <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
                {loading ? "Senkronize Ediliyor..." : "Fiyatları Kurla Eşitle"}
            </button>

            {message && (
                <div className={`mt-4 p-4 text-sm font-bold flex items-start gap-3 rounded-xl border w-full ${message.type === "success" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                    {message.type === "success" ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                    <span>{message.text}</span>
                </div>
            )}
        </div>
    );
}
