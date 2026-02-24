"use client";

import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Clock, ArrowRight, Activity } from "lucide-react";
import Link from "next/link";

interface StatsProps {
    productCount: number;
    categoryCount: number;
    financeCount: number;
    pendingFinanceCount: number;
    secondHandCount: number;
    pendingSecondHandCount: number;
}

export default function DashboardWidgets({ stats }: { stats: StatsProps }) {
    const widgets = [
        {
            title: "Toplam Ürün",
            value: stats.productCount,
            icon: ShoppingBag,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "group-hover:border-blue-500/50",
            trend: "+12% Artış",
            trendUp: true,
            link: "/wolf-admin-1392a14/products"
        },
        {
            title: "Bekleyen Finans",
            value: stats.pendingFinanceCount,
            total: stats.financeCount,
            icon: DollarSign,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            border: "group-hover:border-emerald-500/50",
            trend: stats.pendingFinanceCount > 0 ? "Aksiyon Gerekli" : "Tümü Onaylandı",
            trendUp: stats.pendingFinanceCount > 0,
            link: "/wolf-admin-1392a14/finance"
        },
        {
            title: "İkinci El Talep",
            value: stats.pendingSecondHandCount,
            total: stats.secondHandCount,
            icon: Activity,
            color: "text-brand-violet",
            bg: "bg-brand-violet/10",
            border: "group-hover:border-brand-violet/50",
            trend: "Yeni Talepler",
            trendUp: stats.pendingSecondHandCount > 0,
            link: "/wolf-admin-1392a14/second-hand"
        },
        {
            title: "Aktif Kategoriler",
            value: stats.categoryCount,
            icon: TrendingUp,
            color: "text-brand-cyan",
            bg: "bg-brand-cyan/10",
            border: "group-hover:border-brand-cyan/50",
            trend: "Stabil",
            trendUp: true,
            link: "/wolf-admin-1392a14/categories"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {widgets.map((widget, idx) => {
                const Icon = widget.icon;
                return (
                    <Link
                        key={idx}
                        href={widget.link}
                        className={`group relative overflow-hidden bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] hover:shadow-xl transition-all duration-500 ${widget.border} hover:-translate-y-1 block`}
                    >
                        <div className="absolute -top-4 -right-4 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                            <Icon className={`w-24 h-24 ${widget.color}`} />
                        </div>

                        <div className="relative z-10">
                            <div className={`w-14 h-14 rounded-2xl ${widget.bg} flex items-center justify-center mb-6 shadow-sm`}>
                                <Icon className={`w-7 h-7 ${widget.color}`} />
                            </div>

                            <div className="text-slate-400 text-sm font-bold mb-2 tracking-wide">{widget.title}</div>
                            <div className="flex items-end gap-2 mb-4">
                                <div className="text-4xl font-black text-white leading-none tracking-tight">{widget.value}</div>
                                {widget.total !== undefined && (
                                    <div className="text-sm font-bold text-slate-500 mb-1">/ {widget.total}</div>
                                )}
                            </div>

                            <div className="flex items-center gap-2 text-xs">
                                <span className={`flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-md ${widget.trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>
                                    {widget.trendUp ? <TrendingUp className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                    {widget.trend}
                                </span>
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    );
}
