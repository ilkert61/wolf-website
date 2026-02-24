import Link from "next/link";
import { ShoppingCart, Eye, Flame, Timer } from "lucide-react";

interface ProductCardProps {
    product: {
        id: number;
        title: string;
        price: number;
        images: { url: string; isMain: boolean }[];
        category: { name: string };
        status: string;
        stock?: number;
        originalPrice?: number | null;
        isDeal?: boolean;
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    const isSold = product.status === "Sold" || product.status === "Satıldı" || (product.stock !== undefined && product.stock <= 0);
    const mainImage = product.images.find(img => img.isMain)?.url || product.images[0]?.url;

    // Discount Calculation
    const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;
    const price = Number(product.price);
    const hasDiscount = originalPrice && originalPrice > price;
    const discountRate = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    // Stock Warning
    const showStockWarning = product.stock !== undefined && product.stock > 0 && product.stock < 5;

    if (isSold) {
        return (
            <div className="premium-card opacity-60 flex flex-col mix-blend-luminosity grayscale transition-all hover:grayscale-0 group">
                <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-white/5">
                    {mainImage ? (
                        <img
                            src={mainImage}
                            alt={product.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600">
                            Görsel Yok
                        </div>
                    )}
                    <div className="absolute top-4 right-4 z-10">
                        <span className="bg-red-600/90 backdrop-blur-md text-white border border-red-500/50 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                            Tükendi
                        </span>
                    </div>
                </div>

                <div className="p-5 flex-grow flex flex-col bg-white dark:bg-[#0a0a0a]">
                    <div className="text-xs text-slate-500 mb-2 font-medium">{product.category.name}</div>
                    <h3 className="text-lg font-semibold mb-3 line-clamp-2 text-slate-500 dark:text-slate-400">
                        {product.title}
                    </h3>
                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5">
                        <span className="text-xl font-bold text-slate-500 dark:text-slate-600 line-through decoration-slate-400">
                            ₺{price.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Link
            href={`/products/${product.id}`}
            className="premium-card group flex flex-col cursor-pointer"
        >
            <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-black/50">
                {mainImage ? (
                    <img
                        src={mainImage}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600">
                        Görsel Yok
                    </div>
                )}

                {/* Badges Container */}
                <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
                    {/* Deal Badge */}
                    {product.isDeal && (
                        <span className="bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-widest shadow-lg shadow-orange-500/30">
                            <Flame className="w-3.5 h-3.5" />
                            Fırsat
                        </span>
                    )}

                    {/* Discount Badge */}
                    {hasDiscount && (
                        <span className="bg-brand-violet text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-brand-violet/30">
                            %{discountRate} İndirim
                        </span>
                    )}
                </div>

                {/* Stock Warning Badge */}
                {showStockWarning && (
                    <div className="absolute bottom-4 left-4 z-10">
                        <span className="bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-amber-500/30">
                            Son {product.stock} Adet
                        </span>
                    </div>
                )}

                {/* Quick View Button Overlay */}
                <div className="absolute inset-0 bg-slate-900/10 dark:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Eye className="w-4 h-4 text-brand-cyan" />
                        İncele
                    </div>
                </div>
            </div>

            <div className="p-5 flex-grow flex flex-col relative z-20 bg-white dark:bg-[#0a0a0a]">
                <div className="text-[10px] text-brand-cyan mb-2 font-bold uppercase tracking-widest">{product.category.name}</div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 transition-colors group-hover:text-brand-cyan">
                    {product.title}
                </h3>
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5">
                    <div className="flex items-end justify-between">
                        <div className="flex flex-col">
                            {hasDiscount && (
                                <span className="text-sm text-slate-400 dark:text-slate-500 line-through mb-0.5 font-medium">
                                    ₺{originalPrice?.toLocaleString()}
                                </span>
                            )}
                            <span className={`text-2xl font-black tracking-tight ${hasDiscount ? "text-brand-violet" : "text-slate-900 dark:text-white"}`}>
                                ₺{price.toLocaleString()}
                            </span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-brand-cyan group-hover:text-white transition-all shadow-sm group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                            <ShoppingCart className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
