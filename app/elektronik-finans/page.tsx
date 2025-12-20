"use client";

import { useState } from "react";
import { Calculator, Send, CheckCircle2, Smartphone, Laptop, Tablet, Watch, Banknote, Shield, Clock, AlertCircle } from "lucide-react";

export default function ElectronicFinancePage() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        deviceType: "Telefon",
        brandModel: "",
        estimatedValue: "",
        message: ""
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errors, setErrors] = useState<{ phone?: string; name?: string; brandModel?: string }>({});

    // Türkiye telefon numarası validasyonu (05XX XXX XX XX formatı)
    const validatePhone = (phone: string): boolean => {
        const cleanPhone = phone.replace(/\s/g, "").replace(/\D/g, "");
        // 05 ile başlamalı ve 11 hane olmalı VEYA 5 ile başlayıp 10 hane olmalı
        const pattern = /^(05\d{9}|5\d{9})$/;
        return pattern.test(cleanPhone);
    };

    const getPlaceholder = (type: string) => {
        switch (type) {
            case "Telefon": return "Örn: iPhone 13 Pro 128GB";
            case "Laptop": return "Örn: Acer Nitro 5 AN515";
            case "Tablet": return "Örn: iPad Air 5. Nesil 64GB";
            case "Akıllı Saat": return "Örn: Apple Watch Series 8 45mm";
            case "Diğer": return "Cihaz marka ve modelini belirtiniz";
            default: return "Cihaz marka ve modeli";
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { phone?: string; name?: string; brandModel?: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = "İsim zorunludur";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Telefon numarası zorunludur";
        } else if (!validatePhone(formData.phone)) {
            newErrors.phone = "Geçerli bir telefon numarası girin (05XX XXX XX XX)";
        }

        if (!formData.brandModel.trim()) {
            newErrors.brandModel = "Marka ve model bilgisi zorunludur";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setStatus("loading");
        setErrors({});

        try {
            const res = await fetch("/api/finance-applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setStatus("success");
                setFormData({
                    name: "",
                    phone: "",
                    email: "",
                    deviceType: "Telefon",
                    brandModel: "",
                    estimatedValue: "",
                    message: ""
                });
            } else {
                setStatus("error");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen text-white pb-20 pt-24">
            {/* Hero Section */}
            <section className="relative py-16 overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-emerald/15 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-cyan/15 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyber-emerald/30 mb-6">
                            <span className="w-2 h-2 rounded-full bg-cyber-emerald pulse-glow" />
                            <span className="text-sm font-medium text-cyber-emerald">Hızlı ve Güvenli</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black mb-6">
                            <span className="text-white">Elektronik</span>{" "}
                            <span className="gradient-text">Finans Sistemi</span>
                        </h1>
                        <p className="text-xl text-gray-400 leading-relaxed">
                            Elektronik cihazlarınızı nakite çevirin veya rehin bırakarak{" "}
                            <span className="text-cyber-cyan font-semibold">anında finansman</span> sağlayın.
                            Güvenli, hızlı ve değerinde işlem garantisi.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: <Banknote className="w-8 h-8" />, title: "Anında Ödeme", desc: "Değerleme sonrası hemen nakit", color: "cyan" },
                        { icon: <Shield className="w-8 h-8" />, title: "Güvenli İşlem", desc: "Cihazınız sigortalı olarak saklanır", color: "emerald" },
                        { icon: <Clock className="w-8 h-8" />, title: "Hızlı Süreç", desc: "10 dakikada işlem tamamlanır", color: "violet" },
                    ].map((item, i) => (
                        <div key={i} className={`glass-card p-6 rounded-2xl transition-all duration-500 hover:border-cyber-${item.color}/50 hover:shadow-glow-${item.color}`}>
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${item.color}-500/20 to-${item.color}-500/5 flex items-center justify-center mb-4 text-cyber-${item.color}`}>
                                {item.icon}
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-gray-400 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Info Section */}
                    <div className="space-y-10">
                        <div className="glass-card p-8 rounded-3xl">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center">
                                    <Calculator className="w-6 h-6 text-cyber-cyan" />
                                </div>
                                Nasıl Çalışır?
                            </h2>
                            <div className="space-y-6 text-gray-400">
                                <p className="leading-relaxed">
                                    Elektronik Finans Sistemi, acil nakit ihtiyaçlarınızda elektronik cihazlarınızı
                                    teminat olarak kullanarak finansman sağlayan bir hizmettir.
                                </p>
                                <div className="glass p-6 rounded-2xl">
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-cyber-cyan" />
                                        Örnek Hesaplama
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                                            <span>Cihaz Değeri:</span>
                                            <span className="text-xl font-bold gradient-text-cyan">10.000 TL</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                                            <span>Geri Alma Tutarı:</span>
                                            <span className="text-xl font-bold text-white">12.000 TL</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span>İşlem Oranı:</span>
                                            <span className="px-3 py-1 rounded-full bg-cyber-emerald/20 text-cyber-emerald font-semibold">%20</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-8 rounded-3xl">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-gradient-cyber" />
                                Kabul Edilen Cihazlar
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: Smartphone, label: "Akıllı Telefonlar", color: "cyan" },
                                    { icon: Laptop, label: "Laptop / PC", color: "violet" },
                                    { icon: Tablet, label: "Tabletler", color: "emerald" },
                                    { icon: Watch, label: "Akıllı Saatler", color: "rose" },
                                ].map((item, i) => (
                                    <div key={i} className={`flex items-center gap-4 p-4 glass rounded-xl hover:border-cyber-${item.color}/40 transition-all duration-300 group`}>
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-${item.color}-500/20 to-${item.color}-500/5 flex items-center justify-center text-cyber-${item.color} group-hover:scale-110 transition-transform`}>
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-300">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="glass-card p-8 rounded-3xl">
                        <h2 className="text-2xl font-bold mb-2">Fiyat Teklifi Alın</h2>
                        <p className="text-gray-400 mb-8">Formu doldurun, size özel teklifimizi sunalım.</p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Ad Soyad *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={`w-full glass rounded-xl px-4 py-3 focus:outline-none transition-colors bg-surface-dark/50 ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-cyber-cyan'}`}
                                        placeholder="Adınız Soyadınız"
                                    />
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Telefon *</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className={`w-full glass rounded-xl px-4 py-3 focus:outline-none transition-colors bg-surface-dark/50 ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-cyber-cyan'}`}
                                        placeholder="05XX XXX XX XX"
                                    />
                                    {errors.phone && (
                                        <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">E-mail</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full glass border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyber-cyan transition-colors bg-surface-dark/50"
                                    placeholder="email@ornek.com (isteğe bağlı)"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Cihaz Türü</label>
                                    <select
                                        value={formData.deviceType}
                                        onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
                                        className="w-full glass border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyber-cyan transition-colors bg-surface-dark"
                                    >
                                        <option value="Telefon">Telefon</option>
                                        <option value="Laptop">Laptop</option>
                                        <option value="Tablet">Tablet</option>
                                        <option value="Akıllı Saat">Akıllı Saat</option>
                                        <option value="Diğer">Diğer</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Tahmini Değer (TL)</label>
                                    <input
                                        type="number"
                                        value={formData.estimatedValue}
                                        onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                                        className="w-full glass border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyber-cyan transition-colors bg-surface-dark/50"
                                        placeholder="Örn: 15000"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Marka / Model *</label>
                                <input
                                    type="text"
                                    value={formData.brandModel}
                                    onChange={(e) => setFormData({ ...formData, brandModel: e.target.value })}
                                    className={`w-full glass rounded-xl px-4 py-3 focus:outline-none transition-colors bg-surface-dark/50 ${errors.brandModel ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-cyber-cyan'}`}
                                    placeholder={getPlaceholder(formData.deviceType)}
                                />
                                {errors.brandModel && (
                                    <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.brandModel}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Mesajınız / Ek Açıklama</label>
                                <textarea
                                    rows={4}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full glass border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyber-cyan transition-colors resize-none bg-surface-dark/50"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={status === "loading" || status === "success"}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2
                                    ${status === "success"
                                        ? "bg-cyber-emerald text-surface-dark shadow-glow-emerald"
                                        : "cyber-button"
                                    }`}
                            >
                                {status === "loading" && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                {status === "success" ? (
                                    <>
                                        <CheckCircle2 className="w-6 h-6" />
                                        <span>Başarıyla Gönderildi</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        <span>Teklif Al</span>
                                    </>
                                )}
                            </button>

                            {status === "success" && (
                                <p className="text-cyber-emerald text-center text-sm mt-2">
                                    Talebiniz alınmıştır. En kısa sürede sizinle iletişime geçeceğiz.
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
