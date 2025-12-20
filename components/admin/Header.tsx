"use client";

import { Bell, Search, User, Menu } from "lucide-react";

export default function AdminHeader() {
    return (
        <header className="h-20 bg-[#0f1115]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40">
            {/* Search Bar */}
            <div className="flex items-center gap-4 flex-1 max-w-xl">
                <div className="relative w-full max-w-md hidden md:block">
                    <input
                        type="text"
                        placeholder="Ara..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan/50 focus:ring-1 focus:ring-cyber-cyan/50 transition-all"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0f1115]" />
                </button>

                {/* Vertical Divider */}
                <div className="w-px h-8 bg-white/10" />

                {/* Admin Profile */}
                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-semibold text-white">Admin User</div>
                        <div className="text-xs text-cyber-cyan">Yönetici</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-[2px]">
                        <div className="w-full h-full rounded-full bg-[#0f1115] flex items-center justify-center overflow-hidden">
                            <User className="w-5 h-5 text-gray-300" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
