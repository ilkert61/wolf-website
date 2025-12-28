"use client";

import { useState } from "react";
import { Wrench, PlayCircle, Upload, CheckCircle2, AlertTriangle, Check, Smartphone, Laptop, Tablet, Gamepad2, HelpCircle } from "lucide-react";
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
        <div className="min-h-screen bg-[#020202] text-white selection:bg-cyber-cyan/30">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyber-violet/20 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyber-cyan/10 rounded-full blur-[150px]" />
            </div>

            <div className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-start">

                    {/* Left Column: Visuals & Info */}
                    <div className="relative z-10 lg:sticky lg:top-32 space-y-12">
                        <div className="relative">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyber-cyan/20 bg-cyber-cyan/5 text-cyber-cyan text-sm font-bold tracking-wider mb-6"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-cyan opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-cyan"></span>
                                </span>
                                PROFESYONEL TEKNİK SERVİS
                            </motion.div>

                            <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-tight mb-6">
                                Cihazınız <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-white to-cyber-violet animate-gradient-x">
                                    Yeniden Hayat Bulsun.
                                </span>
                            </h1>

                            <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
                                Telefon, bilgisayar veya oyun konsolu... Arızalı cihazlarınızı uzman ekibimizle en kısa sürede, garantili olarak onarıyoruz.
                            </p>
                        </div>

                        {/* Feature Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: Smartphone, label: "Telefon Tamiri" },
                                { icon: Laptop, label: "Laptop & PC" },
                                { icon: Tablet, label: "Tablet Servisi" },
                                { icon: Gamepad2, label: "Konsol Tamiri" }
                            ].map((item, i) => (
                                <div key={i} className="group p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-cyber-cyan/30 transition-all hover:bg-white/10">
                                    <item.icon className="w-8 h-8 text-gray-400 group-hover:text-cyber-cyan transition-colors mb-3" />
                                    <h3 className="font-bold text-gray-300 group-hover:text-white">{item.label}</h3>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative z-10"
                    >
                        <div className="p-1 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent">
                            <div className="bg-[#0a0a0a] rounded-[2.4rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
                                {/* Form Glow Effect */}
                                <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyber-violet/20 rounded-full blur-[100px] group-hover:bg-cyber-violet/30 transition-all duration-700" />

                                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                    <Wrench className="w-6 h-6 text-cyber-violet" />
                                    <span>Servis Talebi Oluştur</span>
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">

                                    {/* Personal Info Group */}
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">İletişim Bilgileri</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input name="fullName" required placeholder="Ad Soyad" className="w-full bg-[#151515] text-white border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-cyber-cyan transition-colors placeholder-gray-500" />
                                            <input name="phone" required placeholder="Telefon No" type="tel" className="w-full bg-[#151515] text-white border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-cyber-cyan transition-colors placeholder-gray-500" />
                                        </div>
                                        <input name="email" placeholder="E-posta (Opsiyonel)" type="email" className="w-full bg-[#151515] text-white border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-cyber-cyan transition-colors placeholder-gray-500" />
                                    </div>

                                    {/* Device Info Group */}
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Cihaz Bilgileri</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="relative">
                                                <select name="deviceType" className="w-full bg-[#151515] text-white border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-cyber-cyan transition-colors placeholder-gray-500 appearance-none cursor-pointer">
                                                    <option value="Telefon" className="bg-[#151515]">Telefon</option>
                                                    <option value="Laptop" className="bg-[#151515]">Laptop / PC</option>
                                                    <option value="Tablet" className="bg-[#151515]">Tablet</option>
                                                    <option value="Konsol" className="bg-[#151515]">Oyun Konsolu</option>
                                                    <option value="Diger" className="bg-[#151515]">Diğer</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                    <HelpCircle className="w-4 h-4" />
                                                </div>
                                            </div>
                                            <input name="brandModel" required placeholder="Marka & Model" className="w-full bg-[#151515] text-white border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-cyber-cyan transition-colors placeholder-gray-500" />
                                        </div>
                                        <textarea
                                            name="problemDescription"
                                            required
                                            rows={3}
                                            placeholder="Sorunu kısaca açıklayınız..."
                                            className="w-full bg-[#151515] text-white border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-cyber-cyan transition-colors placeholder-gray-500 resize-none"
                                        />
                                    </div>

                                    {/* Media Upload Group */}
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1 flex items-center justify-between">
                                            <span>Fotoğraf / Video</span>
                                            <span className="text-[10px] bg-cyber-violet/20 text-cyber-violet px-2 py-0.5 rounded">ÖNERİLİR</span>
                                        </label>

                                        <div className="grid grid-cols-1 gap-4">
                                            <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-cyber-cyan/50 hover:bg-cyber-cyan/5 transition-all group/upload overflow-hidden">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                                                    <Upload className="w-8 h-8 text-gray-400 mb-3 group-hover/upload:text-cyber-cyan transition-colors" />
                                                    <p className="text-sm text-gray-400 group-hover/upload:text-gray-300 transition-colors">
                                                        {selectedFiles.length > 0
                                                            ? `${selectedFiles.length} fotoğraf seçildi (Değiştirmek için tıklayın)`
                                                            : "Fotoğraf Yükle (Maks. 3)"}
                                                    </p>
                                                    <p className="text-xs text-gray-600 mt-1">JPG, PNG, WebP</p>
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
                                                <div className="grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                                                    {filePreviews.map((preview, idx) => (
                                                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group/preview">
                                                            <Image
                                                                src={preview}
                                                                alt={`Preview ${idx + 1}`}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                                                                <span className="text-xs font-medium bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
                                                                    {selectedFiles[idx]?.name.slice(0, 15)}...
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="relative">
                                                <PlayCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                                <input
                                                    name="mediaUrl"
                                                    placeholder="Video Linki (Google Drive vb.)"
                                                    className="w-full bg-[#151515] text-white border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-cyber-cyan transition-colors placeholder-gray-500 pl-12"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={status === "loading" || status === "success"}
                                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 mt-8
                                            ${status === "success"
                                                ? "bg-green-500 text-black hover:bg-green-400"
                                                : "bg-white text-black hover:bg-cyber-cyan hover:scale-[1.02] active:scale-[0.98]"
                                            }`}
                                    >
                                        {status === "loading" ? (
                                            <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        ) : status === "success" ? (
                                            <>
                                                <CheckCircle2 className="w-6 h-6" />
                                                İşlem Başarılı
                                            </>
                                        ) : (
                                            <>
                                                Hemen Fiyat Al
                                                <Check className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>

                                    {statusMessage && (
                                        <p className={`text-center text-sm font-medium animate-pulse ${status === "success" ? "text-green-400" : "text-red-400"}`}>
                                            {statusMessage}
                                        </p>
                                    )}
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
