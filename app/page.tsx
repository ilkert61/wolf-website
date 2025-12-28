import Link from "next/link";
import { ArrowRight, Shield, Zap, Truck, Cpu, Monitor, Headphones, Wrench, ChevronRight, Star, Clock } from "lucide-react";

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
        <div className="flex flex-col pb-10">
            {/* New Hero Carousel Section */}
            <section className="container mx-auto px-4 pt-20 mb-8 md:mb-12">
                <HeroCarousel />
            </section>

            {/* Weekly Deals Section */}
            {deals.length > 0 && (
                <section className="container mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row items-end justify-between gap-4 mb-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 mb-4 animate-pulse">
                                <Clock className="w-4 h-4 text-orange-500" />
                                <span className="text-sm font-bold text-orange-400 tracking-wide uppercase">Sınırlı Süre</span>
                            </div>
                            <h2 className="text-4xl font-black text-white">
                                Haftanın <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Fırsatları</span>
                            </h2>
                        </div>
                        <div className="text-right hidden md:block">
                            <p className="text-gray-400 text-sm mb-1">İndirimler sona ermeden yakala</p>
                            <div className="flex items-center gap-1 font-mono text-xl text-white">
                                <span className="bg-surface-light px-2 py-1 rounded text-red-400">03</span>:
                                <span className="bg-surface-light px-2 py-1 rounded text-red-50">12</span>:
                                <span className="bg-surface-light px-2 py-1 rounded text-red-50">45</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {deals.map(product => (
                            <ProductCard key={product.id} product={product as any} />
                        ))}
                    </div>
                </section>
            )}

            {/* Quick Links */}
            <section className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { name: "Hazır Sistemler", href: "/products", icon: <Monitor className="w-6 h-6" />, color: "cyan" },
                        { name: "Teknik Servis", href: "/services", icon: <Wrench className="w-6 h-6" />, color: "emerald" },
                        { name: "Elektronik Finans", href: "/elektronik-finans", icon: <Cpu className="w-6 h-6" />, color: "violet" },
                        { name: "İletişim", href: "/contact", icon: <Headphones className="w-6 h-6" />, color: "rose" },
                    ].map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className="group glass-card p-5 rounded-2xl flex items-center gap-4 hover:border-cyber-cyan/50 transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-xl bg-surface-medium flex items-center justify-center text-cyber-cyan group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-white group-hover:text-cyber-cyan transition-colors truncate">{item.name}</div>
                                <div className="text-xs text-gray-500">Hızlı Erişim</div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-cyber-cyan group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </Link>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyber-violet/30 mb-6">
                        <Zap className="w-4 h-4 text-cyber-violet" />
                        <span className="text-sm font-medium text-cyber-violet">Neden Biz?</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mb-4">
                        <span className="text-white">Wolf Bilişim </span>
                        <span className="gradient-text">Farkı</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: <Zap className="w-8 h-8" />, title: "Yüksek Performans", desc: "En son teknoloji bileşenlerle maksimum performans." },
                        { icon: <Shield className="w-8 h-8" />, title: "Kapsamlı Garanti", desc: "Tüm sistemlerde 2 yıl garanti ve ömür boyu destek." },
                        { icon: <Truck className="w-8 h-8" />, title: "Hızlı Teslimat", desc: "Türkiye'nin her yerine sigortalı kargo hizmeti." },
                    ].map((feature, index) => (
                        <div key={index} className="group glass-card p-8 rounded-3xl hover:border-cyber-cyan/30 transition-all duration-300">
                            <div className="w-16 h-16 rounded-2xl bg-surface-medium flex items-center justify-center mb-6 text-cyber-cyan group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Premium Category Grid */}
            <section className="container mx-auto px-4 py-16">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyber-emerald/30 mb-4">
                            <Monitor className="w-4 h-4 text-cyber-emerald" />
                            <span className="text-sm font-medium text-cyber-emerald">Ürün Kategorileri</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent">
                            Kategori <span className="text-cyber-cyan">Seç</span>
                        </h2>
                    </div>
                    <Link href="/products" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        Tüm Ürünler <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Fixed Premium Bento Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
                    {/* Left Column - Main Card (Gaming PC) */}
                    <Link href="/products" className="group relative h-[500px] rounded-3xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-700">
                        {/* Image */}
                        <img
                            src="/category-gaming-pc.png"
                            alt="Hazır Sistemler"
                            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />

                        <div className="absolute inset-0 p-10 flex flex-col justify-end relative z-10 transition-transform duration-500 group-hover:-translate-y-2">
                            <h3 className="text-4xl font-bold text-white mb-3 tracking-tight">
                                Hazır Sistemler
                            </h3>
                            <p className="text-gray-300 mb-6 max-w-sm text-lg font-light">
                                Profesyoneller ve oyuncular için optimize edilmiş yüksek performanslı iş istasyonları.
                            </p>
                            <div className="flex items-center gap-3 text-white font-medium group/btn w-fit">
                                <span className="border-b border-white/30 pb-0.5 group-hover/btn:border-white transition-colors">Koleksiyonu İncele</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                            </div>
                        </div>
                    </Link>

                    {/* Right Column - Stacked Cards */}
                    <div className="flex flex-col gap-6">
                        {/* Laptops */}
                        <Link href="/products" className="group relative h-[238px] rounded-3xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-700">
                            <img
                                src="/category-laptop.png"
                                alt="Dizüstü Bilgisayarlar"
                                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent opacity-90" />

                            <div className="absolute inset-0 p-8 flex flex-col justify-center relative z-10">
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    Dizüstü Bilgisayarlar
                                </h3>
                                <div className="w-8 h-1 bg-cyber-violet rounded-full group-hover:w-16 transition-all duration-500" />
                            </div>
                        </Link>

                        {/* Parts */}
                        <Link href="/products" className="group relative h-[238px] rounded-3xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-700">
                            <img
                                src="/category-parts.png"
                                alt="Bilgisayar Parçaları"
                                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent opacity-90" />

                            <div className="absolute inset-0 p-8 flex flex-col justify-center relative z-10">
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    Donanım & Parça
                                </h3>
                                <div className="w-8 h-1 bg-cyber-emerald rounded-full group-hover:w-16 transition-all duration-500" />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Full Width Bottom Card (Peripherals) */}
                <Link href="/products" className="group relative h-[220px] rounded-[2rem] overflow-hidden glass-card border border-white/5 hover:border-cyber-rose/30 hover:shadow-[0_0_30px_-10px_rgba(244,63,94,0.3)] transition-all duration-500 mt-6 block">
                    <img
                        src="/category-peripherals.png"
                        alt="Bilgisayar Ekipmanları"
                        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent opacity-95" />

                    <div className="absolute inset-0 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between relative z-10">
                        <div className="max-w-xl">
                            <div className="inline-flex items-center gap-2 mb-3">
                                <span className="w-2 h-2 rounded-full bg-cyber-rose animate-pulse" />
                                <p className="text-sm text-cyber-rose font-bold tracking-wider uppercase">Pro Ekipmanlar</p>
                            </div>
                            <h3 className="text-3xl font-black text-white mb-3 group-hover:text-cyber-rose transition-colors drop-shadow-lg">
                                Bilgisayar Ekipmanları
                            </h3>
                            <p className="text-gray-300 text-lg hidden sm:block">
                                Klavye, mouse, kulaklık ve daha fazlası ile oyun deneyimini zirveye taşı.
                            </p>
                        </div>
                        <div className="mt-6 md:mt-0 flex items-center gap-2 group/btn">
                            <span className="text-white font-bold group-hover/btn:text-cyber-rose transition-colors">Koleksiyonu İncele</span>
                            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover/btn:bg-cyber-rose group-hover/btn:border-cyber-rose group-hover/btn:text-white transition-all">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </Link>
            </section>

            {/* Services Preview */}
            <section className="container mx-auto px-4 py-16">
                <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
                    {/* Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-cyan/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyber-violet/10 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyber-emerald/30 mb-6">
                                <Wrench className="w-4 h-4 text-cyber-emerald" />
                                <span className="text-sm font-medium text-cyber-emerald">Servis Hizmetleri</span>
                            </div>
                            <h2 className="text-3xl font-black mb-4">
                                <span className="text-white">Profesyonel </span>
                                <span className="gradient-text">Teknik Destek</span>
                            </h2>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                Bilgisayar tamir, bakım, donanım yükseltme ve özel PC toplama hizmetlerimizle
                                tüm teknoloji ihtiyaçlarınıza çözüm sunuyoruz.
                            </p>
                            <Link href="/services" className="cyber-button inline-flex items-center gap-2">
                                <span>Hizmetlerimiz</span> <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: <Monitor className="w-6 h-6" />, title: "PC Toplama" },
                                { icon: <Wrench className="w-6 h-6" />, title: "Tamir & Bakım" },
                                { icon: <Cpu className="w-6 h-6" />, title: "Donanım Yükseltme" },
                                { icon: <Clock className="w-6 h-6" />, title: "7/24 Destek" },
                            ].map((service, index) => (
                                <div key={index} className="glass p-5 rounded-2xl group hover:border-cyber-cyan/30 transition-all">
                                    <div className="w-12 h-12 rounded-xl bg-surface-medium flex items-center justify-center text-cyber-cyan mb-3 group-hover:scale-110 transition-transform">
                                        {service.icon}
                                    </div>
                                    <div className="font-semibold text-white">{service.title}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="container mx-auto px-4 py-16">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-black mb-4">
                        <span className="text-white">Wolf Bilişim </span>
                        <span className="gradient-text">Farkı</span>
                    </h2>
                    <p className="text-gray-400 mb-10 text-lg">
                        Uzman ekibimiz, ihtiyaçlarınıza özel çözümler sunmak için hazır.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/contact" className="cyber-button group px-10">
                            <span className="flex items-center gap-2">
                                İletişime Geç <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                        <a
                            href="https://wa.me/905343398185"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-10 py-4 glass rounded-xl font-semibold text-cyber-emerald hover:border-cyber-emerald/50 hover:shadow-glow-emerald transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
