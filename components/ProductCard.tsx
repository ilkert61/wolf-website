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
            <div className="group glass-card rounded-2xl overflow-hidden flex flex-col opacity-60">
                <div className="relative aspect-square overflow-hidden bg-surface-dark">
                    {mainImage ? (
                        <img
                            src={mainImage}
                            alt={product.title}
                            className="w-full h-full object-cover grayscale"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                            Görsel Yok
                        </div>
                    )}
                    <div className="absolute top-4 right-4 z-10">
                        <span className="bg-red-500/90 text-white text-xs font-bold px-4 py-2 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.5)] uppercase tracking-wider backdrop-blur-sm">
                            Tükendi
                        </span>
                    </div>
                    <div className="absolute inset-0 bg-surface-dark/50" />
                </div>

                <div className="p-5 flex-grow flex flex-col">
                    <div className="text-xs text-gray-500 mb-2 font-medium">{product.category.name}</div>
                    <h3 className="text-lg font-semibold mb-3 line-clamp-2 text-gray-500">
                        {product.title}
                    </h3>
                    <div className="mt-auto flex items-center justify-between">
                        <span className="text-xl font-bold text-gray-500 line-through decoration-red-500/50">
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
            className="group glass-card rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:shadow-glow-cyan hover:border-cyber-cyan/40 relative"
        >
            <div className="relative aspect-square overflow-hidden bg-surface-dark">
                {mainImage ? (
                    <img
                        src={mainImage}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                        Görsel Yok
                    </div>
                )}

                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Badges Container */}
                <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
                    {/* Deal Badge */}
                    {product.isDeal && (
                        <span className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-violet-500/30 uppercase tracking-widest flex items-center gap-1">
                            <Flame className="w-3 h-3 fill-current" />
                            Fırsat
                        </span>
                    )}

                    {/* Discount Badge */}
                    {hasDiscount && (
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-red-500/30">
                            %{discountRate} İndirim
                        </span>
                    )}
                </div>

                {/* Stock Warning Badge */}
                {showStockWarning && (
                    <div className="absolute bottom-4 left-4 z-10">
                        <span className="bg-orange-500/90 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm animate-pulse">
                            Son {product.stock} Ürün!
                        </span>
                    </div>
                )}

                {/* Quick View Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="px-5 py-2.5 glass rounded-full text-white text-sm font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Eye className="w-4 h-4" />
                        İncele
                    </div>
                </div>

                {/* Corner Decorations */}
                <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-cyber-cyan/0 group-hover:border-cyber-cyan/50 rounded-tl-2xl transition-all duration-500" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-cyber-cyan/0 group-hover:border-cyber-cyan/50 rounded-br-2xl transition-all duration-500" />
            </div>

            <div className="p-5 flex-grow flex flex-col">
                <div className="text-xs text-cyber-cyan mb-2 font-medium uppercase tracking-wider">{product.category.name}</div>
                <h3 className="text-lg font-semibold mb-3 line-clamp-2 transition-colors group-hover:text-cyber-cyan text-white">
                    {product.title}
                </h3>
                <div className="mt-auto pt-3 border-t border-white/5">
                    <div className="flex items-end justify-between">
                        <div className="flex flex-col">
                            {hasDiscount && (
                                <span className="text-sm text-gray-500 line-through mb-0.5">
                                    ₺{originalPrice?.toLocaleString()}
                                </span>
                            )}
                            <span className={`text-2xl font-bold ${hasDiscount ? "text-red-400" : "gradient-text-cyan"}`}>
                                ₺{price.toLocaleString()}
                            </span>
                        </div>
                        <button className="p-3 bg-gradient-cyber rounded-xl transition-all duration-300 text-surface-dark hover:shadow-glow-cyan hover:scale-105">
                            <ShoppingCart className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
