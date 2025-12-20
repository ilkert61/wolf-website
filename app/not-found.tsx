import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            {/* Glowing 404 */}
            <div className="relative mb-8">
                <h2 className="text-[120px] md:text-[180px] font-black gradient-text leading-none">404</h2>
                <div className="absolute inset-0 bg-cyber-cyan/20 blur-[80px] -z-10" />
            </div>

            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Sayfa Bulunamadı</h3>
            <p className="text-gray-400 mb-10 max-w-md">
                Aradığınız sayfa mevcut değil veya taşınmış olabilir.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href="/"
                    className="cyber-button flex items-center gap-2 px-8"
                >
                    <Home className="w-5 h-5" />
                    <span>Anasayfaya Dön</span>
                </Link>
                <Link
                    href="/products"
                    className="glass px-8 py-4 rounded-xl font-semibold text-white hover:border-cyber-cyan/50 hover:shadow-glow-sm-cyan transition-all flex items-center gap-2"
                >
                    <Search className="w-5 h-5" />
                    <span>Ürünleri Keşfet</span>
                </Link>
            </div>
        </div>
    );
}
