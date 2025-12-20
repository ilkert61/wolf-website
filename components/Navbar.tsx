"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
    id: number;
    name: string;
    slug: string;
    parentId: number | null;
    children?: Category[];
}

export default function Navbar() {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith("/wolf-admin-1392a14");

    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        if (isAdminRoute) return;

        fetchCategories();

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isAdminRoute]);

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            if (res.ok) {
                const data = await res.json();
                setCategories(buildTree(data));
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const buildTree = (items: Category[]): Category[] => {
        const itemMap = new Map<number, Category>();
        const rootItems: Category[] = [];

        items.forEach(item => {
            // @ts-ignore: Initialize children
            itemMap.set(item.id, { ...item, children: [] });
        });

        items.forEach(originalItem => {
            const item = itemMap.get(originalItem.id)!;
            if (item.parentId) {
                const parent = itemMap.get(item.parentId);
                if (parent) {
                    parent.children?.push(item);
                } else {
                    rootItems.push(item);
                }
            } else {
                rootItems.push(item);
            }
        });

        return rootItems;
    };

    if (isAdminRoute) return null;

    const links = [
        { name: "Anasayfa", href: "/" },
        { name: "Hizmetlerimiz", href: "/services" },
        { name: "Elektronik Finans", href: "/elektronik-finans" },
        { name: "Cihaz Sat", href: "/ikinci-el-alim" },
        { name: "İletişim", href: "/contact" },
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
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="relative w-24 h-24 -my-4 transition-all duration-500 group-hover:scale-105">
                                <img
                                    src="/logo.png"
                                    alt="Wolf Bilişim Logo"
                                    className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(6,182,212,0.6)] group-hover:drop-shadow-[0_0_30px_rgba(6,182,212,0.8)] transition-all duration-500"
                                />
                            </div>
                            <span className="text-2xl font-bold gradient-text hidden sm:block">
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
                                    className="relative px-4 py-2 rounded-xl text-sm font-medium text-gray-300 transition-all duration-300 hover:text-cyber-cyan group overflow-hidden"
                                >
                                    <span className="relative z-10">{link.name}</span>
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-cyber transition-all duration-300 group-hover:w-3/4 rounded-full" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-3 rounded-xl text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/10 focus:outline-none transition-all border border-transparent hover:border-cyber-cyan/30"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden absolute w-full transition-all duration-500 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                <div className="glass border-t border-cyber-cyan/20 mx-4 mb-4 rounded-2xl overflow-hidden bg-[#050505]/95">
                    <div className="px-4 pt-4 pb-6 space-y-2 max-h-[80vh] overflow-y-auto">
                        <Link
                            href="/"
                            className="block px-4 py-3 rounded-xl text-base font-medium text-gray-300 hover:text-cyber-cyan hover:bg-cyber-cyan/10 transition-all"
                            onClick={() => setIsOpen(false)}
                        >
                            Anasayfa
                        </Link>

                        <div className="px-4 py-3">
                            <div className="text-sm font-semibold text-cyber-cyan mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-cyber-cyan pulse-glow" />
                                Ürünler
                            </div>
                            <div className="pl-4 space-y-1 border-l-2 border-cyber-cyan/30">
                                <Link
                                    href="/products"
                                    className="block py-2.5 text-sm text-gray-400 hover:text-cyber-cyan transition-all"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Tüm Ürünler
                                </Link>
                                {categories.map((cat) => (
                                    <MobileMenuItem key={cat.id} category={cat} onSelect={() => setIsOpen(false)} />
                                ))}
                            </div>
                        </div>

                        {links.slice(1).map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="block px-4 py-3 rounded-xl text-base font-medium text-gray-300 hover:text-cyber-cyan hover:bg-cyber-cyan/10 transition-all"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}

// Recursive Desktop Item
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

// Recursive Mobile Item
const MobileMenuItem = ({ category, onSelect }: { category: Category, onSelect: () => void }) => {
    const hasChildren = category.children && category.children.length > 0;
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-2.5 pr-2">
                <Link
                    href={`/products?categoryId=${category.id}`}
                    className="text-sm text-gray-400 hover:text-cyber-emerald transition-all flex-1"
                    onClick={() => !hasChildren && onSelect()}
                >
                    {category.name}
                </Link>
                {hasChildren && (
                    <button
                        onClick={(e) => { e.preventDefault(); setIsExpanded(!isExpanded); }}
                        className="p-1 text-gray-500 hover:text-white"
                    >
                        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isExpanded && hasChildren && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-4 border-l border-white/10 ml-1"
                    >
                        {category.children!.map((child) => (
                            <MobileMenuItem key={child.id} category={child} onSelect={onSelect} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
