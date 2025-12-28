"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Truck, Wallet, Recycle } from "lucide-react";
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
    }
];

export default function HeroCarousel() {
    const [current, setCurrent] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    }, []);

    useEffect(() => {
        const timer = setInterval(nextSlide, 6000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    const currentSlide = slides[current];

    return (
        // Container: Adjusted height for better proportions, rounded corners, overflow hidden
        // bg-zinc-900 as a fallback color matching the dark theme
        <div className="relative w-full h-[450px] md:h-[500px] lg:h-[550px] overflow-hidden rounded-[2rem] bg-zinc-900 shadow-2xl ring-1 ring-white/10 group">

            {/* Background Layer - ABSOLUTE FULL COVERAGE */}
            <div className="absolute inset-0 w-full h-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <Image
                            src={currentSlide.bgImage}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                            className="object-cover scale-125"
                            priority
                            quality={100}
                        />
                        {/* Premium Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 w-full h-full flex items-center px-6 md:px-16 lg:px-24">
                <div className="max-w-xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <motion.span
                                className="inline-block px-4 py-1.5 mb-6 rounded-full text-sm font-semibold text-white/90 backdrop-blur-md border border-white/10"
                                style={{ backgroundColor: `${currentSlide.accentColor}30` }}
                            >
                                Wolf Bilişim
                            </motion.span>

                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]">
                                {currentSlide.title}
                            </h2>

                            <p className="text-base md:text-lg text-gray-300/90 mb-8 leading-relaxed font-light">
                                {currentSlide.description}
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href={currentSlide.ctaLink}
                                    className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-bold transition-transform hover:scale-105 active:scale-95"
                                >
                                    <span>{currentSlide.ctaText}</span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="absolute bottom-8 left-8 md:left-16 lg:left-24 z-20 flex items-center gap-4">
                <div className="flex gap-2">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === current ? "w-8 bg-white" : "w-1.5 bg-white/30 hover:bg-white/50"
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>

            <div className="absolute bottom-8 right-8 z-20 flex gap-2">
                <button
                    onClick={prevSlide}
                    className="p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={nextSlide}
                    className="p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
