"use client";

import { Bell, Search, User, Menu } from "lucide-react";

export default function AdminHeader() {
    return (
        <header className="h-24 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-10 fixed top-0 right-0 left-72 z-40">
            {/* Search Bar */}
            <div className="flex items-center gap-4 flex-1 max-w-xl">
                <div className="relative w-full max-w-md hidden md:block group">
                    <input
                        type="text"
                        placeholder="Yönetim panelinde ara..."
                        className="w-full bg-black/40 border border-white/10 rounded-2xl pl-14 pr-5 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan/50 focus:bg-white/5 focus:ring-1 focus:ring-brand-cyan/50 transition-all shadow-inner"
                    />
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-cyan transition-colors" />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-8">
                {/* Notifications */}
                <button className="relative p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-slate-400 hover:text-white transition-all shadow-sm">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0a0a0a] animate-pulse" />
                </button>

                {/* Vertical Divider */}
                <div className="w-px h-10 bg-white/10" />

                {/* Admin Profile */}
                <div className="flex items-center gap-4 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-black text-white group-hover:text-brand-cyan transition-colors">Admin User</div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Süper Admin</div>
                    </div>
                    <div className="w-12 h-12 rounded-[1.1rem] bg-gradient-to-br from-brand-cyan to-brand-violet p-[2px] shadow-lg group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all">
                        <div className="w-full h-full rounded-[1rem] bg-[#020202] flex items-center justify-center overflow-hidden">
                            <User className="w-6 h-6 text-slate-300" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
