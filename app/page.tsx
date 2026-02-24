import Link from "next/link";
import { ArrowRight, Shield, Zap, Cpu, Monitor, Headphones, Wrench, ChevronRight, Clock, ShoppingBag, ChevronDown } from "lucide-react";

import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";

export const dynamic = "force-dynamic";

export default async function Home() {
    const deals = await prisma.product.findMany({
        where: { isDeal: true } as any,
        take: 4,
        include: {
            images: true,
            category: true
        }
    });

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#020202]">
            {/* New Hero Carousel Section (Wrapper using premium dark mode logic) */}
            <main className="relative bg-[#020202] pt-28 pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-mesh-dark opacity-50 mix-blend-screen pointer-events-none" />
                <section className="container mx-auto px-4 relative z-10">
                    <HeroCarousel />
                </section>

                {/* Scroll Down Indicator */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-50 animate-bounce hidden sm:block">
                    <ChevronDown className="w-6 h-6 text-white" />
                </div>
            </main>

            {/* Quick Links / Services Belt - Light/Hybrid section */}
            <section className="container mx-auto px-4 -mt-12 relative z-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: "Hazır Sistemler", href: "/products", icon: <Monitor className="w-6 h-6" />, desc: "Toplama ve Hazır PC" },
                        { title: "Teknik Servis", href: "/teknik-servis", icon: <Wrench className="w-6 h-6" />, desc: "Tamir ve Bakım" },
                        { title: "Elektronik Finans", href: "/elektronik-finans", icon: <Cpu className="w-6 h-6" />, desc: "Kredi Kartına Taksit" },
                        { title: "İletişim", href: "/contact", icon: <Headphones className="w-6 h-6" />, desc: "7/24 Destek" },
                    ].map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className="premium-glass bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-3xl p-6 rounded-3xl flex items-start gap-5 group hover:border-brand-cyan/40 hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-[1.2rem] bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:bg-brand-cyan group-hover:text-white group-hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all shrink-0">
                                {item.icon}
                            </div>
                            <div className="pt-1">
                                <h3 className="font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-brand-cyan-dark dark:group-hover:text-brand-cyan transition-colors">{item.title}</h3>
                                <p className="text-sm font-medium text-slate-500 mt-1">{item.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Weekly Deals Section */}
            {deals.length > 0 && (
                <section className="container mx-auto px-4 py-24">
                    <div className="flex flex-col md:flex-row items-end justify-between gap-4 mb-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-violet/10 border border-brand-violet/20 text-brand-violet mb-4 shadow-sm">
                                <Clock className="w-4 h-4" />
                                <span className="text-[10px] font-bold tracking-widest uppercase">Sınırlı Süre</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                                Haftanın <span className="gradient-text">Fırsatları</span>
                            </h2>
                        </div>
                        <Link href="/products" className="hidden md:flex items-center gap-2 text-slate-500 hover:text-brand-cyan dark:hover:text-brand-cyan font-bold transition-colors uppercase text-xs tracking-wider">
                            Tümünü Gör <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {deals.map(product => (
                            <ProductCard key={product.id} product={product as any} />
                        ))}
                    </div>
                </section>
            )}

            {/* Premium Category Grid */}
            <section className="bg-slate-100 dark:bg-[#0a0a0a] border-y border-slate-200 dark:border-white/5 py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-900 dark:bg-grid-white opacity-20" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                            Donanımın Zirvesi
                        </h2>
                        <p className="text-slate-500 font-medium text-lg">
                            İhtiyacınız olan premium iş istasyonları ve bireysel teknoloji çözümleri tek adreste.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
                        {/* Left Main */}
                        <Link href="/products" className="group relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-xl dark:shadow-2xl transition-all duration-500 border border-slate-200/50 dark:border-white/10">
                            <img
                                src="/category-gaming-pc.png"
                                alt="Hazır Sistemler"
                                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                            <div className="absolute inset-0 p-12 flex flex-col justify-end">
                                <h3 className="text-4xl font-extrabold text-white mb-3 tracking-tight">Hazır Sistemler</h3>
                                <p className="text-slate-300 font-medium mb-8 max-w-md leading-relaxed">
                                    Yüksek performanslı iş istasyonları ve kesintisiz kurumsal donanım mimarileri.
                                </p>
                                <span className="inline-flex items-center gap-2 text-white font-bold bg-white/10 w-fit px-6 py-3 rounded-full backdrop-blur-md border border-white/20 group-hover:bg-brand-cyan group-hover:border-brand-cyan transition-colors">
                                    İncele <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </Link>

                        {/* Right Stack */}
                        <div className="flex flex-col gap-6">
                            <Link href="/products" className="group relative h-[238px] rounded-[2rem] overflow-hidden shadow-lg border border-slate-200/50 dark:border-white/10 transition-all duration-500">
                                <img
                                    src="/category-laptop.png"
                                    alt="Dizüstü Bilgisayarlar"
                                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                                <div className="absolute inset-0 p-10 flex flex-col justify-center">
                                    <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Laptop & PC</h3>
                                    <span className="inline-flex items-center gap-2 text-white font-semibold">
                                        Keşfet <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-brand-cyan" />
                                    </span>
                                </div>
                            </Link>
                            <Link href="/products" className="group relative h-[238px] rounded-[2rem] overflow-hidden shadow-lg border border-slate-200/50 dark:border-white/10 transition-all duration-500">
                                <img
                                    src="/category-parts.png"
                                    alt="Donanım Parçaları"
                                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                                <div className="absolute inset-0 p-10 flex flex-col justify-center">
                                    <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Donanım Birimleri</h3>
                                    <span className="inline-flex items-center gap-2 text-white font-semibold">
                                        Keşfet <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-brand-cyan" />
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Corporate Services */}
            <section className="py-24 relative overflow-hidden bg-white dark:bg-[#020202]">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan mb-8 font-bold text-[10px] uppercase tracking-widest shadow-sm">
                                <Shield className="w-3.5 h-3.5" /> Müşteri Odaklı
                            </div>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
                                Kurumsal Bilişim <br className="hidden md:block" />
                                <span className="text-slate-400 dark:text-slate-500">Altyapı Hizmetleri</span>
                            </h2>
                            <p className="text-slate-500 font-medium text-lg mb-10 leading-relaxed max-w-lg">
                                Güçlü, güvenilir ve kesintisiz teknoloji çözümleri.
                                Bireysel tamir işlemlerinden, büyük ölçekli donanım tedarikine kadar profesyonel hizmet sunuyoruz.
                            </p>
                            <Link href="/teknik-servis" className="premium-button w-fit group">
                                Servisleri İncele <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            {[
                                { title: "Kurulum", icon: <Monitor className="w-6 h-6" /> },
                                { title: "Bakım", icon: <Wrench className="w-6 h-6" /> },
                                { title: "Tedarik", icon: <Cpu className="w-6 h-6" /> },
                                { title: "Çözüm", icon: <Zap className="w-6 h-6" /> },
                            ].map((s, i) => (
                                <div key={i} className="premium-card p-8 group">
                                    <div className="w-14 h-14 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-brand-cyan/10 group-hover:text-brand-cyan transition-colors mb-6 shadow-sm border border-slate-100 dark:border-white/5">
                                        {s.icon}
                                    </div>
                                    <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">{s.title}</h4>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="container mx-auto px-4 py-24 text-center max-w-4xl">
                <div className="premium-card p-12 md:p-16 relative overflow-hidden bg-slate-50 dark:bg-[#0a0a0a]">
                    <div className="absolute inset-0 bg-mesh-dark opacity-10 mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight relative z-10">
                        Destek İçin Hazırız
                    </h2>
                    <p className="text-slate-500 font-medium mb-10 text-lg relative z-10 max-w-xl mx-auto">
                        Cihaz tamiri, kurumsal bakım anlaşmaları veya yeni cihaz alımı için uzman ekibimize ulaşın.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                        <Link href="/contact" className="premium-button">
                            İletişim Formu <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                        <a
                            href="https://wa.me/905343398185"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="premium-button text-slate-900 bg-white hover:bg-slate-50 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 border border-slate-200 dark:border-white/10"
                        >
                            WhatsApp Destek
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
