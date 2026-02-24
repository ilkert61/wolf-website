"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Phone, MapPin, ChevronRight, Mail } from "lucide-react";

interface Category {
    id: number;
    name: string;
    slug: string;
}

export default function Footer() {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith("/wolf-admin-1392a14");
    const isFinanceRoute = pathname === "/elektronik-finans";

    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        if (isAdminRoute || isFinanceRoute) return;

        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories");
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data.slice(0, 4));
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, [isAdminRoute, isFinanceRoute]);

    if (isAdminRoute || isFinanceRoute) return null;

    return (
        <footer className="relative bg-[#020202] border-t border-white/10 pt-24 pb-12 mt-20 overflow-hidden">
            {/* Mesh Background */}
            <div className="absolute inset-0 bg-mesh-dark opacity-40 pointer-events-none mix-blend-screen" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 group">
                            <div className="relative w-14 h-14 bg-white/5 rounded-2xl p-2.5 border border-white/10 shadow-xl group-hover:border-brand-cyan/40 transition-colors">
                                <img src="/logo.png" alt="Wolf Bilişim Logo" className="w-full h-full object-contain filter drop-shadow-lg" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Wolf Bilişim</h2>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            Kurumsal teknoloji çözüm ortağınız. Profesyonel donanım onarımı, ikinci el alım satımı ve elektronik finans servisleri.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="https://www.instagram.com/wolfbilisimservis" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-gradient-to-tr hover:from-brand-violet hover:to-brand-cyan transition-all shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="https://www.facebook.com/profile.php?id=61582518813874" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-accent transition-all shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="https://www.tiktok.com/@wolf.bilisim" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-black transition-all shadow-lg border border-transparent hover:border-white/20">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xs font-bold mb-6 text-slate-500 uppercase tracking-widest">Keşfet</h3>
                        <ul className="space-y-3.5">
                            {[
                                { name: 'Anasayfa', href: '/' },
                                { name: 'Premium Ürünler', href: '/products' },
                                { name: 'Teknoloji Market', href: '/services' },
                                { name: 'İletişim & Destek', href: '/contact' },
                                { name: 'Elektronik Finans', href: '/elektronik-finans' },
                                { name: 'İkinci El Alım', href: '/ikinci-el-alim' }
                            ].map((item, index) => (
                                <li key={index}>
                                    <Link
                                        href={item.href}
                                        className="text-slate-400 hover:text-white transition-colors flex items-center gap-3 text-sm group"
                                    >
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-brand-cyan transition-colors" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-xs font-bold mb-6 text-slate-500 uppercase tracking-widest">Kategoriler</h3>
                        <ul className="space-y-3.5">
                            {categories.length > 0 ? (
                                categories.map((cat) => (
                                    <li key={cat.id}>
                                        <Link
                                            href={`/products?categoryId=${cat.id}`}
                                            className="text-slate-400 hover:text-white transition-colors flex items-center gap-3 text-sm group"
                                        >
                                            <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-brand-cyan transition-colors" />
                                            {cat.name}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li>
                                    <Link href="/products" className="text-slate-400 hover:text-white transition-colors flex items-center gap-3 text-sm group">
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-brand-cyan transition-colors" />
                                        Tüm Ürünler
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xs font-bold mb-6 text-slate-500 uppercase tracking-widest">İletişim</h3>
                        <ul className="space-y-5">
                            <li>
                                <div className="flex items-start gap-4 text-slate-400 group">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-brand-cyan/10 transition-colors">
                                        <MapPin className="w-4 h-4 text-brand-cyan" />
                                    </div>
                                    <div className="text-sm leading-relaxed mt-1">
                                        <strong className="text-slate-200 block mb-1">Merkez Şubesi</strong>
                                        Mimar Sinan Mh. Çavuşdere Cd. No.33/B<br />Üsküdar/İstanbul
                                    </div>
                                </div>
                            </li>
                            <li>
                                <a href="https://wa.me/905343398185" className="flex items-center gap-4 text-slate-400 hover:text-white transition-colors text-sm group">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/10 transition-colors">
                                        <Phone className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <span className="font-medium">0534 339 81 85 <span className="text-slate-500 text-xs ml-2">WhatsApp</span></span>
                                </a>
                            </li>
                            <li>
                                <a href="tel:+902163433577" className="flex items-center gap-4 text-slate-400 hover:text-white transition-colors text-sm group">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-brand-cyan/10 transition-colors">
                                        <Phone className="w-4 h-4 text-brand-cyan" />
                                    </div>
                                    <span className="font-medium">0216 343 35 77 <span className="text-slate-500 text-xs ml-2">Sabit Hat</span></span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} <span className="text-white font-semibold">Wolf Bilişim</span>. Tüm hakları saklıdır.
                    </p>
                    <div className="flex gap-6 text-xs text-slate-500">
                        <Link href="/privacy" className="hover:text-white transition-colors">Gizlilik Politikası</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Kullanım Koşulları</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
