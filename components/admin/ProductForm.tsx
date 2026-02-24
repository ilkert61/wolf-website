"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Loader2, DollarSign, Euro, Globe, Settings, Tag, Info, AlertTriangle } from "lucide-react";

interface Category {
    id: number;
    name: string;
    attributes: string; // JSON string
}

interface ProductFormProps {
    initialData?: {
        id?: number;
        title: string;
        description: string;
        price: number;
        basePrice?: number | null;
        currency?: string;
        exchangeRateUsed?: number | null;
        categoryId: number;
        images: { url: string; isMain: boolean; order: number }[];
        attributes: string; // JSON string
        status: string;
        isDeal?: boolean;
        originalPrice?: number | null;
        stock?: number;
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string;
    };
    isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    // Live rates for preview calculation
    const [rates, setRates] = useState<{ USD: number, EUR: number, TRY: number } | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        basePrice: initialData?.basePrice || "",
        currency: initialData?.currency || "TRY",
        price: initialData?.price || "", // Calculated TL Price
        originalPrice: initialData?.originalPrice || "",
        stock: initialData?.stock ?? 1,
        isDeal: initialData?.isDeal || false,
        categoryId: initialData?.categoryId || "",
        status: initialData?.status || "On Sale",
        // SEO Fields
        metaTitle: initialData?.metaTitle || "",
        metaDescription: initialData?.metaDescription || "",
        keywords: initialData?.keywords || "",
    });

    // Images State
    const [images, setImages] = useState<{ url: string; file?: File }[]>(
        initialData?.images.map(img => ({ url: img.url })) || []
    );

    // Attributes State
    const [attributes, setAttributes] = useState<Record<string, string>>(
        initialData?.attributes ? JSON.parse(initialData.attributes) : {}
    );

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchCategories();
        fetchRates();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error("Kategoriler yüklenemedi:", error);
        }
    };

    const fetchRates = async () => {
        try {
            const res = await fetch("/api/admin/rates");
            if (res.ok) {
                const data = await res.json();
                setRates(data);
            }
        } catch (error) {
            console.error("Kurlar yüklenemedi:", error);
        }
    }

    // Auto-calculate TL price when basePrice or currency changes, IF we have live rates.
    useEffect(() => {
        if (!rates) return;
        const bp = Number(formData.basePrice);
        if (bp > 0) {
            const currentSelectedRate = rates[formData.currency as keyof typeof rates];
            const computedPrice = Math.round(bp * currentSelectedRate);
            setFormData(prev => ({ ...prev, price: computedPrice.toString() }));
        } else if (formData.currency === "TRY") {
            // if user types into price field directly while in TRY, basePrice handles it in backend logic, but let's keep it robust
        }
    }, [formData.basePrice, formData.currency, rates]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newImages = Array.from(files).map(file => ({
                url: URL.createObjectURL(file),
                file
            }));
            setImages([...images, ...newImages]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const uploadedImages = await Promise.all(
                images.map(async (img) => {
                    if (img.file) {
                        const fileFormData = new FormData();
                        fileFormData.append("file", img.file);
                        const res = await fetch("/api/upload", { method: "POST", body: fileFormData });
                        if (res.ok) {
                            const data = await res.json();
                            return { url: data.url };
                        }
                    }
                    return { url: img.url };
                })
            );

            const productData = {
                ...formData,
                price: Number(formData.price),
                basePrice: formData.currency !== "TRY" ? Number(formData.basePrice) : null,
                exchangeRateUsed: formData.currency !== "TRY" && rates ? rates[formData.currency as keyof typeof rates] : null,
                originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
                stock: Number(formData.stock),
                categoryId: Number(formData.categoryId),
                images: uploadedImages,
                attributes: attributes,
            };

            const url = isEdit ? `/api/products/${initialData?.id}` : "/api/products";
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productData),
            });

            if (res.ok) {
                router.push("/wolf-admin-1392a14/products");
                router.refresh();
            } else {
                alert("Kaydetme işlemi başarısız.");
            }
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const selectedCategory = categories.find(c => c.id === Number(formData.categoryId));
    const categoryAttributes = selectedCategory?.attributes ? JSON.parse(selectedCategory.attributes) : [];

    return (
        <form onSubmit={handleSubmit} className="max-w-[1400px] gap-8 grid grid-cols-1 xl:grid-cols-3">
            {/* Left Column: Main Info & Forex */}
            <div className="xl:col-span-2 space-y-8">

                {/* Forex Pricing Engine Block */}
                <div className="bg-[#0a0a0a] p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-cyan via-brand-violet to-emerald-500" />
                    <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                        <DollarSign className="w-6 h-6 text-emerald-400" />
                        Finansal Fiyatlandırma Modülü
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2 relative z-10">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Para Birimi</label>
                            <select
                                value={formData.currency}
                                onChange={(e) => {
                                    setFormData({ ...formData, currency: e.target.value, basePrice: "" });
                                }}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-brand-cyan transition-colors text-white font-bold"
                            >
                                <option value="TRY">Türk Lirası (₺)</option>
                                <option value="USD">Amerikan Doları ($)</option>
                                <option value="EUR">Euro (€)</option>
                            </select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest text-right">
                                {formData.currency === "TRY" ? "Sabit TL Satış Fiyatı" : `Giriş Fiyatı (${formData.currency})`}
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                required
                                value={formData.currency === "TRY" ? formData.price : formData.basePrice}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9.]/g, '');
                                    if (formData.currency === "TRY") {
                                        setFormData({ ...formData, price: val });
                                    } else {
                                        setFormData({ ...formData, basePrice: val });
                                    }
                                }}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-brand-cyan transition-colors text-right text-2xl font-black text-white"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {formData.currency !== "TRY" && (
                        <div className="mt-6 p-5 rounded-2xl bg-brand-cyan/5 border border-brand-cyan/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Info className="w-5 h-5 text-brand-cyan" />
                                <span className="text-sm font-medium text-slate-300">Otomatik TL Çevirimi (Anlık Kur)</span>
                            </div>
                            <div className="text-3xl font-black text-white">
                                ₺{Number(formData.price).toLocaleString()}
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-[#0a0a0a] p-8 rounded-[2rem] border border-white/5 space-y-6">
                    <h3 className="text-xl font-black text-white mb-6">Temel Bilgiler</h3>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Ürün Adı</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-violet transition-colors text-white"
                            placeholder="Örn: iPhone 15 Pro Max"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Açıklama (Markdown/HTML Destekli)</label>
                        <textarea
                            required
                            rows={8}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-violet transition-colors resize-y text-white leading-relaxed"
                            placeholder="Ürün detaylarını girin..."
                        ></textarea>
                    </div>
                </div>

                {/* SEO Room */}
                <div className="bg-[#0a0a0a] p-8 rounded-[2rem] border border-white/5 space-y-6">
                    <h3 className="text-xl font-black text-white mb-2 flex items-center gap-3">
                        <Globe className="w-5 h-5 text-brand-violet" />
                        SEO Kontrol Odası
                    </h3>
                    <p className="text-sm text-slate-500 mb-6">Google aramalarında ürününüz nasıl görünecek? B2B profesyonel etiketleri buradan yönetin.</p>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Meta Başlık</label>
                            <input
                                type="text"
                                value={formData.metaTitle}
                                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm"
                                placeholder="Arama motoru başlığı (opsiyonel)"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Meta Açıklama</label>
                            <textarea
                                rows={2}
                                value={formData.metaDescription}
                                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm resize-none"
                                placeholder="150 karakterlik çarpıcı açıklama..."
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Anahtar Kelimeler (Keywords)</label>
                            <input
                                type="text"
                                value={formData.keywords}
                                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm"
                                placeholder="iphone, apple, cep telefonu, sıfır cihaz"
                            />
                        </div>
                    </div>
                </div>

            </div>

            {/* Right Column: Settings & Media */}
            <div className="space-y-8">

                <div className="bg-[#0a0a0a] p-8 rounded-[2rem] border border-white/5 space-y-6">
                    <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                        <Tag className="w-5 h-5 text-blue-400" />
                        Kategori & Stok
                    </h3>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Kategori</label>
                        <select
                            required
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 font-medium"
                        >
                            <option value="">Lütfen Seçiniz</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Stok Adedi</label>
                            <input
                                type="number"
                                min="0"
                                required
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-center font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Durum</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-medium"
                            >
                                <option value="On Sale">Satışta</option>
                                <option value="Sold">Tükendi</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                        <label className="flex items-center gap-4 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={formData.isDeal}
                                    onChange={(e) => setFormData({ ...formData, isDeal: e.target.checked })}
                                    className="sr-only"
                                />
                                <div className={`block w-14 h-8 rounded-full transition-colors ${formData.isDeal ? "bg-brand-cyan" : "bg-white/10"}`}></div>
                                <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.isDeal ? "translate-x-6" : ""}`}></div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-white block">Haftanın Fırsatı</span>
                                <span className="text-xs text-slate-500">Anasayfada öne çıkar</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="bg-[#0a0a0a] p-8 rounded-[2rem] border border-white/5 space-y-6">
                    <h3 className="text-xl font-black text-white mb-4">Medya Yönetimi</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {images.map((img, index) => (
                            <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group border border-white/5">
                                <img src={img.url} alt={`Ürün ${index}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 p-2 bg-red-500/90 hover:bg-red-500 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                {index === 0 && (
                                    <div className="absolute bottom-2 left-2 px-3 py-1 bg-brand-cyan text-[#020202] text-[10px] font-black uppercase tracking-widest rounded-lg">
                                        Ana Görsel
                                    </div>
                                )}
                            </div>
                        ))}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-brand-cyan hover:bg-brand-cyan/5 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Upload className="w-5 h-5 text-slate-400 group-hover:text-brand-cyan" />
                            </div>
                            <span className="text-xs font-bold text-slate-500 group-hover:text-brand-cyan">Görsel Yükle</span>
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                </div>

                {/* Dynamic Attributes */}
                {selectedCategory && categoryAttributes.length > 0 && (
                    <div className="bg-[#0a0a0a] p-8 rounded-[2rem] border border-white/5 space-y-4">
                        <h3 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                            <Settings className="w-5 h-5 text-slate-400" />
                            Teknik Özellikler
                        </h3>
                        {categoryAttributes.map((attr: string) => (
                            <div key={attr}>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{attr}</label>
                                <input
                                    type="text"
                                    value={attributes[attr] || ""}
                                    onChange={(e) => setAttributes({ ...attributes, [attr]: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-violet"
                                    placeholder={`${attr} metriği`}
                                />
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex gap-4 pt-4 sticky bottom-8">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 py-4 bg-[#0a0a0a] hover:bg-white/5 text-white rounded-2xl font-bold transition-all border border-white/10"
                    >
                        İptal
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-[2] py-4 bg-gradient-to-r from-brand-cyan to-brand-violet text-white rounded-2xl font-bold transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:opacity-90 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isEdit ? "Değişiklikleri İnşa Et" : "Kataloğa Kaydet"}
                    </button>
                </div>
            </div>
        </form>
    );
}
