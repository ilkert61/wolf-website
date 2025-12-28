"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Check, ChevronRight, ChevronLeft, Smartphone, Laptop, Tablet, Watch, Camera, AlertCircle, Loader2, Gamepad2, Headphones, Monitor, MoreHorizontal } from "lucide-react";
import Image from "next/image";

// Types
type Condition = "SIFIR_GIBI" | "COK_IYI" | "IYI" | "ORTA";
type DeviceType = "Telefon" | "Laptop" | "Tablet" | "Akıllı Saat" | "Oyun Konsolu" | "Kulaklık" | "Monitör" | "Diğer";

interface FormData {
    deviceType: DeviceType;
    brand: string;
    model: string;
    condition: Condition;
    accessories: string[];
    description: string;
    images: string[];
    name: string;
    surname: string;
    phone: string;
    email: string;
}

const steps = [
    { id: 1, title: "Cihaz Bilgisi", icon: Smartphone },
    { id: 2, title: "Durum & Kozmetik", icon: AlertCircle },
    { id: 3, title: "Fotoğraflar", icon: Camera },
    { id: 4, title: "İletişim", icon: Check },
];

const conditions: { id: Condition; label: string; desc: string; color: string }[] = [
    { id: "SIFIR_GIBI", label: "Sıfır Gibi", desc: "Çiziksiz, hatasız, kutulu", color: "text-emerald-400 border-emerald-500/50" },
    { id: "COK_IYI", label: "Çok İyi", desc: "Kılcal çizikler olabilir, darbe yok", color: "text-blue-400 border-blue-500/50" },
    { id: "IYI", label: "İyi", desc: "Belirgin çizikler var, çalışır durumda", color: "text-yellow-400 border-yellow-500/50" },
    { id: "ORTA", label: "Orta", desc: "Darbe veya derin çizikler olabilir", color: "text-orange-400 border-orange-500/50" },
];

const accessoriesList = ["Orijinal Kutu", "Fatura", "Şarj Aleti", "Garantisi Devam Ediyor"];

const deviceOptions: { type: DeviceType; icon: any }[] = [
    { type: "Telefon", icon: Smartphone },
    { type: "Laptop", icon: Laptop },
    { type: "Tablet", icon: Tablet },
    { type: "Akıllı Saat", icon: Watch },
    { type: "Oyun Konsolu", icon: Gamepad2 },
    { type: "Kulaklık", icon: Headphones },
    { type: "Monitör", icon: Monitor },
    { type: "Diğer", icon: MoreHorizontal },
];

const placeholders: Record<DeviceType, { brand: string; model: string; desc: string }> = {
    "Telefon": { brand: "Örn: Apple, Samsung, Xiaomi", model: "Örn: iPhone 13 Pro, S23 Ultra", desc: "Hafızası, pil sağlığı, rengi..." },
    "Laptop": { brand: "Örn: Apple, Lenovo, Asus", model: "Örn: MacBook Air M2, Legion 5", desc: "İşlemci, RAM, SSD, ekran kartı..." },
    "Tablet": { brand: "Örn: Apple, Samsung", model: "Örn: iPad Pro M1, Tab S8", desc: "Hafıza, hücresel veri, kalem var mı?..." },
    "Akıllı Saat": { brand: "Örn: Apple, Samsung", model: "Örn: Watch Series 8, Watch 5 Pro", desc: "Kasa çapı, kayış durumu..." },
    "Oyun Konsolu": { brand: "Örn: Sony, Microsoft", model: "Örn: PS5, Xbox Series X", desc: "Kol sayısı, diskli/dijital sürüm..." },
    "Kulaklık": { brand: "Örn: Apple, Sony, JBL", model: "Örn: AirPods Pro 2, WH-1000XM5", desc: "Şarj kutusu durumu, ped durumu..." },
    "Monitör": { brand: "Örn: LG, Samsung, AOC", model: "Örn: 27 inç 144Hz, Odyssey G5", desc: "Ölü piksel var mı, panel tipi..." },
    "Diğer": { brand: "Örn: Dyson, GoPro", model: "Örn: Airwrap, Hero 11", desc: "Cihaz hakkında detaylar..." },
};

export default function SecondHandPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        deviceType: "Telefon",
        brand: "",
        model: "",
        condition: "COK_IYI",
        accessories: [],
        description: "",
        images: [],
        name: "",
        surname: "",
        phone: "",
        email: "",
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (field: keyof FormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAccessoryToggle = (acc: string) => {
        setFormData(prev => {
            const exists = prev.accessories.includes(acc);
            return {
                ...prev,
                accessories: exists
                    ? prev.accessories.filter(a => a !== acc)
                    : [...prev.accessories, acc]
            };
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setUploading(true);

        const file = e.target.files[0];
        const data = new FormData();
        data.append("file", file);

        try {
            const res = await fetch("/api/second-hand/upload", {
                method: "POST",
                body: data,
            });

            if (!res.ok) throw new Error("Upload failed");

            const result = await res.json();
            setFormData(prev => ({ ...prev, images: [...prev.images, result.url] }));
        } catch (error) {
            console.error("Upload Error:", error);
            alert("Dosya yüklenirken bir hata oluştu.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                personalInfo: {
                    name: formData.name,
                    surname: formData.surname,
                    phone: formData.phone,
                    email: formData.email,
                },
                productInfo: {
                    brand: formData.brand,
                    model: formData.model,
                    description: formData.description,
                    estimatedPrice: "", // Optional logic
                },
                condition: formData.condition,
                accessories: formData.accessories,
                images: formData.images,
            };

            const res = await fetch("/api/second-hand", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Submission failed");

            setIsSuccess(true);
        } catch (error) {
            console.error("Submit Error:", error);
            alert("Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => {
        if (currentStep < 4) setCurrentStep(c => c + 1);
        else handleSubmit();
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(c => c - 1);
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center bg-background">
                <div className="glass-card max-w-lg w-full p-10 text-center rounded-3xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyber-emerald/10 to-transparent pointer-events-none" />
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-24 h-24 bg-gradient-to-br from-cyber-emerald to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow-lg-emerald"
                    >
                        <Check className="w-12 h-12 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-white mb-4">Başvurunuz Alındı!</h2>
                    <p className="text-gray-300 mb-8">
                        Cihazınızın ön değerlendirmesi uzman ekibimize ulaştı. En kısa sürede (genellikle 24 saat içinde) sizinle iletişime geçip fiyat teklifimizi sunacağız.
                    </p>
                    <button
                        onClick={() => window.location.href = "/"}
                        className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all"
                    >
                        Anasayfaya Dön
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-24 pb-20 px-4 bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-cyber-violet/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Cihazını <span className="text-transparent bg-clip-text bg-gradient-cyber">Nakit'e Çevir</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto">
                        Eski cihazını değerinde satmak hiç bu kadar kolay olmamıştı. Formu doldur, teklif al, kapından alalım.
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-10 flex justify-between items-center relative max-w-2xl mx-auto">
                    {/* Background Line */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -z-20 rounded-full" />
                    {/* Active Line - z-index updated to show behind circles */}
                    <motion.div
                        className="absolute top-1/2 left-0 h-1 bg-gradient-cyber -z-10 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                    />

                    {steps.map((step) => {
                        const isActive = step.id === currentStep;
                        const isCompleted = step.id < currentStep;
                        return (
                            <div key={step.id} className="flex flex-col items-center gap-2 relative z-10">
                                {/* Circle with solid background to mask the line cleanly if transparency issue exists, otherwise transparent */}
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-[#0f1115] ${isActive ? "border-cyber-cyan text-cyber-cyan shadow-glow-sm-cyan" :
                                    isCompleted ? "border-cyber-emerald text-cyber-emerald" :
                                        "border-white/10 text-gray-500"
                                    }`}>
                                    <step.icon className={`w-5 h-5 ${isActive && "animate-pulse"}`} />
                                </div>
                                <span className={`text-xs font-medium transition-colors ${isActive ? "text-white" : "text-gray-600"}`}>
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Form Container */}
                <div className="glass-card rounded-3xl p-6 md:p-10 min-h-[500px] flex flex-col relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex-1 flex flex-col"
                        >
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-white mb-2">Cihazını Tanıyalım</h2>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {deviceOptions.map((opt) => (
                                            <button
                                                key={opt.type}
                                                onClick={() => handleInputChange("deviceType", opt.type)}
                                                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-3 ${formData.deviceType === opt.type
                                                    ? "bg-gradient-cyber text-surface-dark border-transparent font-bold shadow-glow-sm-cyan"
                                                    : "bg-surface-dark/50 border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/5"
                                                    }`}
                                            >
                                                <opt.icon className="w-6 h-6" />
                                                <span className="text-sm">{opt.type}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400">Marka</label>
                                            <input
                                                type="text"
                                                value={formData.brand}
                                                onChange={(e) => handleInputChange("brand", e.target.value)}
                                                placeholder={placeholders[formData.deviceType].brand}
                                                className="w-full bg-surface-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyber-cyan transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400">Model</label>
                                            <input
                                                type="text"
                                                value={formData.model}
                                                onChange={(e) => handleInputChange("model", e.target.value)}
                                                placeholder={placeholders[formData.deviceType].model}
                                                className="w-full bg-surface-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyber-cyan transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Ekstra Açıklama (Opsiyonel)</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => handleInputChange("description", e.target.value)}
                                            placeholder={placeholders[formData.deviceType].desc}
                                            className="w-full bg-surface-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyber-cyan transition-colors min-h-[100px]"
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-4">Kozmetik Durumu</h2>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {conditions.map((cond) => (
                                                <button
                                                    key={cond.id}
                                                    onClick={() => handleInputChange("condition", cond.id)}
                                                    className={`relative p-5 rounded-2xl border text-left transition-all overflow-hidden group ${formData.condition === cond.id
                                                        ? `bg-surface-dark border-${cond.color.split(" ")[1].replace("text-", "")} ring-1 ring-${cond.color.split(" ")[1].replace("text-", "")}`
                                                        : "bg-surface-dark/30 border-white/5 hover:bg-surface-dark/50"
                                                        }`}
                                                >
                                                    <div className={`font-bold mb-1 ${formData.condition === cond.id ? cond.color.split(" ")[0] : "text-white"}`}>
                                                        {cond.label}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{cond.desc}</div>
                                                    {formData.condition === cond.id && (
                                                        <div className={`absolute top-0 right-0 p-2 rounded-bl-xl bg-surface-dark/80 backdrop-blur text-xs ${cond.color.split(" ")[0]}`}>
                                                            <Check className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-4">Aksesuarlar</h2>
                                        <div className="grid grid-cols-2 gap-3">
                                            {accessoriesList.map((acc) => (
                                                <button
                                                    key={acc}
                                                    onClick={() => handleAccessoryToggle(acc)}
                                                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${formData.accessories.includes(acc)
                                                        ? "bg-cyber-violet/10 border-cyber-violet text-white"
                                                        : "bg-surface-dark/30 border-white/5 text-gray-400 hover:bg-surface-dark/50"
                                                        }`}
                                                >
                                                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${formData.accessories.includes(acc) ? "bg-cyber-violet border-cyber-violet" : "border-gray-600"
                                                        }`}>
                                                        {formData.accessories.includes(acc) && <Check className="w-3 h-3 text-white" />}
                                                    </div>
                                                    {acc}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold text-white mb-2">Fotoğraflar</h2>
                                        <p className="text-gray-400">Cihazı net gösteren en az 1, en fazla 5 fotoğraf yükle.</p>
                                    </div>

                                    <div className="flex justify-center">
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full max-w-md h-48 border-2 border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-cyber-cyan/50 hover:bg-cyber-cyan/5 transition-all group"
                                        >
                                            {uploading ? (
                                                <Loader2 className="w-10 h-10 text-cyber-cyan animate-spin" />
                                            ) : (
                                                <>
                                                    <div className="w-16 h-16 rounded-full bg-surface-dark flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                        <Camera className="w-8 h-8 text-gray-400 group-hover:text-cyber-cyan transition-colors" />
                                                    </div>
                                                    <span className="text-gray-400 group-hover:text-white transition-colors">Fotoğraf Yüklemek İçin Tıkla</span>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                        />
                                    </div>

                                    {formData.images.length > 0 && (
                                        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                                            {formData.images.map((img, idx) => (
                                                <div key={idx} className="aspect-square relative rounded-xl overflow-hidden border border-white/10 group">
                                                    <Image src={img} alt="Uploaded" fill className="object-cover" />
                                                    <button
                                                        onClick={() => setFormData(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))}
                                                        className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <div className="w-3 h-3 flex items-center justify-center">✕</div>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-white mb-2">İletişim Bilgileri</h2>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400">Ad</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange("name", e.target.value)}
                                                className="w-full bg-surface-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyber-cyan transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400">Soyad</label>
                                            <input
                                                type="text"
                                                value={formData.surname}
                                                onChange={(e) => handleInputChange("surname", e.target.value)}
                                                className="w-full bg-surface-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyber-cyan transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Telefon</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange("phone", e.target.value)}
                                            placeholder="05XX XXX XX XX"
                                            className="w-full bg-surface-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyber-cyan transition-colors"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">E-posta</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            className="w-full bg-surface-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyber-cyan transition-colors"
                                        />
                                    </div>

                                    <div className="p-4 rounded-xl bg-cyber-emerald/10 border border-cyber-emerald/20 flex items-start gap-3 mt-4">
                                        <AlertCircle className="w-5 h-5 text-cyber-emerald shrink-0 mt-0.5" />
                                        <p className="text-sm text-cyber-emerald/90">
                                            Fiyat teklifimiz bu iletişim bilgileri üzerinden size iletilecektir. Bilgilerin doğruluğunu lütfen kontrol ediniz.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-white/5">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 1 || isSubmitting}
                            className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${currentStep === 1 ? "opacity-0 pointer-events-none" : "hover:bg-white/5 text-gray-400 hover:text-white"
                                }`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Geri
                        </button>

                        <button
                            onClick={nextStep}
                            disabled={isSubmitting || (currentStep === 3 && formData.images.length === 0)}
                            className="bg-gradient-cyber px-8 py-3 rounded-xl font-bold text-surface-dark shadow-glow-sm-cyan hover:shadow-glow-md-cyan transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {currentStep === 4 ? "Başvuruyu Tamamla" : "Devam Et"}
                                    {currentStep !== 4 && <ChevronRight className="w-4 h-4" />}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
