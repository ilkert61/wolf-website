"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Smartphone, CheckCircle, ExternalLink, X, Eye } from "lucide-react";

// Helper to safely parse JSON
function parseJson(str: string | null): any {
    if (!str) return {};
    try {
        return JSON.parse(str);
    } catch {
        return {};
    }
}

interface SecondHandItem {
    id: number;
    personalInfo: string;
    productInfo: string;
    condition: string;
    accessories: string | null;
    images: string;
    status: string;
    adminNotes: string | null;
    createdAt: Date;
}

// Detail Modal Component
function DetailModal({ item, onClose }: { item: SecondHandItem | null; onClose: () => void }) {
    if (!item) return null;

    const personalInfo = parseJson(item.personalInfo);
    const productInfo = parseJson(item.productInfo);
    const images = parseJson(item.images);
    const accessories = item.accessories ? parseJson(item.accessories) : [];

    const fullName = `${personalInfo.name || ''} ${personalInfo.surname || ''}`.trim();

    const conditionLabels: Record<string, string> = {
        'SIFIR_GIBI': 'Sıfır Gibi',
        'COK_IYI': 'Çok İyi',
        'IYI': 'İyi',
        'ORTA': 'Orta'
    };

    const statusLabels: Record<string, { label: string; color: string }> = {
        'PENDING': { label: 'Beklemede', color: 'bg-yellow-500/20 text-yellow-400' },
        'APPROVED': { label: 'Onaylandı', color: 'bg-green-500/20 text-green-400' },
        'REJECTED': { label: 'Reddedildi', color: 'bg-red-500/20 text-red-400' },
        'ARCHIVED': { label: 'Arşivlendi', color: 'bg-gray-500/20 text-gray-400' }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-surface-dark border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <Smartphone className="w-6 h-6 text-cyber-cyan" />
                            {productInfo.brand} {productInfo.model}
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">Başvuru #{item.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 space-y-6">
                    {/* Status Badge */}
                    <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusLabels[item.status]?.color || 'bg-gray-500/20 text-gray-400'}`}>
                            {statusLabels[item.status]?.label || item.status}
                        </span>
                        <span className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: tr })}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Images */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">Görseller</h3>
                            {Array.isArray(images) && images.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {images.map((img: string, idx: number) => (
                                        <a
                                            key={idx}
                                            href={img}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-cyber-cyan transition-colors group"
                                        >
                                            <img src={img} alt={`Görsel ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">Görsel yüklenmemiş</p>
                            )}
                        </div>

                        {/* Right Column - Details */}
                        <div className="space-y-6">
                            {/* Contact Info */}
                            <div className="glass-card rounded-xl p-4 space-y-3">
                                <h3 className="text-lg font-semibold text-white">İletişim Bilgileri</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Ad Soyad:</span>
                                        <span className="text-white">{fullName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">E-posta:</span>
                                        <a href={`mailto:${personalInfo.email}`} className="text-cyber-cyan hover:underline">{personalInfo.email}</a>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Telefon:</span>
                                        <a href={`tel:${personalInfo.phone}`} className="text-cyber-cyan hover:underline">{personalInfo.phone}</a>
                                    </div>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="glass-card rounded-xl p-4 space-y-3">
                                <h3 className="text-lg font-semibold text-white">Ürün Bilgileri</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Marka:</span>
                                        <span className="text-white">{productInfo.brand}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Model:</span>
                                        <span className="text-white">{productInfo.model}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Durum:</span>
                                        <span className="text-white">{conditionLabels[item.condition] || item.condition}</span>
                                    </div>
                                    {productInfo.estimatedPrice && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Beklenen Fiyat:</span>
                                            <span className="text-cyber-emerald font-medium">₺{productInfo.estimatedPrice}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            {productInfo.description && (
                                <div className="glass-card rounded-xl p-4 space-y-3">
                                    <h3 className="text-lg font-semibold text-white">Açıklama</h3>
                                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{productInfo.description}</p>
                                </div>
                            )}

                            {/* Accessories */}
                            {Array.isArray(accessories) && accessories.length > 0 && (
                                <div className="glass-card rounded-xl p-4 space-y-3">
                                    <h3 className="text-lg font-semibold text-white">Aksesuarlar</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {accessories.map((acc: string, idx: number) => (
                                            <span key={idx} className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-300">
                                                {acc}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between p-6 border-t border-white/10 bg-white/5">
                    <a
                        href={`mailto:${personalInfo.email}?subject=Wolf Bilişim - Cihaz Değerleme Teklifi: ${productInfo.brand} ${productInfo.model}&body=Sayın ${fullName},%0D%0A%0D%0ACihazınız için yaptığımız ön değerlendirme sonucu...`}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all flex items-center gap-2"
                    >
                        <CheckCircle className="w-5 h-5" />
                        Teklif Gönder
                    </a>
                    <button onClick={onClose} className="px-6 py-3 glass rounded-xl font-medium hover:bg-white/10 transition-colors">
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    );
}

// Main Page Component (Server Component wrapper for data fetching)
export default function SecondHandAdminPage() {
    return <SecondHandContent />;
}

// Client component for interactivity
function SecondHandContent() {
    const [listings, setListings] = useState<SecondHandItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<SecondHandItem | null>(null);

    // Fetch listings on mount
    useEffect(() => {
        const fetchListings = async () => {
            try {
                const res = await fetch('/api/second-hand');
                if (res.ok) {
                    const data = await res.json();
                    setListings(data);
                }
            } catch (error) {
                console.error('Error fetching listings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-2 border-cyber-cyan border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Smartphone className="w-8 h-8 text-cyber-cyan" />
                İkinci El Başvuruları
            </h1>

            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-left">
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Cihaz</th>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Durum</th>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">İletişim</th>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tarih</th>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Aksiyon</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {listings.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        Henüz başvuru bulunmamaktadır.
                                    </td>
                                </tr>
                            ) : listings.map((item) => {
                                const personalInfo = parseJson(item.personalInfo);
                                const productInfo = parseJson(item.productInfo);

                                const fullName = `${personalInfo.name || ''} ${personalInfo.surname || ''}`.trim();

                                return (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-white/5 transition-colors cursor-pointer"
                                        onClick={() => setSelectedItem(item)}
                                    >
                                        <td className="p-4">
                                            <div className="font-semibold text-white">{productInfo.brand} {productInfo.model}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-[200px]">{productInfo.description}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-sm px-2 py-0.5 rounded inline-block ${item.condition === 'SIFIR_GIBI' ? 'bg-green-500/20 text-green-400' :
                                                item.condition === 'COK_IYI' ? 'bg-cyan-500/20 text-cyan-400' :
                                                    item.condition === 'IYI' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-red-500/20 text-red-400'
                                                }`}>
                                                {item.condition === 'SIFIR_GIBI' && 'Sıfır Gibi'}
                                                {item.condition === 'COK_IYI' && 'Çok İyi'}
                                                {item.condition === 'IYI' && 'İyi'}
                                                {item.condition === 'ORTA' && 'Orta'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm text-white">{fullName}</div>
                                            <div className="text-xs text-gray-400">{personalInfo.email}</div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-400">
                                            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: tr })}
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedItem(item);
                                                }}
                                                className="p-2 glass rounded-lg hover:bg-white/10 text-cyber-cyan transition-colors"
                                                title="Detayları Görüntüle"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedItem && (
                <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
            )}
        </div>
    );
}
