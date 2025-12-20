"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Loader2, Plus, GripVertical } from "lucide-react";

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
        categoryId: number;
        images: { url: string; isMain: boolean; order: number }[];
        attributes: string; // JSON string
        status: string;
        isDeal?: boolean;
    };
    isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        price: initialData?.price || "",
        originalPrice: (initialData as any)?.originalPrice || "",
        stock: (initialData as any)?.stock ?? 1,
        isDeal: (initialData as any)?.isDeal || false,
        categoryId: initialData?.categoryId || "",
        status: initialData?.status || "On Sale",
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
    }, []);

    // Reset attributes when category changes
    useEffect(() => {
        if (!isEdit && formData.categoryId) {
            setAttributes({});
        }
    }, [formData.categoryId, isEdit]);

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

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
            // Upload new images
            const uploadedImages = await Promise.all(
                images.map(async (img) => {
                    if (img.file) {
                        const formData = new FormData();
                        formData.append("file", img.file);
                        const res = await fetch("/api/upload", { method: "POST", body: formData });
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
                originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
                stock: Number(formData.stock),
                isDeal: formData.isDeal,
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
                router.push("/wolf-admin-1392a14/products"); // Redirect to products list
                router.refresh();
            }
        } catch (error) {
            console.error("Error saving product:", error);
        } finally {
            setLoading(false);
        }
    };

    const selectedCategory = categories.find(c => c.id === Number(formData.categoryId));
    const categoryAttributes = selectedCategory?.attributes ? JSON.parse(selectedCategory.attributes) : [];

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                        <h3 className="text-lg font-semibold mb-4">Temel Bilgiler</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Ürün Adı</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="Ürün adı"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Açıklama</label>
                            <textarea
                                required
                                rows={5}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                placeholder="Ürün açıklaması..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                        <h3 className="text-lg font-semibold mb-4">Görseller</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {images.map((img, index) => (
                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden group border border-white/10">
                                    <img src={img.url} alt={`Product ${index}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    {index === 0 && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs py-1 text-center">
                                            Ana Görsel
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-square border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 hover:bg-white/5 transition-all"
                            >
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-xs text-gray-400">Görsel Ekle</span>
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
                </div>

                {/* Right Column: Settings */}
                <div className="space-y-6">
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                        <h3 className="text-lg font-semibold mb-4">Ayarlar</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Fiyat (₺)</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                required
                                value={formData.price}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9.]/g, '');
                                    setFormData({ ...formData, price: val });
                                }}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Orijinal Fiyat (₺) <span className="text-xs text-gray-500">- İndirim varsa</span></label>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={formData.originalPrice}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9.]/g, '');
                                    setFormData({ ...formData, originalPrice: val });
                                }}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="Boş bırakılabilir"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Stok Adedi</label>
                                <input
                                    type="number"
                                    min="0"
                                    required
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="1"
                                />
                            </div>
                            <div className="flex items-end pb-1">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={formData.isDeal}
                                        onChange={(e) => setFormData({ ...formData, isDeal: e.target.checked })}
                                        className="w-5 h-5 rounded border-white/20 bg-black/20 text-cyan-500 focus:ring-cyan-500"
                                    />
                                    <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">Haftanın Fırsatı</span>
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Kategori</label>
                            <select
                                required
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                            >
                                <option value="">Seçiniz</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Durum</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                            >
                                <option value="On Sale">Satışta</option>
                                <option value="Sold">Satıldı</option>
                            </select>
                        </div>
                    </div>

                    {/* Dynamic Attributes */}
                    {selectedCategory && categoryAttributes.length > 0 && (
                        <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                            <h3 className="text-lg font-semibold mb-4">Özellikler</h3>
                            {categoryAttributes.map((attr: string) => (
                                <div key={attr}>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">{attr}</label>
                                    <input
                                        type="text"
                                        value={attributes[attr] || ""}
                                        onChange={(e) => setAttributes({ ...attributes, [attr]: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder={`${attr} giriniz`}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-semibold transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Kaydediliyor...
                                </>
                            ) : (
                                isEdit ? "Güncelle" : "Oluştur"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
