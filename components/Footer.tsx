"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Mail, Phone, MapPin, Zap } from "lucide-react";

interface Category {
    id: number;
    name: string;
    slug: string;
}

export default function Footer() {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith("/wolf-admin-1392a14");
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        if (isAdminRoute) return;

        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories");
                if (res.ok) {
                    const data = await res.json();
                    // Take first 4 categories for footer
                    setCategories(data.slice(0, 4));
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, [isAdminRoute]);

    const isFinanceRoute = pathname === "/elektronik-finans";
    if (isAdminRoute || isFinanceRoute) return null;

    return (
        <footer className="relative border-t border-white/5 pt-20 pb-8 overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dark to-transparent pointer-events-none" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-cyan/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-violet/5 rounded-full blur-[150px]" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="relative w-14 h-14">
                                <img src="/logo.png" alt="Wolf Bilişim Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
                            </div>
                            <span className="text-xl font-bold gradient-text">
                                Wolf Bilişim
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Teknoloji dünyasındaki çözüm ortağınız. Üst düzey donanım ve profesyonel hizmet anlayışıyla yanınızdayız.
                        </p>
                        <div className="flex gap-3">
                            <a href="https://www.instagram.com/wolfbilisimservis" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-pink-500 hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all duration-300">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="https://www.facebook.com/profile.php?id=61582518813874" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="https://www.tiktok.com/@wolf.bilisim" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-white hover:border-white/50 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                            <Zap className="w-4 h-4 text-cyber-cyan" />
                            Hızlı Bağlantılar
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { name: 'Anasayfa', href: '/' },
                                { name: 'Ürünler', href: '/products' },
                                { name: 'Hizmetlerimiz', href: '/services' },
                                { name: 'İletişim', href: '/contact' },
                                { name: 'Elektronik Finans', href: '/elektronik-finans' },
                                { name: 'İkinci El Alım', href: '/ikinci-el-alim' }
                            ].map((item, index) => (
                                <li key={index}>
                                    <Link
                                        href={item.href}
                                        className="text-gray-400 hover:text-cyber-cyan transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan/30 group-hover:bg-cyber-cyan group-hover:shadow-glow-sm-cyan transition-all" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories - Now Dynamic */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                            <span className="w-4 h-4 rounded bg-gradient-cyber" />
                            Kategoriler
                        </h3>
                        <ul className="space-y-3">
                            {categories.length > 0 ? (
                                categories.map((cat) => (
                                    <li key={cat.id}>
                                        <Link
                                            href={`/products?categoryId=${cat.id}`}
                                            className="text-gray-400 hover:text-cyber-emerald transition-colors flex items-center gap-2 group"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald/30 group-hover:bg-cyber-emerald transition-all" />
                                            {cat.name}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <>
                                    <li><Link href="/products" className="text-gray-400 hover:text-cyber-emerald transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald/30 group-hover:bg-cyber-emerald transition-all" />
                                        Tüm Ürünler
                                    </Link></li>
                                </>
                            )}
                            <li>
                                <Link
                                    href="/products"
                                    className="text-gray-400 hover:text-cyber-emerald transition-colors flex items-center gap-2 group"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald/30 group-hover:bg-cyber-emerald transition-all" />
                                    Tüm Ürünleri Gör →
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                            <Phone className="w-4 h-4 text-cyber-violet" />
                            İletişim
                        </h3>
                        <ul className="space-y-4">
                            <li className="group">
                                <div className="flex items-start gap-3 text-gray-400">
                                    <MapPin className="w-5 h-5 text-cyber-cyan mt-0.5 flex-shrink-0" />
                                    <div className="text-sm">
                                        <span className="block text-white font-medium mb-1">Merkez Şube</span>
                                        Mimar Sinan Mh. Çavuşdere Cd. No.33/B Üsküdar-İSTANBUL
                                    </div>
                                </div>
                            </li>
                            <li className="group">
                                <div className="flex items-start gap-3 text-gray-400">
                                    <MapPin className="w-5 h-5 text-cyber-violet mt-0.5 flex-shrink-0" />
                                    <div className="text-sm">
                                        <span className="block text-white font-medium mb-1">Bulgurlu Şubesi</span>
                                        Bulgurlu Mh. Söğütlüçayır Cd. No.14/A Üsküdar-İSTANBUL
                                    </div>
                                </div>
                            </li>
                            <li>
                                <a href="https://wa.me/905343398185" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-cyber-emerald transition-all group p-2 -mx-2 rounded-xl hover:bg-cyber-emerald/10">
                                    <Phone className="w-5 h-5 text-cyber-emerald group-hover:scale-110 transition-transform" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">WhatsApp</span>
                                        <span className="font-medium text-sm">0534 339 81 85</span>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="tel:+902163433577" className="flex items-center gap-3 text-gray-400 hover:text-cyber-cyan transition-all group p-2 -mx-2 rounded-xl hover:bg-cyber-cyan/10">
                                    <Phone className="w-5 h-5 text-cyber-cyan group-hover:scale-110 transition-transform" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Sabit Hat</span>
                                        <span className="font-medium text-sm">0216 343 35 77</span>
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} <span className="text-cyber-cyan">Wolf Bilişim</span>. Tüm hakları saklıdır.
                    </p>
                    <div className="flex items-center gap-6 text-xs text-gray-600">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyber-emerald pulse-glow" />
                            Sistem Aktif
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
