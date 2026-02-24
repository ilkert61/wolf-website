"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Truck, Wallet, Recycle, Building2, Wrench } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const slides = [
    {
        id: 1,
        title: "Kargo Ücreti Yok!",
        description: "2500₺ ve üzeri tüm alışverişlerinizde kargo bizden. Güvenli ve hızlı teslimat avantajı.",
        bgImage: "/hero-bg-shipping.png?v=7",
        icon: Truck,
        ctaText: "Alışverişe Başla",
        ctaLink: "/products",
        accentColor: "#3b82f6" // blue-500
    },
    {
        id: 2,
        title: "Elektronik Finans",
        description: "Acil nakit ihtiyacınıza çözüm. Elektronik cihazlarınızla anında finansman fırsatı.",
        bgImage: "/hero-bg-finance.png?v=5",
        icon: Wallet,
        ctaText: "Detaylı Bilgi",
        ctaLink: "/elektronik-finans",
        accentColor: "#8b5cf6" // violet-500
    },
    {
        id: 3,
        title: "İkinci El Alım",
        description: "Cihazlarınızı değerinde satmak hiç bu kadar kolay olmamıştı. Tıkla ve teklif al.",
        bgImage: "/hero-bg-recycle.png?v=5",
        icon: Recycle,
        ctaText: "Teklif Al",
        ctaLink: "/ikinci-el-alim",
        accentColor: "#10b981" // emerald-500
    },
    {
        id: 4,
        title: "Kurumsal Teknik Servis",
        description: "Kurumsal şirketlere özel profesyonel teknik servis ve bakım anlaşmaları.",
        bgImage: "/hero-bg-corporate-service.png",
        icon: Building2,
        ctaText: "Kurumsal Teklif",
        ctaLink: "/teknik-servis",
        accentColor: "#6366f1" // indigo-500
    },
    {
        id: 5,
        title: "Cihaz Tamir",
        description: "Arızalı cihazlarınız uzman ellerde. Garantili tamir ve hızlı teslimat.",
        bgImage: "/hero-bg-device-repair.png",
        icon: Wrench,
        ctaText: "Tamir Talebi",
        ctaLink: "/teknik-servis",
        accentColor: "#06b6d4" // cyan-500
    }
];

export default function HeroCarousel() {
    const [current, setCurrent] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const nextSlide = useCallback(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    }, []);

    useEffect(() => {
        if (isHovered) return;
        const timer = setInterval(nextSlide, 7000); // Slower, more elegant timing
        return () => clearInterval(timer);
    }, [nextSlide, isHovered]);

    const currentSlide = slides[current];

    return (
        // Container
        <div
            className="relative w-full h-[450px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-[2.5rem] bg-black shadow-2xl ring-1 ring-white/10 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Background Layer - True Crossfade */}
            <div className="absolute inset-0 w-full h-full bg-[#050505]">
                <AnimatePresence initial={false}>
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <Image
                            src={currentSlide.bgImage}
                            alt={currentSlide.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                            className="object-cover scale-100" // Reset arbitrary static scaling to rely on Framer
                            priority
                            quality={100}
                        />
                        {/* Premium Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent mix-blend-multiply" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 w-full h-full flex items-center px-8 md:px-16 lg:px-24">
                <div className="max-w-2xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <span
                                    className="px-4 py-1.5 rounded-full text-xs font-bold text-white tracking-widest uppercase border border-white/20 shadow-lg backdrop-blur-xl"
                                    style={{ backgroundColor: `${currentSlide.accentColor}40` }}
                                >
                                    Wolf Bilişim
                                </span>
                            </div>

                            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-[1.05] drop-shadow-xl">
                                {currentSlide.title}
                            </h2>

                            <p className="text-lg md:text-xl text-slate-200 mb-10 leading-relaxed font-medium max-w-lg drop-shadow-md">
                                {currentSlide.description}
                            </p>

                            <Link
                                href={currentSlide.ctaLink}
                                className="group/btn relative inline-flex items-center gap-4 px-10 py-5 rounded-full bg-white text-black font-black transition-all hover:scale-105 hover:bg-slate-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] shadow-xl active:scale-95 text-lg"
                            >
                                <span>{currentSlide.ctaText}</span>
                                <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center group-hover/btn:translate-x-1 transition-transform">
                                    <ArrowRight className="w-4 h-4 text-black" />
                                </div>
                            </Link>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Indicator Dots */}
            <div className="absolute bottom-10 left-8 md:left-16 lg:left-24 z-20 flex items-center gap-3">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`h-2 rounded-full transition-all duration-500 ease-out ${idx === current ? "w-10 bg-white" : "w-2 bg-white/40 hover:bg-white/80"
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>

            {/* Navigation Arrows */}
            <div className="absolute bottom-8 right-8 z-20 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={prevSlide}
                    className="p-4 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90 hover:text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={nextSlide}
                    className="p-4 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90 hover:text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            {/* Bottom Gradient Edge for smooth integration */}
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        </div>
    );
}
