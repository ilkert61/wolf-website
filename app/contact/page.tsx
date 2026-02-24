"use client";

import { Phone, MapPin, Facebook, Instagram, ArrowRight, MessageCircle } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen pb-24 pt-32 bg-slate-50 dark:bg-[#020202] text-slate-900 dark:text-slate-200 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-mesh-light dark:bg-mesh-dark opacity-40 mix-blend-screen pointer-events-none" />

            {/* Hero Section */}
            <div className="relative py-16 overflow-hidden z-10">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm mb-8">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">7/24 Destek</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
                        <span className="text-slate-900 dark:text-white">Bize</span>{" "}
                        <span className="gradient-text">Ulaşın</span>
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                        Teknoloji çözümlerimiz hakkında bilgi almak veya destek talepleriniz için yanınızdayız.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                {/* Primary Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    {/* WhatsApp Card */}
                    <div className="group premium-card p-10 transition-all duration-500 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/20 relative overflow-hidden bg-white/50 dark:bg-[#0a0a0a]/80">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] dark:opacity-5 group-hover:opacity-10 transition-opacity">
                            <MessageCircle className="w-32 h-32 text-emerald-500" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-[1.2rem] bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-sm text-emerald-600 dark:text-emerald-400">
                                <MessageCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">WhatsApp Destek</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Hızlı yanıt için bize WhatsApp üzerinden yazın.</p>
                            <div className="space-y-4">
                                <a href="https://wa.me/905343398185" target="_blank" className="flex items-center justify-between p-5 bg-slate-50 dark:bg-black/30 rounded-2xl border border-slate-100 dark:border-white/5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-all group/item">
                                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold tracking-wider">0534 339 81 85</span>
                                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover/item:text-emerald-500 group-hover/item:translate-x-1 transition-all" />
                                </a>
                                <a href="https://wa.me/905528841934" target="_blank" className="flex items-center justify-between p-5 bg-slate-50 dark:bg-black/30 rounded-2xl border border-slate-100 dark:border-white/5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-all group/item">
                                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold tracking-wider">0552 884 19 34</span>
                                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover/item:text-emerald-500 group-hover/item:translate-x-1 transition-all" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Phone Card */}
                    <div className="group premium-card p-10 transition-all duration-500 hover:border-brand-cyan/50 hover:shadow-xl hover:shadow-brand-cyan/20 relative overflow-hidden bg-white/50 dark:bg-[#0a0a0a]/80">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] dark:opacity-5 group-hover:opacity-10 transition-opacity">
                            <Phone className="w-32 h-32 text-brand-cyan" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-[1.2rem] bg-cyan-100 dark:bg-brand-cyan/10 border border-cyan-200 dark:border-brand-cyan/20 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-brand-cyan group-hover:text-white transition-all duration-500 shadow-sm text-cyan-600 dark:text-brand-cyan">
                                <Phone className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Müşteri Hizmetleri</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Mesai saatleri içinde bizi arayabilirsiniz.</p>
                            <a href="tel:+902163433577" className="flex items-center justify-between p-6 bg-slate-50 dark:bg-black/30 rounded-2xl border border-slate-100 dark:border-white/5 hover:bg-cyan-50 dark:hover:bg-brand-cyan/10 hover:border-cyan-200 dark:hover:border-brand-cyan/30 transition-all group/item">
                                <span className="font-mono text-cyan-600 dark:text-brand-cyan text-xl font-bold tracking-wider">0216 343 35 77</span>
                                <div className="w-12 h-12 rounded-full bg-cyan-100 dark:bg-brand-cyan/20 flex items-center justify-center group-hover/item:bg-brand-cyan group-hover/item:text-white transition-colors text-cyan-600 dark:text-brand-cyan">
                                    <Phone className="w-5 h-5" />
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Social Media Card */}
                    <div className="group premium-card p-10 transition-all duration-500 hover:border-brand-violet/50 hover:shadow-xl hover:shadow-brand-violet/20 relative overflow-hidden bg-white/50 dark:bg-[#0a0a0a]/80">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] dark:opacity-5 group-hover:opacity-10 transition-opacity">
                            <Instagram className="w-32 h-32 text-brand-violet" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-[1.2rem] bg-violet-100 dark:bg-brand-violet/10 border border-violet-200 dark:border-brand-violet/20 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-brand-violet group-hover:text-white transition-all duration-500 shadow-sm text-violet-600 dark:text-brand-violet">
                                <Instagram className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Sosyal Medya</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Bizi sosyal medya hesaplarımızdan takip edin.</p>
                            <div className="grid grid-cols-3 gap-4">
                                <a href="https://www.instagram.com/wolfbilisimservis" target="_blank" className="flex flex-col items-center justify-center py-5 bg-slate-50 dark:bg-black/30 rounded-2xl border border-slate-100 dark:border-white/5 hover:bg-pink-50 dark:hover:bg-pink-500/10 hover:border-pink-200 dark:hover:border-pink-500/30 transition-all group/item">
                                    <Instagram className="w-7 h-7 text-pink-500 mb-3 group-hover/item:scale-110 transition-transform" />
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover/item:text-slate-900 dark:group-hover:text-white">Instagram</span>
                                </a>
                                <a href="https://www.facebook.com/profile.php?id=61582518813874" target="_blank" className="flex flex-col items-center justify-center py-5 bg-slate-50 dark:bg-black/30 rounded-2xl border border-slate-100 dark:border-white/5 hover:bg-blue-50 dark:hover:bg-blue-600/10 hover:border-blue-200 dark:hover:border-blue-600/30 transition-all group/item">
                                    <Facebook className="w-7 h-7 text-blue-500 mb-3 group-hover/item:scale-110 transition-transform" />
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover/item:text-slate-900 dark:group-hover:text-white">Facebook</span>
                                </a>
                                <a href="https://www.tiktok.com/@wolf.bilisim" target="_blank" className="flex flex-col items-center justify-center py-5 bg-slate-50 dark:bg-black/30 rounded-2xl border border-slate-100 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/30 transition-all group/item">
                                    <svg className="w-7 h-7 text-slate-800 dark:text-white mb-3 group-hover/item:scale-110 transition-transform fill-current" viewBox="0 0 24 24">
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                    </svg>
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover/item:text-slate-900 dark:group-hover:text-white">TikTok</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Locations Section */}
                <div className="mb-20">
                    <div className="flex items-center gap-6 mb-12">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-cyan/30 to-transparent" />
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-4">
                            <div className="w-12 h-12 rounded-[1rem] bg-cyan-100 dark:bg-brand-cyan/10 text-cyan-600 dark:text-brand-cyan flex items-center justify-center">
                                <MapPin className="w-6 h-6" />
                            </div>
                            Şubelerimiz
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-cyan/30 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Branch 1 */}
                        <div className="premium-card p-10 transition-all duration-500 hover:border-brand-violet/40 bg-white/50 dark:bg-[#0a0a0a]/80 group">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-16 h-16 rounded-[1.2rem] bg-violet-100 dark:bg-brand-violet/10 text-violet-600 dark:text-brand-violet flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-brand-violet group-hover:text-white transition-all duration-500 shadow-sm">
                                    <MapPin className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Merkez Şube</h3>
                                    <p className="text-violet-600 dark:text-brand-violet font-bold uppercase tracking-widest text-sm mt-1">Mimar Sinan</p>
                                </div>
                            </div>
                            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-white/5 mb-8">
                                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed font-medium">
                                    Mimar Sinan Mh. Çavuşdere Cd. No.33/B<br />
                                    <span className="text-slate-400 font-bold">Üsküdar-İSTANBUL</span>
                                </p>
                            </div>
                            <a
                                href="https://maps.google.com/?q=Mimar+Sinan+Mh.+Çavuşdere+Cd.+No.33/B+Üsküdar-İSTANBUL"
                                target="_blank"
                                className="premium-button w-full justify-center gap-3 text-lg py-4"
                            >
                                <MapPin className="w-5 h-5" />
                                <span>Yol Tarifi Al</span>
                            </a>
                        </div>

                        {/* Branch 2 */}
                        <div className="premium-card p-10 transition-all duration-500 hover:border-brand-cyan/40 bg-white/50 dark:bg-[#0a0a0a]/80 group">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-16 h-16 rounded-[1.2rem] bg-cyan-100 dark:bg-brand-cyan/10 text-cyan-600 dark:text-brand-cyan flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-brand-cyan group-hover:text-white transition-all duration-500 shadow-sm">
                                    <MapPin className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Bulgurlu Şubesi</h3>
                                    <p className="text-cyan-600 dark:text-brand-cyan font-bold uppercase tracking-widest text-sm mt-1">Bulgurlu</p>
                                </div>
                            </div>
                            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-white/5 mb-8">
                                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed font-medium">
                                    Bulgurlu Mh. Söğütlüçayır Cd. No.14/A<br />
                                    <span className="text-slate-400 font-bold">Üsküdar-İSTANBUL</span>
                                </p>
                            </div>
                            <a
                                href="https://maps.google.com/?q=Bulgurlu+Mh.+Söğütlüçayır+Cd.+No.14/A+Üsküdar-İSTANBUL"
                                target="_blank"
                                className="premium-button w-full justify-center gap-3 text-lg py-4"
                            >
                                <MapPin className="w-5 h-5" />
                                <span>Yol Tarifi Al</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Maps Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-[450px] rounded-3xl overflow-hidden premium-card relative group p-0 border-4 border-white dark:border-[#1a1a1a]">
                        <div className="absolute top-6 left-6 z-10 bg-white/90 dark:bg-black/90 backdrop-blur-md px-5 py-3 rounded-xl shadow-lg border border-slate-200 dark:border-white/10">
                            <span className="text-slate-900 dark:text-white font-black items-center flex gap-2">
                                <span className="w-2 h-2 rounded-full bg-brand-violet animate-pulse" />
                                Merkez Şube Haritası
                            </span>
                        </div>
                        <iframe
                            src="https://maps.google.com/maps?q=Mimar%20Sinan%20Mh.%20%C3%87avu%C5%9Fdere%20Cd.%20No.33%2FB%20%C3%9Csk%C3%BCdar-%C4%B0STANBUL&t=&z=15&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            className="grayscale-[0.5] dark:grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
                        ></iframe>
                    </div>
                    <div className="h-[450px] rounded-3xl overflow-hidden premium-card relative group p-0 border-4 border-white dark:border-[#1a1a1a]">
                        <div className="absolute top-6 left-6 z-10 bg-white/90 dark:bg-black/90 backdrop-blur-md px-5 py-3 rounded-xl shadow-lg border border-slate-200 dark:border-white/10">
                            <span className="text-slate-900 dark:text-white font-black items-center flex gap-2">
                                <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
                                Bulgurlu Şubesi Haritası
                            </span>
                        </div>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.668767856789!2d29.07778092656249!3d41.01734157134935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac926d9ecc93b%3A0x5080980966e54875!2sBulgurlu%2C%20S%C3%B6%C4%9F%C3%BCtl%C3%BC%20%C3%87ay%C4%B1r%20Cd.%20No%3A14%2FA%2C%2034100%20%C3%9Csk%C3%BCdar%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1709666666666!5m2!1str!2str"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            className="grayscale-[0.5] dark:grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
}
