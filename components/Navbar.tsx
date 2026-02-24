'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ChevronRight, Home, Smartphone, Wrench, ShoppingBag, Phone, CreditCard } from "lucide-react";

interface Category {
    id: number;
    name: string;
    slug: string;
    imageUrl?: string | null;
    children?: Category[];
}

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const pathname = usePathname();

    const isAdminRoute = pathname?.startsWith('/wolf-admin-1392a14');
    const isAuthRoute = pathname?.startsWith('/wolf-admin-1392a14/login');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/products/categories');
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    if (isAdminRoute || isAuthRoute) return null;
    if (pathname === '/elektronik-finans') return null;

    const links = [
        { name: 'Anasayfa', href: '/' },
        { name: 'Elektronik Finans', href: '/elektronik-finans', special: true, target: '_blank' },
        { name: 'Teknik Servis', href: '/teknik-servis' },
        { name: 'Cihaz Sat', href: '/ikinci-el-alim' },
        { name: 'İletişim', href: '/contact' },
    ];

    return (
        <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled
            ? 'premium-glass'
            : 'bg-transparent border-b border-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
                        <div className="relative w-12 h-12 transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                            <img
                                src="/logo.png"
                                alt="Wolf Bilişim Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <span className="text-xl md:text-2xl font-bold hidden sm:block text-slate-900 dark:text-white tracking-tight">
                            Wolf Bilişim
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1 bg-white/50 dark:bg-black/20 backdrop-blur-md px-2 py-1.5 rounded-2xl border border-slate-200/50 dark:border-white/5 shadow-sm">
                        <Link
                            href="/"
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${pathname === '/' ? 'bg-white dark:bg-white/10 text-brand-cyan shadow-sm dark:shadow-[0_0_10px_rgba(255,255,255,0.05)]' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'}`}
                        >
                            Anasayfa
                        </Link>

                        {/* Products Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setIsProductsOpen(true)}
                            onMouseLeave={() => setIsProductsOpen(false)}
                        >
                            <button className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${pathname.startsWith('/products') ? 'bg-white dark:bg-white/10 text-brand-cyan shadow-sm dark:shadow-[0_0_10px_rgba(255,255,255,0.05)]' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'}`}>
                                Ürünler
                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProductsOpen ? 'rotate-180 text-brand-cyan' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            <div className={`absolute top-full left-0 pt-3 w-64 transition-all duration-300 origin-top ${isProductsOpen ? 'opacity-100 scale-y-100 visible z-50' : 'opacity-0 scale-y-95 invisible -z-10'}`}>
                                <div className="premium-card py-2">
                                    <Link
                                        href="/products"
                                        className="flex items-center gap-3 px-5 py-3 text-sm font-semibold text-slate-800 dark:text-white hover:text-brand-cyan dark:hover:text-brand-cyan hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-b border-slate-100 dark:border-white/5"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-brand-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                                        Tüm Ürünleri Gör
                                    </Link>
                                    <div className="pt-1">
                                        {categories.map((cat) => (
                                            <DesktopMenuItem key={cat.id} category={cat} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {links.slice(2).map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                // @ts-ignore
                                target={link.target}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${pathname === link.href ? 'bg-white dark:bg-white/10 text-brand-cyan shadow-sm dark:shadow-[0_0_10px_rgba(255,255,255,0.05)]' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/elektronik-finans"
                            target="_blank"
                            className="group relative px-6 py-2.5 rounded-full text-sm font-bold overflow-hidden bg-slate-900 dark:bg-brand-cyan text-white dark:text-slate-900 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan/20 to-brand-violet/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="relative flex items-center gap-2">
                                Finans Başvurusu
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-brand-cyan hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-2xl border-b border-slate-200 dark:border-white/10 overflow-hidden"
                    >
                        <div className="px-4 pt-4 pb-8 space-y-6 max-h-[85vh] overflow-y-auto">
                            {/* Products Mobile */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-2">Mağaza</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <Link href="/products" onClick={() => setIsOpen(false)} className="premium-card p-4 flex flex-col items-center gap-3 hover:border-brand-cyan/30">
                                        <div className="w-10 h-10 rounded-full bg-brand-cyan/10 flex items-center justify-center">
                                            <ShoppingBag className="w-5 h-5 text-brand-cyan" />
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Tüm Ürünler</span>
                                    </Link>
                                    {categories.slice(0, 3).map(cat => (
                                        <Link key={cat.id} href={`/products?categoryId=${cat.id}`} onClick={() => setIsOpen(false)} className="premium-card p-4 flex flex-col items-center gap-3 hover:border-brand-cyan/30">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                                                <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full" />
                                            </div>
                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 text-center">{cat.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Links Mobile */}
                            <div className="space-y-2">
                                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-2">Menü</h3>
                                <div className="flex flex-col gap-2">
                                    {links.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            // @ts-ignore
                                            target={link.target}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                                                // @ts-ignore
                                                link.special
                                                    ? "bg-brand-cyan dark:bg-brand-cyan/20 border-brand-cyan text-white dark:text-brand-cyan shadow-lg shadow-brand-cyan/20"
                                                    : "bg-white dark:bg-[#0a0a0a] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-brand-cyan/30"
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                // @ts-ignore
                                                link.special ? 'bg-white/20' : 'bg-slate-50 dark:bg-white/5'
                                                }`}>
                                                {link.name === "Anasayfa" && <Home className="w-4 h-4" />}
                                                {link.name === "Elektronik Finans" && <CreditCard className="w-4 h-4" />}
                                                {link.name === "Teknik Servis" && <Wrench className="w-4 h-4" />}
                                                {link.name === "Cihaz Sat" && <Smartphone className="w-4 h-4" />}
                                                {link.name === "İletişim" && <Phone className="w-4 h-4" />}
                                            </div>

                                            <span className="font-semibold">{link.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

const DesktopMenuItem = ({ category }: { category: Category }) => {
    const hasChildren = category.children && category.children.length > 0;

    return (
        <div className="group/item relative">
            <Link
                href={`/products?categoryId=${category.id}`}
                className="flex items-center justify-between px-5 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-cyan dark:hover:text-brand-cyan hover:bg-slate-50 dark:hover:bg-white/5 transition-colors w-full"
            >
                <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 group-hover/item:bg-brand-cyan transition-colors shadow-sm" />
                    {category.name}
                </div>
                {hasChildren && <ChevronRight className="w-4 h-4 text-slate-400 group-hover/item:text-brand-cyan" />}
            </Link>

            {hasChildren && (
                <div className="absolute left-full top-0 w-64 pl-2 opacity-0 translate-x-1 invisible group-hover/item:visible group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300">
                    <div className="premium-card py-1">
                        {category.children!.map((child) => (
                            <DesktopMenuItem key={child.id} category={child} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
