"use client";

import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Clock, ArrowRight } from "lucide-react";
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
            color: "text-blue-400",
            bg: "bg-blue-400/10",
            trend: "+12%",
            trendUp: true,
            link: "/wolf-admin-1392a14/products"
        },
        {
            title: "Bekleyen Finans",
            value: stats.pendingFinanceCount,
            total: stats.financeCount,
            icon: DollarSign,
            color: "text-green-400",
            bg: "bg-green-400/10",
            trend: "Aksiyon Gerekli",
            trendUp: stats.pendingFinanceCount > 0,
            link: "/wolf-admin-1392a14/finance"
        },
        {
            title: "İkinci El Talep",
            value: stats.pendingSecondHandCount,
            total: stats.secondHandCount,
            icon: Smartphone,
            color: "text-purple-400",
            bg: "bg-purple-400/10",
            trend: "Yeni",
            trendUp: stats.pendingSecondHandCount > 0,
            link: "/wolf-admin-1392a14/second-hand"
        },
        {
            title: "Aktif Kategoriler",
            value: stats.categoryCount,
            icon: TrendingUp,
            color: "text-orange-400",
            bg: "bg-orange-400/10",
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
                        className="group relative overflow-hidden bg-[#16181d] border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-all hover:-translate-y-1"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Icon className={`w-16 h-16 ${widget.color}`} />
                        </div>

                        <div className="relative z-10">
                            <div className={`w-12 h-12 rounded-xl ${widget.bg} flex items-center justify-center mb-4`}>
                                <Icon className={`w-6 h-6 ${widget.color}`} />
                            </div>

                            <div className="text-gray-400 text-sm font-medium mb-1">{widget.title}</div>
                            <div className="flex items-end gap-2">
                                <div className="text-3xl font-bold text-white leading-none">{widget.value}</div>
                                {widget.total && (
                                    <div className="text-sm text-gray-500 mb-1">/ {widget.total}</div>
                                )}
                            </div>

                            <div className="mt-4 flex items-center gap-2 text-xs">
                                <span className={`flex items-center gap-1 font-medium ${widget.trendUp ? 'text-emerald-400' : 'text-gray-500'}`}>
                                    {widget.trendUp ? <TrendingUp className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
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

function Smartphone(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
            <path d="M12 18h.01" />
        </svg>
    )
}
