"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tag, FileText, LogOut, Smartphone, Settings, Users } from "lucide-react";
import { logoutAction } from "@/app/actions";

export default function AdminSidebar() {
    const pathname = usePathname();

    const menuItems = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Ürünler", href: "/admin/products", icon: Package },
        { name: "Kategoriler", href: "/admin/categories", icon: Tag },
        { name: "Finans Başvuruları", href: "/admin/finance", icon: FileText },
        { name: "İkinci El", href: "/admin/second-hand", icon: Smartphone },
    ];

    const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/");

    return (
        <aside className="fixed left-0 top-0 h-full w-72 bg-[#0f1115] border-r border-white/5 flex flex-col z-50">
            {/* Logo Area */}
            <div className="h-20 flex items-center gap-3 px-6 border-b border-white/5 bg-gradient-to-r from-cyan-500/5 to-transparent">
                <div className="relative w-10 h-10">
                    <img src="/logo.png" alt="Wolf Logo" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white leading-none tracking-tight">Wolf</h2>
                    <span className="text-xs text-cyber-cyan tracking-widest uppercase">Admin</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                {menuItems.map((item) => {
                    const active = isActive(item.href);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${active
                                ? "text-white bg-gradient-to-r from-cyan-500/20 to-blue-600/10 border border-cyan-500/20 shadow-[0_0_15px_-5px_rgba(6,182,212,0.3)]"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            {active && (
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-50" />
                            )}
                            <Icon className={`w-5 h-5 transition-transform duration-300 ${active ? "text-cyber-cyan scale-110" : "group-hover:text-cyber-cyan group-hover:scale-110"}`} />
                            <span className="font-medium relative z-10">{item.name}</span>
                            {active && (
                                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-cyber-cyan shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                            )}
                        </Link>
                    );
                })}

                <div className="my-6 border-t border-white/5 mx-2" />

                <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sistem</div>

                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors group">
                    <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                    <span className="font-medium">Ayarlar</span>
                </button>
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-white/5 bg-black/20">
                <button
                    onClick={() => logoutAction()}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all group"
                >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Çıkış Yap</span>
                </button>
            </div>
        </aside>
    );
}
