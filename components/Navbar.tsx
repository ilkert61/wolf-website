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

    // Close mobile menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    if (isAdminRoute || isAuthRoute) return null;

    // Special logic for Electronic Finance page - hide navbar
    if (pathname === '/elektronik-finans') return null;

    const links = [
        { name: 'Anasayfa', href: '/' },
        { name: 'Elektronik Finans', href: '/elektronik-finans', special: true, target: '_blank' },
        { name: 'Teknik Servis', href: '/teknik-servis' },
        { name: 'Cihaz Sat', href: '/ikinci-el-alim' },
        { name: 'İletişim', href: '/contact' },
    ];

    return (
        <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${scrolled
            ? 'bg-[#050505]/80 backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent border-b border-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 relative">
                    {/* Logo Section */}
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2 md:gap-4 group" onClick={() => setIsOpen(false)}>
                            <div className="relative w-16 h-16 md:w-24 md:h-24 -my-4 transition-all duration-500 group-hover:scale-105">
                                <img
                                    src="/logo.png"
                                    alt="Wolf Bilişim Logo"
                                    className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.6)] md:drop-shadow-[0_0_20px_rgba(6,182,212,0.6)] group-hover:drop-shadow-[0_0_30px_rgba(6,182,212,0.8)] transition-all duration-500"
                                />
                            </div>
                            <span className="text-xl md:text-2xl font-bold gradient-text hidden sm:block">
                                Wolf Bilişim
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-1">
                            <Link
                                href="/"
                                className="relative px-4 py-2 rounded-xl text-sm font-medium text-gray-300 transition-all duration-300 hover:text-cyber-cyan group overflow-hidden"
                            >
                                <span className="relative z-10">Anasayfa</span>
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-cyber transition-all duration-300 group-hover:w-3/4 rounded-full" />
                            </Link>

                            {/* Products Dropdown */}
                            <div
                                className="relative group"
                                onMouseEnter={() => setIsProductsOpen(true)}
                                onMouseLeave={() => setIsProductsOpen(false)}
                            >
                                <button className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium text-gray-300 transition-all duration-300 hover:text-cyber-cyan">
                                    Ürünler
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProductsOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                <div className={`absolute top-full left-0 pt-4 w-60 transition-all duration-300 ${isProductsOpen ? 'opacity-100 translate-y-0 visible z-50' : 'opacity-0 translate-y-2 invisible -z-10'}`}>
                                    <div className="glass rounded-2xl shadow-2xl shadow-cyber-cyan/10 overflow-visible border border-white/5 bg-[#0a0a0a]/95 backdrop-blur-xl">
                                        <Link
                                            href="/products"
                                            className="block px-5 py-3.5 text-sm font-medium text-white hover:text-cyber-cyan hover:bg-white/5 transition-all border-b border-white/5"
                                        >
                                            <span className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan" />
                                                Tüm Ürünler
                                            </span>
                                        </Link>

                                        <div className="py-1">
                                            {categories.map((cat) => (
                                                <DesktopMenuItem key={cat.id} category={cat} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {links.slice(1).map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    // @ts-ignore
                                    target={link.target}
                                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group overflow-hidden ${
                                        // @ts-ignore
                                        link.special
                                            ? 'text-cyber-violet border border-cyber-violet/30 bg-cyber-violet/10 hover:bg-cyber-violet/20 shadow-[0_0_15px_-5px_rgba(139,92,246,0.5)]'
                                            : 'text-gray-300 hover:text-cyber-cyan'
                                        }`}
                                >
                                    <span className="relative z-10">{link.name}</span>
                                    {/* @ts-ignore */}
                                    {!link.special && (
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-cyber transition-all duration-300 group-hover:w-3/4 rounded-full" />
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Menu Button - Z-index fixed */}
                    <div className="md:hidden relative z-[60]">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-full text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/10 focus:outline-none transition-all border border-transparent"
                        >
                            {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* FULL SCREEN MOBILE MENU OVERLAY */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-2xl flex flex-col pt-24 px-6 overflow-y-auto"
                    >
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-cyan/10 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyber-violet/10 rounded-full blur-[100px] pointer-events-none" />

                        <div className="relative z-10 space-y-6 pb-12">
                            {/* Products Section */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Mağaza</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <Link href="/products" onClick={() => setIsOpen(false)} className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-white/10 active:scale-[0.98] transition-all">
                                        <ShoppingBag className="w-6 h-6 text-cyber-cyan" />
                                        <span className="text-sm font-medium text-white">Tüm Ürünler</span>
                                    </Link>
                                    {categories.slice(0, 3).map(cat => (
                                        <Link key={cat.id} href={`/products?categoryId=${cat.id}`} onClick={() => setIsOpen(false)} className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-white/10 active:scale-[0.98] transition-all">
                                            <div className="w-6 h-6 rounded-full bg-cyber-cyan/20 flex items-center justify-center">
                                                <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full" />
                                            </div>
                                            <span className="text-sm font-medium text-white">{cat.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Main Links */}
                            <div className="space-y-2">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2 mt-4">Hizmetler</h3>
                                <div className="flex flex-col gap-2">
                                    {links.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            // @ts-ignore
                                            target={link.target}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center gap-4 p-4 rounded-xl border transition-all active:scale-[0.98] ${
                                                // @ts-ignore
                                                link.special
                                                    ? "bg-cyber-violet/10 border-cyber-violet/30 text-white"
                                                    : "bg-white/5 border-white/5 text-gray-300 hover:text-white"
                                                }`}
                                        >
                                            {link.name === "Anasayfa" && <Home className="w-5 h-5 opacity-70" />}
                                            {link.name === "Elektronik Finans" && <CreditCard className="w-5 h-5 text-cyber-violet" />}
                                            {link.name === "Teknik Servis" && <Wrench className="w-5 h-5 text-cyber-cyan" />}
                                            {link.name === "Cihaz Sat" && <Smartphone className="w-5 h-5 text-cyber-emerald" />}
                                            {link.name === "İletişim" && <Phone className="w-5 h-5 opacity-70" />}
                                            {link.name === "Hizmetlerimiz" && <Wrench className="w-5 h-5 opacity-70" />}

                                            <span className="font-medium text-lg">{link.name}</span>
                                            {/* @ts-ignore */}
                                            {link.special && <span className="ml-auto text-xs font-bold bg-cyber-violet/20 px-2 py-1 rounded text-cyber-violet">POPÜLER</span>}
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
                className="flex items-center justify-between px-5 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all w-full"
            >
                <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-gray-600 group-hover/item:bg-cyber-cyan transition-colors" />
                    {category.name}
                </div>
                {hasChildren && <ChevronRight className="w-4 h-4 text-gray-600 group-hover/item:text-cyber-cyan" />}
            </Link>

            {hasChildren && (
                <div className="absolute left-full top-0 w-60 pl-2 opacity-0 translate-x-2 invisible group-hover/item:visible group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200">
                    <div className="glass rounded-xl shadow-xl border border-white/5 bg-[#0a0a0a]/95 backdrop-blur-xl overflow-hidden py-1">
                        {category.children!.map((child) => (
                            <DesktopMenuItem key={child.id} category={child} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
