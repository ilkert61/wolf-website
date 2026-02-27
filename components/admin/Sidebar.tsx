"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tag, FileText, LogOut, Smartphone, Settings, ShieldAlert, History, Wrench } from "lucide-react";
import { logoutAction } from "@/app/actions";

export default function AdminSidebar() {
    const pathname = usePathname();

    const menuItems = [
        { name: "Dashboard", href: "/wolf-admin-1392a14/dashboard", icon: LayoutDashboard },
        { name: "Ürünler", href: "/wolf-admin-1392a14/products", icon: Package },
        { name: "Kategoriler", href: "/wolf-admin-1392a14/categories", icon: Tag },
        { name: "Teknik Servis", href: "/wolf-admin-1392a14/repairs", icon: Wrench },
        { name: "Finans Başvuru", href: "/wolf-admin-1392a14/finance", icon: FileText },
        { name: "İkinci El Alım", href: "/wolf-admin-1392a14/second-hand", icon: Smartphone },
    ];

    const systemItems = [
        { name: "Fiyat Geçmişi", href: "/wolf-admin-1392a14/price-logs", icon: History },
        { name: "Aktivite Logları", href: "/wolf-admin-1392a14/activity-logs", icon: ShieldAlert },
        { name: "Site Ayarları", href: "/wolf-admin-1392a14/settings", icon: Settings },
    ];

    const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/");

    return (
        <aside className="fixed left-0 top-0 h-full w-72 bg-[#020202] border-r border-white/5 flex flex-col z-50">
            {/* Logo Area */}
            <div className="h-24 flex items-center gap-4 px-8 border-b border-white/5 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/10 blur-[50px] pointer-events-none" />
                <div className="relative w-12 h-12 bg-white/5 rounded-2xl p-2 border border-white/10 shadow-lg flex items-center justify-center">
                    <img src="/logo.png" alt="Wolf Logo" className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                </div>
                <div className="flex flex-col">
                    <h2 className="text-xl font-black text-white tracking-tight leading-none">Wolf Bilişim</h2>
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
                            className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${active
                                ? "text-white bg-white/10 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
                                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                                }`}
                        >
                            {active && (
                                <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan/20 to-transparent opacity-50" />
                            )}
                            <div className={`relative z-10 p-2 rounded-xl transition-all ${active ? "bg-brand-cyan shadow-[0_0_15px_rgba(6,182,212,0.4)] text-white" : "bg-black/30 group-hover:bg-white/10 text-slate-400 group-hover:text-white"}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className="font-bold relative z-10 text-[15px] tracking-wide">{item.name}</span>
                        </Link>
                    );
                })}

                <div className="my-8 mx-4 border-t border-white/5 relative">
                    <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-[#020202] px-2 text-[10px] font-bold text-slate-600 tracking-widest uppercase">Denetim Merkezi</span>
                </div>

                {systemItems.map((item) => {
                    const active = isActive(item.href);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${active
                                ? "text-white bg-white/10 border border-white/10"
                                : "text-slate-500 hover:text-white hover:bg-white/5 border border-transparent"
                                }`}
                        >
                            <Icon className={`relative z-10 w-5 h-5 transition-transform ${active ? "text-brand-violet" : "group-hover:text-brand-violet group-hover:rotate-12"}`} />
                            <span className="font-bold relative z-10 text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Meta / Logout */}
            <div className="p-6 border-t border-white/5 bg-[#0a0a0a]">
                <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-cyan to-brand-violet flex items-center justify-center font-black text-white text-lg shadow-lg">
                        A
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white leading-none mb-1">Admin</p>
                        <p className="text-[10px] text-emerald-400 font-bold tracking-wider uppercase">Yönetici</p>
                    </div>
                </div>
                <button
                    onClick={() => logoutAction()}
                    className="w-full flex items-center justify-center gap-2 py-3.5 text-red-500 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 border border-transparent rounded-xl transition-all font-bold group"
                >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Oturumu Kapat</span>
                </button>
            </div>
        </aside>
    );
}
