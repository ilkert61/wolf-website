import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Check, Phone, Shield, Truck, Package } from "lucide-react";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: idStr } = await params;
    const id = Number(idStr);
    if (isNaN(id)) notFound();

    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            images: {
                orderBy: { order: 'asc' }
            },
            category: true
        }
    });

    if (!product) notFound();

    const productData = product as any;

    const attributes = productData.attributes ? JSON.parse(productData.attributes) : {};

    return (
        <div className="container mx-auto px-4 py-8 pt-28 min-h-screen">
            <Link
                href="/products"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-cyber-cyan mb-8 transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Ürünlere Dön
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image Section */}
                <ProductGallery images={product.images} title={product.title} />

                {/* Details Section */}
                <div className="space-y-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border-cyber-cyan/30 text-cyber-cyan text-sm font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan" />
                                {productData.category.name}
                            </div>
                            {productData.isDeal && (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-violet-500/30">
                                    🔥 Haftanın Fırsatı
                                </div>
                            )}
                            {productData.stock !== null && productData.stock < 5 && productData.stock > 0 && (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-medium animate-pulse">
                                    ⚡ Son {productData.stock} Ürün
                                </div>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">{productData.title}</h1>

                        <div className="flex items-end gap-3">
                            <div className="text-4xl font-black gradient-text-cyan">
                                ₺{Number(productData.price).toLocaleString()}
                            </div>
                            {productData.originalPrice && Number(productData.originalPrice) > Number(productData.price) && (
                                <div className="flex flex-col mb-1.5">
                                    <span className="text-lg text-gray-500 line-through decoration-red-500/50">
                                        ₺{Number(productData.originalPrice).toLocaleString()}
                                    </span>
                                    <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full text-center">
                                        %{Math.round(((Number(productData.originalPrice) - Number(productData.price)) / Number(productData.originalPrice)) * 100)} İndirim
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Info */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { icon: <Shield className="w-5 h-5" />, label: "2 Yıl Garanti" },
                            { icon: <Truck className="w-5 h-5" />, label: "Hızlı Kargo" },
                            { icon: <Package className="w-5 h-5" />, label: "Güvenli Paket" },
                        ].map((item, i) => (
                            <div key={i} className="glass p-3 rounded-xl flex flex-col items-center gap-2 text-center">
                                <span className="text-cyber-cyan">{item.icon}</span>
                                <span className="text-xs text-gray-400">{item.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Attributes Table */}
                    {Object.keys(attributes).length > 0 && (
                        <div className="glass-card rounded-2xl overflow-hidden">
                            <h3 className="bg-surface-medium/50 px-6 py-4 font-semibold border-b border-white/10 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-cyber-violet" />
                                Teknik Özellikler
                            </h3>
                            <div className="divide-y divide-white/5">
                                {Object.entries(attributes).map(([key, value]) => (
                                    <div key={key} className="grid grid-cols-3 px-6 py-3.5 hover:bg-white/5 transition-colors">
                                        <div className="text-gray-400 font-medium">{key}</div>
                                        <div className="col-span-2 text-gray-200">{value as string}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyber-emerald" />
                            Açıklama
                        </h3>
                        <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
                            {productData.description}
                        </p>
                    </div>

                    <div className="space-y-4 pt-4">
                        {productData.status === "Sold" || productData.status === "Satıldı" || (productData.stock !== null && productData.stock <= 0) ? (
                            <>
                                <div className="flex items-center gap-3 text-red-400 glass p-4 rounded-xl border border-red-500/20">
                                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                                    <span className="font-bold">Bu ürün tükendi</span>
                                </div>
                                <Link
                                    href="/contact"
                                    className="cyber-button w-full py-4 flex items-center justify-center gap-2 text-lg opacity-80"
                                >
                                    <Phone className="w-5 h-5" />
                                    <span>Benzer Ürünler İçin İletişime Geçin</span>
                                </Link>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 text-cyber-emerald glass p-4 rounded-xl border border-cyber-emerald/20">
                                    <div className="w-3 h-3 rounded-full bg-cyber-emerald pulse-glow" />
                                    <span className="font-semibold">Stokta & Gönderime Hazır</span>
                                </div>
                                <Link
                                    href="/contact"
                                    className="cyber-button w-full py-4 flex items-center justify-center gap-2 text-lg shadow-glow-cyan hover:shadow-glow-md-cyan transition-all"
                                >
                                    <Phone className="w-5 h-5" />
                                    <span>İletişime Geç</span>
                                </Link>
                                <p className="text-center text-xs text-gray-500 mt-2">
                                    *Detaylı bilgi ve sipariş için uzmanlarımızla görüşün.
                                </p>
                            </>
                        )}
                        <p className="text-center text-sm text-gray-500">
                            <span className="text-cyber-cyan">Wolf Bilişim</span> ile güvenli alışveriş
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
