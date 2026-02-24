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
    { id: "SIFIR_GIBI", label: "Sıfır Gibi", desc: "Çiziksiz, hatasız, kutulu", color: "text-emerald-600 dark:text-emerald-400 border-emerald-500/50 bg-emerald-50 dark:bg-emerald-500/10" },
    { id: "COK_IYI", label: "Çok İyi", desc: "Kılcal çizikler olabilir, darbe yok", color: "text-blue-600 dark:text-blue-400 border-blue-500/50 bg-blue-50 dark:bg-blue-500/10" },
    { id: "IYI", label: "İyi", desc: "Belirgin çizikler var, çalışır durumda", color: "text-yellow-600 dark:text-yellow-400 border-yellow-500/50 bg-yellow-50 dark:bg-yellow-500/10" },
    { id: "ORTA", label: "Orta", desc: "Darbe veya derin çizikler olabilir", color: "text-orange-600 dark:text-orange-400 border-orange-500/50 bg-orange-50 dark:bg-orange-500/10" },
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
            <div className="min-h-screen pt-32 pb-12 px-4 flex items-center justify-center bg-slate-50 dark:bg-[#020202]">
                <div className="premium-card max-w-lg w-full p-10 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-emerald/10 to-transparent pointer-events-none" />
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30"
                    >
                        <Check className="w-12 h-12 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Başvurunuz Alındı!</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium">
                        Cihazınızın ön değerlendirmesi uzman ekibimize ulaştı. En kısa sürede (genellikle 24 saat içinde) sizinle iletişime geçip fiyat teklifimizi sunacağız.
                    </p>
                    <button
                        onClick={() => window.location.href = "/"}
                        className="w-full py-4 rounded-xl bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/20 border border-slate-800 dark:border-white/10 text-white font-bold transition-all"
                    >
                        Anasayfaya Dön
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-32 pb-24 px-4 bg-slate-50 dark:bg-[#020202] text-slate-900 dark:text-slate-200 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-mesh-light dark:bg-mesh-dark opacity-40 mix-blend-screen pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                        Cihazını <span className="gradient-text">Nakit'e Çevir</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                        Eski cihazını değerinde satmak hiç bu kadar kolay olmamıştı. Formu doldur, teklif al, kapından alalım.
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-14 flex justify-between items-center relative max-w-3xl mx-auto px-4">
                    {/* Background Line */}
                    <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-200 dark:bg-white/5 -z-20 rounded-full" />
                    {/* Active Line - z-index updated to show behind circles */}
                    <motion.div
                        className="absolute top-1/2 left-0 h-1.5 bg-brand-cyan -z-10 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                    />

                    {steps.map((step) => {
                        const isActive = step.id === currentStep;
                        const isCompleted = step.id < currentStep;
                        return (
                            <div key={step.id} className="flex flex-col items-center gap-3 relative z-10 w-24">
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center border-[3px] transition-all duration-300 bg-white dark:bg-[#0a0a0a] shadow-sm ${isActive ? "border-brand-cyan text-brand-cyan shadow-[0_0_15px_rgba(6,182,212,0.4)]" :
                                    isCompleted ? "border-emerald-500 text-emerald-500" :
                                        "border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500"
                                    }`}>
                                    <step.icon className={`w-6 h-6 ${isActive && "animate-pulse"}`} />
                                </div>
                                <span className={`text-xs font-bold text-center transition-colors ${isActive ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-500"}`}>
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Form Container */}
                <div className="premium-card p-6 md:p-12 min-h-[500px] flex flex-col relative overflow-hidden">
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
                                <div className="space-y-8">
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Cihazını Tanıyalım</h2>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {deviceOptions.map((opt) => (
                                            <button
                                                key={opt.type}
                                                onClick={() => handleInputChange("deviceType", opt.type)}
                                                className={`p-5 rounded-2xl border transition-all flex flex-col items-center gap-4 ${formData.deviceType === opt.type
                                                    ? "bg-brand-cyan text-white border-transparent font-bold shadow-lg shadow-brand-cyan/30 scale-[1.02]"
                                                    : "bg-slate-50 dark:bg-black/30 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-medium hover:border-brand-cyan/50 hover:bg-brand-cyan/5 dark:hover:bg-brand-cyan/10"
                                                    }`}
                                            >
                                                <opt.icon className="w-7 h-7" />
                                                <span className="text-sm">{opt.type}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">Marka</label>
                                            <input
                                                type="text"
                                                value={formData.brand}
                                                onChange={(e) => handleInputChange("brand", e.target.value)}
                                                placeholder={placeholders[formData.deviceType].brand}
                                                className="premium-input font-medium"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">Model</label>
                                            <input
                                                type="text"
                                                value={formData.model}
                                                onChange={(e) => handleInputChange("model", e.target.value)}
                                                placeholder={placeholders[formData.deviceType].model}
                                                className="premium-input font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">Ekstra Açıklama (Opsiyonel)</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => handleInputChange("description", e.target.value)}
                                            placeholder={placeholders[formData.deviceType].desc}
                                            className="premium-input min-h-[120px] resize-none font-medium"
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-10">
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">Kozmetik Durumu</h2>
                                        <div className="grid md:grid-cols-2 gap-5">
                                            {conditions.map((cond) => (
                                                <button
                                                    key={cond.id}
                                                    onClick={() => handleInputChange("condition", cond.id)}
                                                    className={`relative p-6 rounded-2xl border text-left transition-all overflow-hidden group ${formData.condition === cond.id
                                                        ? `${cond.color} shadow-sm scale-[1.02]`
                                                        : "bg-slate-50 dark:bg-black/30 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:bg-white/5"
                                                        }`}
                                                >
                                                    <div className={`font-black mb-1.5 text-lg ${formData.condition === cond.id ? cond.color.split(" ")[0] : "text-slate-900 dark:text-white"}`}>
                                                        {cond.label}
                                                    </div>
                                                    <div className={`text-sm font-medium ${formData.condition === cond.id ? cond.color.split(" ")[0] : "text-slate-500 dark:text-slate-400"}`}>{cond.desc}</div>
                                                    {formData.condition === cond.id && (
                                                        <div className={`absolute top-0 right-0 p-3 rounded-bl-2xl bg-white/50 dark:bg-black/50 backdrop-blur-md ${cond.color.split(" ")[0]}`}>
                                                            <Check className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">Aksesuarlar</h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            {accessoriesList.map((acc) => (
                                                <button
                                                    key={acc}
                                                    onClick={() => handleAccessoryToggle(acc)}
                                                    className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${formData.accessories.includes(acc)
                                                        ? "bg-brand-violet/10 border-brand-violet text-brand-violet-dark dark:text-brand-violet font-bold"
                                                        : "bg-slate-50 dark:bg-black/30 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-medium hover:border-slate-300 dark:hover:bg-white/5"
                                                        }`}
                                                >
                                                    <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-colors ${formData.accessories.includes(acc) ? "bg-brand-violet border-brand-violet" : "border-slate-300 dark:border-slate-600"
                                                        }`}>
                                                        {formData.accessories.includes(acc) && <Check className="w-4 h-4 text-white" />}
                                                    </div>
                                                    {acc}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-8">
                                    <div className="text-center mb-8">
                                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Fotoğraflar</h2>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium">Cihazı net gösteren en az 1, en fazla 5 fotoğraf yükle.</p>
                                    </div>

                                    <div className="flex justify-center">
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full max-w-lg h-56 border-2 border-dashed border-slate-300 dark:border-white/20 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:border-brand-cyan hover:bg-brand-cyan/5 transition-all group bg-slate-50 dark:bg-black/20"
                                        >
                                            {uploading ? (
                                                <Loader2 className="w-12 h-12 text-brand-cyan animate-spin" />
                                            ) : (
                                                <>
                                                    <div className="w-20 h-20 rounded-full bg-white dark:bg-[#0a0a0a] border border-slate-100 dark:border-white/5 shadow-sm flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all">
                                                        <Camera className="w-8 h-8 text-brand-cyan" />
                                                    </div>
                                                    <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors font-bold">Fotoğraf Yüklemek İçin Tıkla</span>
                                                    <span className="text-xs text-slate-400 mt-2 font-medium">PNG, JPG, WebP</span>
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
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                                            {formData.images.map((img, idx) => (
                                                <div key={idx} className="aspect-square relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 group shadow-sm bg-white dark:bg-black">
                                                    <Image src={img} alt="Uploaded" fill className="object-cover" />
                                                    <button
                                                        onClick={() => setFormData(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))}
                                                        className="absolute top-2 right-2 p-2 bg-red-500/90 hover:bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg scale-90 hover:scale-100 backdrop-blur-sm"
                                                    >
                                                        <div className="w-4 h-4 flex items-center justify-center font-bold">✕</div>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div className="space-y-8">
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">İletişim Bilgileri</h2>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">Ad</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange("name", e.target.value)}
                                                className="premium-input font-medium"
                                                placeholder="Örn: Ahmet"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">Soyad</label>
                                            <input
                                                type="text"
                                                value={formData.surname}
                                                onChange={(e) => handleInputChange("surname", e.target.value)}
                                                className="premium-input font-medium"
                                                placeholder="Örn: Yılmaz"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">Telefon</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange("phone", e.target.value)}
                                            placeholder="05XX XXX XX XX"
                                            className="premium-input font-medium"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">E-posta</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            className="premium-input font-medium"
                                            placeholder="ornek@mail.com"
                                        />
                                    </div>

                                    <div className="p-5 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-start gap-4 mt-6">
                                        <AlertCircle className="w-6 h-6 text-brand-cyan shrink-0 top-0" />
                                        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                            Fiyat teklifimiz bu iletişim bilgileri üzerinden size iletilecektir. Lütfen doğruluklarını kontrol ediniz.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-200 dark:border-white/10">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 1 || isSubmitting}
                            className={`px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all ${currentStep === 1 ? "opacity-0 pointer-events-none" : "bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5"
                                }`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Geri
                        </button>

                        <button
                            onClick={nextStep}
                            disabled={isSubmitting || (currentStep === 3 && formData.images.length === 0)}
                            className="premium-button text-[15px] hover:shadow-[0_0_20px_#06b6d44d] disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    {currentStep === 4 ? "Başvuruyu Tamamla" : "Devam Et"}
                                    {currentStep !== 4 && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
