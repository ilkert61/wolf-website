"use client";

import { useState } from "react";
import { Calculator, Send, CheckCircle2, Smartphone, Banknote, Shield, RefreshCw, Lock, ArrowRight, Upload } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { submitFinanceRequest } from "@/app/actions/finance";
import Link from "next/link";

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
            e.currentTarget.reset();
        } else {
            setStatus("error");
            setStatusMessage(result.message);
        }
    };

    const getPlaceholder = (type: string) => {
        switch (type) {
            case "Telefon": return "Örn: iPhone 14 Pro Max, Galaxy S23 Ultra";
            case "Laptop": return "Örn: MacBook Pro M2, Asus ROG Strix";
            case "Tablet": return "Örn: iPad Pro 11, Tab S9";
            case "Konsol": return "Örn: PlayStation 5, Xbox Series X";
            default: return "Örn: Marka ve Model detayları";
        }
    };

    const getExtraDescription = (type: string) => {
        switch (type) {
            case "Telefon": return "Lütfen cihazın hafıza (GB) ve pil sağlığı (%) durumunu mesaj kısmında belirtin.";
            case "Laptop": return "Lütfen işlemci, RAM ve ekran kartı modelini mesaj kısmında detaylandırın.";
            case "Tablet": return "Lütfen cihazın neslini, kapasitesini ve varsa kalem/klavye gibi aksesuarlarını belirtin.";
            case "Konsol": return "Lütfen kolların (kontrolcü) sayısını ve varsa beraberinde verilecek oyunları belirtin.";
            default: return "Cihazınız hakkında değerini etkileyecek ekstra bilgileri mesaj kısmına ekleyebilirsiniz.";
        }
    };

    return (
        <div className="min-h-screen pb-20 bg-slate-50 dark:bg-[#020202] relative">
            {/* Standalone Brand Header */}
            <div className="absolute top-0 left-0 w-full z-50 p-6 flex justify-center">
                <Link href="/" className="flex items-center gap-3 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-3xl px-6 py-2 rounded-full shadow-sm dark:shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-slate-200 dark:border-white/10 transition-transform hover:scale-105">
                    <div className="relative w-8 h-8">
                        <Image src="/logo.png" alt="Wolf Logo" fill className="object-contain" />
                    </div>
                    <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-widest">WOLF BİLİŞİM</span>
                </Link>
            </div>

            {/* Premium Corporate Header */}
            <div className="relative h-[450px] w-full overflow-hidden flex items-center justify-center mb-16 bg-[#020202]">
                <div className="absolute inset-0 bg-mesh-dark opacity-60 mix-blend-screen pointer-events-none z-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#020202] dark:to-[#020202] z-20" />
                <Image
                    src="/finance-concept-premium.png"
                    alt="Elektronik Finans"
                    fill
                    className="object-cover opacity-30 mix-blend-luminosity"
                    priority
                />
                <div className="relative z-30 text-center max-w-4xl px-4 mt-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan mb-6 shadow-sm">
                            <Shield className="w-4 h-4" />
                            <span className="text-xs font-bold tracking-widest uppercase">Güvenilir Finansman</span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight text-white">
                            Kurumsal <span className="gradient-text">Finans</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                            Elektronik cihazlarınızı satmadan, değerinde <span className="text-white font-bold">nakit desteği</span> alın.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Tab Navigation */}
                <div className="flex justify-center mb-16">
                    <div className="premium-card p-1.5 rounded-2xl md:rounded-full inline-flex flex-col md:flex-row gap-2">
                        <button
                            onClick={() => setActiveTab("info")}
                            className={`px-8 py-3.5 rounded-xl md:rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === "info"
                                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                                }`}
                        >
                            <Shield className="w-5 h-5" />
                            Sistem Nasıl Çalışır?
                        </button>
                        <button
                            onClick={() => setActiveTab("form")}
                            className={`px-8 py-3.5 rounded-xl md:rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === "form"
                                ? "bg-brand-cyan text-white shadow-md shadow-brand-cyan/20"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
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
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                                <div className="space-y-10">
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-6">
                                            <Lock className="w-4 h-4 text-brand-cyan" />
                                            <span className="text-xs font-extrabold tracking-widest text-slate-700 dark:text-slate-300">WOLF FİNANS SİSTEMİ</span>
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                                            Satmak Zorunda Değilsiniz.<br />
                                            <span className="gradient-text">
                                                Finansman Sağlayın, Geri Alın.
                                            </span>
                                        </h2>
                                    </div>
                                    <div className="space-y-8">
                                        <div className="flex gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-brand-cyan/10 flex items-center justify-center shrink-0 border border-brand-cyan/20">
                                                <Smartphone className="w-7 h-7 text-brand-cyan" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">1. Cihazınızı Getirin</h3>
                                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Telefon, laptop veya tabletiniz uzman ekibimiz tarafından kurumsal standartlarda, değerinde ekspertiz edilir.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-brand-cyan/10 flex items-center justify-center shrink-0 border border-brand-cyan/20">
                                                <Banknote className="w-7 h-7 text-brand-cyan" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">2. Nakit Ödeme Alın</h3>
                                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Belirlenen finansman tutarı anında nakit veya havale olarak ödenir. Cihazınız <span className="text-slate-900 dark:text-white font-bold">Wolf Bilişim Kasası</span>'nda güvenle saklanır.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-brand-cyan/10 flex items-center justify-center shrink-0 border border-brand-cyan/20">
                                                <RefreshCw className="w-7 h-7 text-brand-cyan" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">3. Geri Teslim Alın</h3>
                                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Anlaşılan süre sonunda ödemeyi yaparak cihazınızı bıraktığınız aynı kondisyonda geri teslim alırsınız.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pricing Example */}
                                    <div className="premium-card p-10 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-mesh-light dark:bg-mesh-dark opacity-10 pointer-events-none mix-blend-overlay" />
                                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-8 flex items-center gap-3 relative z-10">
                                            <Calculator className="w-6 h-6 text-brand-cyan" />
                                            Örnek Geri Alım Hesaplaması
                                        </h3>
                                        <div className="flex flex-col sm:flex-row gap-6 items-center relative z-10">
                                            <div className="flex-1 text-center sm:text-left bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 p-6 rounded-2xl w-full shadow-sm">
                                                <p className="text-slate-500 text-xs mb-2 font-bold uppercase tracking-widest">Cihaz Değeri</p>
                                                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">10.000 ₺</p>
                                            </div>
                                            <div className="hidden sm:block text-slate-200 dark:text-slate-800">
                                                <ArrowRight className="w-8 h-8" />
                                            </div>
                                            <div className="flex-1 text-center sm:text-left bg-brand-cyan/5 border border-brand-cyan/20 p-6 rounded-2xl w-full shadow-sm">
                                                <p className="text-brand-cyan text-xs mb-2 font-bold uppercase tracking-widest">Geri Alış Bedeli</p>
                                                <p className="text-2xl md:text-3xl font-black text-brand-cyan tracking-tight">11.500 ₺</p>
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-6 leading-relaxed font-semibold uppercase relative z-10">
                                            * Fiyatlar cihazın kondisyonuna, piyasa koşullarına ve vade süresine göre (ort. %15-20 farkla) değişiklik gösterebilir.
                                        </p>
                                    </div>
                                </div>
                                <div className="relative h-[650px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 group">
                                    <Image
                                        src="/finance-concept-premium.png"
                                        alt="Elektronik Finans Sistemi"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/20 to-transparent" />

                                    <div className="absolute bottom-8 left-8 right-8">
                                        <div className="bg-white/10 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/20 shadow-2xl">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Shield className="w-7 h-7 text-brand-cyan" />
                                                <span className="font-extrabold text-xl text-white tracking-widest">%100 GÜVENLİK</span>
                                            </div>
                                            <p className="text-slate-200 text-sm leading-relaxed font-medium">
                                                Cihazlarınız özel güvenlikli kasalarımızda, 7/24 kamera sistemi ile izlenen ortamda, sigortalı olarak saklanmaktadır. Veri gizliliğiniz tamamen güvence altındadır.
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
                            <div className="max-w-4xl mx-auto premium-card p-8 md:p-14 relative overflow-hidden">
                                <div className="absolute inset-0 bg-mesh-light dark:bg-mesh-dark opacity-10 mix-blend-overlay pointer-events-none" />
                                <h2 className="text-3xl md:text-4xl font-black mb-3 text-center text-slate-900 dark:text-white tracking-tight relative z-10">Hızlı Fiyat Teklifi</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-center mb-12 text-lg font-medium relative z-10">Formu doldurun, cihazınız için en iyi teklifi sunalım.</p>

                                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                    {/* Personal Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2.5">
                                            <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Ad Soyad</label>
                                            <input
                                                name="fullName"
                                                required
                                                type="text"
                                                value={formData.fullName}
                                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all font-medium"
                                                placeholder="Adınız Soyadınız"
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Telefon</label>
                                            <input
                                                name="phone"
                                                required
                                                type="tel"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all font-medium"
                                                placeholder="05XX XXX XX XX"
                                            />
                                        </div>
                                    </div>

                                    {/* Device Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2.5">
                                            <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Cihaz Türü</label>
                                            <div className="relative">
                                                <select
                                                    name="deviceType"
                                                    value={formData.deviceType}
                                                    onChange={e => setFormData({ ...formData, deviceType: e.target.value })}
                                                    className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all appearance-none cursor-pointer font-bold"
                                                >
                                                    <option value="Telefon">Telefon</option>
                                                    <option value="Laptop">Laptop</option>
                                                    <option value="Tablet">Tablet</option>
                                                    <option value="Konsol">Oyun Konsolu</option>
                                                    <option value="Diğer">Diğer</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Marka / Model</label>
                                            <input
                                                name="brandModel"
                                                required
                                                type="text"
                                                value={formData.brandModel}
                                                onChange={e => setFormData({ ...formData, brandModel: e.target.value })}
                                                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all font-medium"
                                                placeholder={getPlaceholder(formData.deviceType)}
                                            />
                                        </div>
                                    </div>

                                    {/* Extracted Descriptions */}
                                    <div className="bg-brand-cyan/5 p-5 rounded-2xl border border-brand-cyan/20 flex gap-4">
                                        <Shield className="w-6 h-6 text-brand-cyan shrink-0 top-0" />
                                        <div>
                                            <h4 className="text-sm font-extrabold text-brand-cyan mb-1">Önemli Bilgi</h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                                                {getExtraDescription(formData.deviceType)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Additional Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2.5">
                                            <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Kondisyon</label>
                                            <div className="relative">
                                                <select
                                                    name="deviceCondition"
                                                    value={formData.deviceCondition}
                                                    onChange={e => setFormData({ ...formData, deviceCondition: e.target.value })}
                                                    className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all appearance-none cursor-pointer font-bold"
                                                >
                                                    <option value="Sıfır Kapalı Kutu">Sıfır (Kapalı Kutu)</option>
                                                    <option value="İkinci El">İkinci El (Kullanılmış)</option>
                                                    <option value="Kusurlu">Kusurlu / Kırık</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Talep Ettiğiniz Tutar (TL)</label>
                                            <input
                                                name="requestedAmount"
                                                type="number"
                                                value={formData.requestedAmount}
                                                onChange={e => setFormData({ ...formData, requestedAmount: e.target.value })}
                                                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all font-medium"
                                                placeholder="Örn: 25000"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2.5">
                                        <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Mesaj / Ek Açıklama</label>
                                        <textarea
                                            name="message"
                                            rows={3}
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all resize-none font-medium"
                                            placeholder="Detaylı özellikler, depolama formatı veya diğer notlarınızı belirtebilirsiniz."
                                        />
                                    </div>

                                    {/* Photo Upload */}
                                    <div className="space-y-2.5">
                                        <label className="flex items-center justify-between">
                                            <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Fotoğraflar</span>
                                            <span className="text-[10px] font-bold bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded uppercase tracking-wider">Opsiyonel</span>
                                        </label>
                                        <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl cursor-pointer hover:border-brand-cyan dark:hover:border-brand-cyan hover:bg-brand-cyan/5 dark:hover:bg-brand-cyan/10 transition-all group/upload bg-slate-50 dark:bg-black/20">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <div className="w-12 h-12 bg-white dark:bg-[#0a0a0a] rounded-full shadow-sm border border-slate-100 dark:border-white/5 flex items-center justify-center mb-3 group-hover/upload:scale-110 group-hover/upload:shadow-brand-cyan/20 transition-all">
                                                    <Upload className="w-5 h-5 text-brand-cyan" />
                                                </div>
                                                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Cihaz fotoğraflarını eklemek için tıklayın</p>
                                            </div>
                                            <input name="photos" type="file" multiple accept="image/*" className="hidden" />
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === "loading" || status === "success"}
                                        className={`w-full py-5 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-3
                                            ${status === "success"
                                                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                                                : "bg-slate-900 dark:bg-brand-cyan text-white shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-slate-800 dark:hover:bg-brand-cyan-dark"
                                            }`}
                                    >
                                        {status === "loading" ? (
                                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : status === "success" ? (
                                            <>
                                                <CheckCircle2 className="w-6 h-6" />
                                                Başvuru Alındı
                                            </>
                                        ) : (
                                            <>
                                                Teklifi Gönder
                                                <Send className="w-6 h-6" />
                                            </>
                                        )}
                                    </button>

                                    {statusMessage && (
                                        <p className={`text-center font-bold text-sm mt-4 p-4 rounded-xl ${status === "success" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20" : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20"}`}>
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
