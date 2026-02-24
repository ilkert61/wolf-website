"use client";

import { useState } from "react";
import { Wrench, PlayCircle, Upload, CheckCircle2, Check, Smartphone, Laptop, Tablet, Gamepad2, HelpCircle, Building2, ArrowRight } from "lucide-react";
import { submitRepairRequest } from "@/app/actions/repair";
import { motion } from "framer-motion";
import Image from "next/image";

export default function RepairPage() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [statusMessage, setStatusMessage] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [filePreviews, setFilePreviews] = useState<string[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);

            if (files.length > 3) {
                alert("En fazla 3 adet fotoğraf yükleyebilirsiniz.");
                e.target.value = ""; // Reset input
                return;
            }

            // Cleanup old previews
            filePreviews.forEach(url => URL.revokeObjectURL(url));

            setSelectedFiles(files);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setFilePreviews(newPreviews);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");
        const form = e.currentTarget;
        const formData = new FormData(form);

        const result = await submitRepairRequest(formData);

        if (result.success) {
            setStatus("success");
            setStatusMessage(result.message);
            form.reset();
            setSelectedFiles([]);
            setFilePreviews([]);
        } else {
            setStatus("error");
            setStatusMessage(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020202] text-slate-900 dark:text-slate-200">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-mesh-light dark:bg-mesh-dark opacity-40 pointer-events-none mix-blend-screen" />

            <div className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

                    {/* Left Column: Visuals & Info */}
                    <div className="relative z-10 lg:sticky lg:top-36 space-y-12">
                        <div className="relative">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-cyan/20 bg-brand-cyan/10 text-brand-cyan-dark dark:text-brand-cyan text-xs font-extrabold tracking-widest mb-8 shadow-sm"
                            >
                                <Wrench className="w-4 h-4" /> PROFESYONEL TEKNİK SERVİS
                            </motion.div>

                            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-8 text-slate-900 dark:text-white">
                                Cihazınız <br />
                                <span className="gradient-text">Yeniden Hayat Bulsun.</span>
                            </h1>

                            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed font-medium">
                                Telefon, bilgisayar veya oyun konsolu... Arızalı cihazlarınızı uzman ekibimizle en kısa sürede, garantili olarak onarıyoruz.
                            </p>
                        </div>

                        {/* Feature Grid */}
                        <div className="grid grid-cols-2 gap-5">
                            {[
                                { icon: Smartphone, label: "Telefon Tamiri" },
                                { icon: Laptop, label: "Laptop & PC" },
                                { icon: Tablet, label: "Tablet Servisi" },
                                { icon: Gamepad2, label: "Konsol Tamiri" }
                            ].map((item, i) => (
                                <div key={i} className="premium-card p-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-center mb-4 group-hover:bg-brand-cyan/10 dark:group-hover:bg-brand-cyan/20 group-hover:border-brand-cyan/30 transition-all shadow-sm group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                                        <item.icon className="w-7 h-7 text-slate-400 group-hover:text-brand-cyan transition-colors" />
                                    </div>
                                    <h3 className="font-extrabold text-slate-900 dark:text-white">{item.label}</h3>
                                </div>
                            ))}
                        </div>

                        {/* Corporate Solutions Info */}
                        <div className="mt-8 p-10 rounded-[2rem] bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-3 relative z-10">
                                <Building2 className="w-8 h-8 text-brand-cyan" />
                                Kurumsal Çözümler
                            </h3>
                            <p className="text-slate-300 text-base mb-8 leading-relaxed font-medium relative z-10">
                                Şirketiniz için toplu cihaz bakımı ve teknik servis anlaşmaları mı arıyorsunuz?
                                Kurumsal müşterilerimize özel avantajlı tekliflerimiz için iletişime geçin.
                            </p>
                            <a href="/contact" className="inline-flex items-center gap-2 text-sm font-bold text-white bg-white/10 hover:bg-brand-cyan border border-white/20 hover:border-brand-cyan transition-all px-8 py-4 rounded-xl w-fit relative z-10">
                                İletişime Geç <ArrowRight className="w-4 h-4 ml-1" />
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative z-10"
                    >
                        <div className="premium-card p-8 md:p-12 relative overflow-hidden group/form">
                            <div className="absolute inset-0 bg-mesh-light dark:bg-mesh-dark opacity-10 pointer-events-none mix-blend-overlay" />

                            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-10 flex items-center gap-4 tracking-tight relative z-10">
                                <span className="w-14 h-14 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center shrink-0 shadow-inner">
                                    <Wrench className="w-7 h-7 text-brand-cyan" />
                                </span>
                                Servis Talebi Oluştur
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                {/* Personal Info Group */}
                                <div className="space-y-4">
                                    <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">İletişim Bilgileri</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <input name="fullName" required placeholder="Adınız Soyadınız" className="w-full bg-slate-50 dark:bg-black/40 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all font-medium" />
                                        <input name="phone" required placeholder="05XX XXX XX XX" type="tel" className="w-full bg-slate-50 dark:bg-black/40 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all font-medium" />
                                    </div>
                                    <input name="email" placeholder="E-posta Adresi (Opsiyonel)" type="email" className="w-full bg-slate-50 dark:bg-black/40 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all font-medium" />
                                </div>

                                {/* Device Info Group */}
                                <div className="space-y-4">
                                    <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">Cihaz Bilgileri</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="relative">
                                            <select name="deviceType" className="w-full bg-slate-50 dark:bg-black/40 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all appearance-none cursor-pointer font-bold">
                                                <option value="Telefon">Telefon</option>
                                                <option value="Laptop">Laptop / PC</option>
                                                <option value="Tablet">Tablet</option>
                                                <option value="Konsol">Oyun Konsolu</option>
                                                <option value="Diger">Diğer</option>
                                            </select>
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <HelpCircle className="w-5 h-5" />
                                            </div>
                                        </div>
                                        <input name="brandModel" required placeholder="Marka & Model" className="w-full bg-slate-50 dark:bg-black/40 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all font-medium" />
                                    </div>
                                    <textarea
                                        name="problemDescription"
                                        required
                                        rows={4}
                                        placeholder="Sorunu kısaca açıklayınız..."
                                        className="w-full bg-slate-50 dark:bg-black/40 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all resize-none font-medium"
                                    />
                                </div>

                                {/* Media Upload Group */}
                                <div className="space-y-4">
                                    <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1 flex items-center justify-between">
                                        <span>Fotoğraf / Video</span>
                                        <span className="text-[10px] bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded tracking-wider">ÖNERİLİR</span>
                                    </label>

                                    <div className="grid grid-cols-1 gap-5">
                                        <label className="relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl cursor-pointer hover:border-brand-cyan dark:hover:border-brand-cyan hover:bg-brand-cyan/5 dark:hover:bg-brand-cyan/10 transition-all group/upload overflow-hidden bg-slate-50 dark:bg-black/20">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                                                <div className="w-14 h-14 bg-white dark:bg-[#0a0a0a] rounded-full shadow-sm border border-slate-100 dark:border-white/5 flex items-center justify-center mb-4 group-hover/upload:scale-110 group-hover/upload:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all">
                                                    <Upload className="w-6 h-6 text-brand-cyan" />
                                                </div>
                                                <p className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover/upload:text-slate-900 dark:group-hover/upload:text-white transition-colors">
                                                    {selectedFiles.length > 0
                                                        ? `${selectedFiles.length} fotoğraf seçildi (Değiştirmek için tıklayın)`
                                                        : "Fotoğraf Yükle (Maks. 3)"}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-2 font-medium">JPG, PNG, WebP</p>
                                            </div>
                                            <input
                                                name="photos"
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                        </label>

                                        {/* Preview Grid */}
                                        {filePreviews.length > 0 && (
                                            <div className="grid grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                                {filePreviews.map((preview, idx) => (
                                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm group/preview">
                                                        <Image
                                                            src={preview}
                                                            alt={`Preview ${idx + 1}`}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                            <span className="text-xs font-bold bg-white text-slate-900 px-3 py-1.5 rounded-lg shadow-xl">
                                                                {selectedFiles[idx]?.name.slice(0, 15)}...
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="relative">
                                            <PlayCircle className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                                            <input
                                                name="mediaUrl"
                                                placeholder="Video Linki (Google Drive vb.)"
                                                className="w-full bg-slate-50 dark:bg-black/40 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4 pl-14 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={status === "loading" || status === "success"}
                                    className={`w-full py-5 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 mt-10
                                        ${status === "success"
                                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                                            : "bg-slate-900 dark:bg-brand-cyan text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:bg-slate-800 dark:hover:bg-brand-cyan-dark"
                                        }`}
                                >
                                    {status === "loading" ? (
                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : status === "success" ? (
                                        <>
                                            <CheckCircle2 className="w-6 h-6" />
                                            İşlem Başarılı
                                        </>
                                    ) : (
                                        <>
                                            Hemen Fiyat Al
                                            <Check className="w-6 h-6" />
                                        </>
                                    )}
                                </button>

                                {statusMessage && (
                                    <p className={`text-center font-bold text-sm mt-6 p-4 rounded-xl ${status === "success" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20" : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20"}`}>
                                        {statusMessage}
                                    </p>
                                )}
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
