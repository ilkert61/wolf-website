"use client";

import { useState } from "react";
import { Calculator, Send, CheckCircle2, Smartphone, Laptop, Tablet, Watch, Banknote, Shield, Clock, AlertCircle, RefreshCw, Lock, ArrowRight, Upload } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { submitFinanceRequest } from "@/app/actions/finance";

export default function ElectronicFinancePage() {
    const [activeTab, setActiveTab] = useState<"info" | "form">("info");
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        deviceType: "Telefon",
        brandModel: "",
        deviceCondition: "İkinci El",
        requestedAmount: "",
        message: ""
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [statusMessage, setStatusMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");

        const data = new FormData(e.currentTarget);

        const result = await submitFinanceRequest(data);

        if (result.success) {
            setStatus("success");
            setStatusMessage(result.message);
            setFormData({ fullName: "", phone: "", email: "", deviceType: "Telefon", brandModel: "", deviceCondition: "İkinci El", requestedAmount: "", message: "" });
            // Optional: convert form reset to use ref or reload if needed, but state reset covers controlled inputs.
            // File input is uncontrolled, so we should reset the form element itself:
            e.currentTarget.reset();
        } else {
            setStatus("error");
            setStatusMessage(result.message);
        }
    };

    return (
        <div className="min-h-screen text-white pb-20 bg-[#050505] relative">
            {/* Standalone Brand Header */}
            <div className="absolute top-0 left-0 w-full z-50 p-6 flex justify-center">
                <div className="flex items-center gap-3 glass px-6 py-2 rounded-full border border-cyber-violet/20">
                    <div className="relative w-8 h-8">
                        <Image src="/logo.png" alt="Wolf Logo" fill className="object-contain" />
                    </div>
                    <span className="font-bold text-lg tracking-wider">WOLF BİLİŞİM</span>
                </div>
            </div>

            {/* Custom Header for Finance Microsite */}
            <div className="relative h-[400px] w-full overflow-hidden flex items-center justify-center mb-12">
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-[#050505]/80 to-[#050505] z-10" />
                <Image
                    src="/finance-concept-premium.png"
                    alt="Elektronik Finans"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="relative z-20 text-center max-w-4xl px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight">
                            <span className="text-white">WOLF</span> <span className="text-cyber-violet">FİNANS</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto">
                            Elektronik cihazlarınız artık sizin için birer <span className="text-cyber-green font-semibold">nakit kaynağı</span>.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Tab Navigation */}
                <div className="flex justify-center mb-16">
                    <div className="glass p-1.5 rounded-2xl inline-flex gap-2">
                        <button
                            onClick={() => setActiveTab("info")}
                            className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === "info"
                                ? "bg-cyber-violet text-white shadow-glow-violet"
                                : "text-gray-400 hover:text-white"
                                }`}
                        >
                            <Shield className="w-5 h-5" />
                            Sistem Nasıl Çalışır?
                        </button>
                        <button
                            onClick={() => setActiveTab("form")}
                            className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === "form"
                                ? "bg-cyber-green text-black shadow-glow-green"
                                : "text-gray-400 hover:text-white"
                                }`}
                        >
                            <Calculator className="w-5 h-5" />
                            Fiyat Teklifi Al
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === "info" ? (
                        <motion.div
                            key="info"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-20"
                        >
                            {/* Infographic Description Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div className="space-y-8">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyber-violet/30">
                                        <Lock className="w-4 h-4 text-cyber-violet" />
                                        <span className="text-sm font-medium text-cyber-violet">WOLF FİNANS SİSTEMİ</span>
                                    </div>
                                    <h2 className="text-4xl font-bold">
                                        Satmak Zorunda Değilsiniz.<br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-violet to-cyber-cyan">
                                            Finansman Sağlayın, Geri Alın.
                                        </span>
                                    </h2>
                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-cyber-violet/10 flex items-center justify-center shrink-0">
                                                <Smartphone className="w-6 h-6 text-cyber-violet" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-2">1. Cihazınızı Getirin</h3>
                                                <p className="text-gray-400">Telefon, laptop veya tabletiniz uzman ekibimiz tarafından değerinde ekspertiz edilir.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-cyber-green/10 flex items-center justify-center shrink-0">
                                                <Banknote className="w-6 h-6 text-cyber-green" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-2">2. Nakit Ödeme Alın</h3>
                                                <p className="text-gray-400">Belirlenen finansman tutarı anında nakit veya havale olarak size ödenir. Cihazınız <span className="text-white font-semibold">Wolf Bilişim Kasası</span>'nda güvenle saklanır.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-cyber-cyan/10 flex items-center justify-center shrink-0">
                                                <RefreshCw className="w-6 h-6 text-cyber-cyan" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-2">3. Geri Teslim Alın</h3>
                                                <p className="text-gray-400">Anlaşılan süre sonunda ödemeyi yaparak cihazınızı aynı kondisyonda geri teslim alırsınız.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pricing Example */}
                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                            <Calculator className="w-5 h-5 text-cyber-green" />
                                            Örnek Geri Alım Hesaplaması
                                        </h3>
                                        <div className="flex flex-col sm:flex-row gap-6 items-center">
                                            <div className="flex-1 text-center sm:text-left">
                                                <p className="text-gray-400 text-sm mb-1">Cihaz Değeri (Nakit Ödeme)</p>
                                                <p className="text-2xl font-bold text-white">10.000 ₺</p>
                                            </div>
                                            <div className="hidden sm:block text-gray-500">
                                                <ArrowRight className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1 text-center sm:text-left">
                                                <p className="text-gray-400 text-sm mb-1">Geri Alış Bedeli (%15-20 Farkla)</p>
                                                <p className="text-2xl font-bold text-cyber-green">11.500 ₺ - 12.000 ₺</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                                            * Fiyatlar cihazın kondisyonuna, piyasa koşullarına ve vade süresine göre değişiklik gösterebilir.
                                        </p>
                                    </div>
                                </div>
                                <div className="relative h-[600px] w-full rounded-3xl overflow-hidden glass border border-white/10 group">
                                    <Image
                                        src="/finance-concept-premium.png"
                                        alt="Elektronik Finans Sistemi"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    {/* Overlay Text Details (HTML on top of Image) */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />

                                    <div className="absolute bottom-8 left-8 right-8">
                                        <div className="glass p-6 rounded-2xl border-l-4 border-cyber-green">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="relative w-8 h-8">
                                                    <Image src="/logo.png" alt="Wolf Logo" fill className="object-contain" />
                                                </div>
                                                <span className="font-black text-lg tracking-wider">WOLF BİLİŞİM</span>
                                            </div>
                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                Cihazlarınız özel güvenlikli kasalarımızda, 7/24 kamera sistemi ile izlenen ortamda, sigortalı olarak saklanmaktadır. Veri gizliliğiniz %100 güvence altındadır.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="max-w-3xl mx-auto glass-card p-8 md:p-12 rounded-[2rem] border border-cyber-green/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-green/10 rounded-full blur-[100px] pointer-events-none" />

                                <h2 className="text-3xl font-bold mb-2 text-center">Hızlı Fiyat Teklifi</h2>
                                <p className="text-gray-400 text-center mb-10">Formu doldurun, cihazınız için en iyi teklifi sunalım.</p>

                                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                    {/* Personal Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Ad Soyad</label>
                                            <input
                                                name="fullName"
                                                required
                                                type="text"
                                                value={formData.fullName}
                                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                                className="w-full glass rounded-xl px-4 py-3.5 focus:outline-none focus:border-cyber-green transition-colors bg-black/40"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Telefon</label>
                                            <input
                                                name="phone"
                                                required
                                                type="tel"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full glass rounded-xl px-4 py-3.5 focus:outline-none focus:border-cyber-green transition-colors bg-black/40"
                                            />
                                        </div>
                                    </div>

                                    {/* Device Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Cihaz Türü</label>
                                            <select
                                                name="deviceType"
                                                value={formData.deviceType}
                                                onChange={e => setFormData({ ...formData, deviceType: e.target.value })}
                                                className="w-full glass rounded-xl px-4 py-3.5 focus:outline-none focus:border-cyber-green transition-colors bg-black/40 text-gray-300"
                                            >
                                                <option value="Telefon">Telefon</option>
                                                <option value="Laptop">Laptop</option>
                                                <option value="Tablet">Tablet</option>
                                                <option value="Konsol">Oyun Konsolu</option>
                                                <option value="Diğer">Diğer</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Marka / Model</label>
                                            <input
                                                name="brandModel"
                                                required
                                                type="text"
                                                value={formData.brandModel}
                                                onChange={e => setFormData({ ...formData, brandModel: e.target.value })}
                                                className="w-full glass rounded-xl px-4 py-3.5 focus:outline-none focus:border-cyber-green transition-colors bg-black/40"
                                                placeholder="Örn: iPhone 14 Pro Max"
                                            />
                                        </div>
                                    </div>

                                    {/* Additional Info */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Talep Ettiğiniz Tutar (TL)</label>
                                        <input
                                            name="requestedAmount"
                                            type="number"
                                            value={formData.requestedAmount}
                                            onChange={e => setFormData({ ...formData, requestedAmount: e.target.value })}
                                            className="w-full glass rounded-xl px-4 py-3.5 focus:outline-none focus:border-cyber-green transition-colors bg-black/40"
                                            placeholder="Örn: 25000"
                                        />
                                    </div>

                                    {/* Photo Upload */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 flex items-center justify-between">
                                            <span>Fotoğraflar</span>
                                            <span className="text-[10px] bg-cyber-green/20 text-cyber-green px-2 py-0.5 rounded">OPSİYONEL</span>
                                        </label>
                                        <label className="relative flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-cyber-green/50 hover:bg-cyber-green/5 transition-all group/upload">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-6 h-6 text-gray-400 mb-2 group-hover/upload:text-cyber-green transition-colors" />
                                                <p className="text-xs text-gray-500 group-hover/upload:text-gray-300">Cihaz fotoğraflarını eklemek için tıklayın</p>
                                            </div>
                                            <input name="photos" type="file" multiple accept="image/*" className="hidden" />
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === "loading" || status === "success"}
                                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02]
                                            ${status === "success"
                                                ? "bg-green-600 text-white"
                                                : "bg-cyber-violet text-white hover:bg-violet-600 shadow-lg shadow-cyber-violet/20"
                                            }`}
                                    >
                                        {status === "loading" ? (
                                            <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        ) : status === "success" ? (
                                            <>
                                                <CheckCircle2 className="w-6 h-6" />
                                                Başvuru Alındı
                                            </>
                                        ) : (
                                            <>
                                                Teklifi Gönder
                                                <Send className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>

                                    {statusMessage && (
                                        <p className={`text-center text-sm mt-4 ${status === "success" ? "text-green-400" : "text-red-400"}`}>
                                            {statusMessage}
                                        </p>
                                    )}
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
