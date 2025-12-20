"use client";

import { Phone, MapPin, Facebook, Instagram, ArrowRight, MessageCircle } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen pb-20 pt-24">
            {/* Hero Section */}
            <div className="relative py-16 overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-cyan/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-violet/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyber-emerald/30 mb-6">
                        <span className="w-2 h-2 rounded-full bg-cyber-emerald pulse-glow" />
                        <span className="text-sm font-medium text-cyber-emerald">7/24 Destek</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-6">
                        <span className="text-white">Bize</span>{" "}
                        <span className="gradient-text">Ulaşın</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Teknoloji çözümlerimiz hakkında bilgi almak veya destek talepleriniz için yanınızdayız.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl">
                {/* Primary Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {/* WhatsApp Card */}
                    <div className="group glass-card rounded-3xl p-8 transition-all duration-500 hover:border-cyber-emerald/50 hover:shadow-glow-emerald relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <MessageCircle className="w-24 h-24 text-cyber-emerald" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <MessageCircle className="w-7 h-7 text-cyber-emerald" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">WhatsApp Destek</h3>
                            <p className="text-gray-400 mb-6">Hızlı yanıt için bize WhatsApp üzerinden yazın.</p>
                            <div className="space-y-3">
                                <a href="https://wa.me/905343398185" target="_blank" className="flex items-center justify-between p-4 glass rounded-xl hover:bg-cyber-emerald/10 hover:border-cyber-emerald/30 transition-all group/item">
                                    <span className="font-mono text-cyber-emerald">0534 339 81 85</span>
                                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover/item:text-cyber-emerald group-hover/item:translate-x-1 transition-all" />
                                </a>
                                <a href="https://wa.me/905528841934" target="_blank" className="flex items-center justify-between p-4 glass rounded-xl hover:bg-cyber-emerald/10 hover:border-cyber-emerald/30 transition-all group/item">
                                    <span className="font-mono text-cyber-emerald">0552 884 19 34</span>
                                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover/item:text-cyber-emerald group-hover/item:translate-x-1 transition-all" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Phone Card */}
                    <div className="group glass-card rounded-3xl p-8 transition-all duration-500 hover:border-cyber-cyan/50 hover:shadow-glow-cyan relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Phone className="w-24 h-24 text-cyber-cyan" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Phone className="w-7 h-7 text-cyber-cyan" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Müşteri Hizmetleri</h3>
                            <p className="text-gray-400 mb-6">Mesai saatleri içinde bizi arayabilirsiniz.</p>
                            <a href="tel:+902163433577" className="flex items-center justify-between p-4 glass rounded-xl hover:bg-cyber-cyan/10 hover:border-cyber-cyan/30 transition-all group/item">
                                <span className="font-mono text-cyber-cyan text-lg">0216 343 35 77</span>
                                <div className="w-10 h-10 rounded-full bg-cyber-cyan/20 flex items-center justify-center group-hover/item:bg-cyber-cyan group-hover/item:text-surface-dark transition-colors">
                                    <Phone className="w-5 h-5" />
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Social Media Card */}
                    <div className="group glass-card rounded-3xl p-8 transition-all duration-500 hover:border-cyber-violet/50 hover:shadow-glow-violet relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Instagram className="w-24 h-24 text-cyber-violet" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Instagram className="w-7 h-7 text-cyber-violet" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Sosyal Medya</h3>
                            <p className="text-gray-400 mb-6">Bizi sosyal medya hesaplarımızdan takip edin.</p>
                            <div className="grid grid-cols-3 gap-3">
                                <a href="https://www.instagram.com/wolfbilisimservis" target="_blank" className="flex flex-col items-center justify-center p-4 glass rounded-xl hover:bg-pink-500/10 hover:border-pink-500/30 transition-all group/item">
                                    <Instagram className="w-6 h-6 text-pink-500 mb-2 group-hover/item:scale-110 transition-transform" />
                                    <span className="text-xs text-gray-400 group-hover/item:text-white">Instagram</span>
                                </a>
                                <a href="https://www.facebook.com/profile.php?id=61582518813874" target="_blank" className="flex flex-col items-center justify-center p-4 glass rounded-xl hover:bg-blue-600/10 hover:border-blue-600/30 transition-all group/item">
                                    <Facebook className="w-6 h-6 text-blue-500 mb-2 group-hover/item:scale-110 transition-transform" />
                                    <span className="text-xs text-gray-400 group-hover/item:text-white">Facebook</span>
                                </a>
                                <a href="https://www.tiktok.com/@wolf.bilisim" target="_blank" className="flex flex-col items-center justify-center p-4 glass rounded-xl hover:bg-white/10 hover:border-white/30 transition-all group/item">
                                    <svg className="w-6 h-6 text-white mb-2 group-hover/item:scale-110 transition-transform fill-current" viewBox="0 0 24 24">
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                    </svg>
                                    <span className="text-xs text-gray-400 group-hover/item:text-white">TikTok</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Locations Section */}
                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyber-cyan/30 to-transparent" />
                        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                            <MapPin className="w-8 h-8 text-cyber-cyan" />
                            Şubelerimiz
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyber-cyan/30 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Branch 1 */}
                        <div className="glass-card rounded-3xl p-8 transition-all duration-500 hover:border-cyber-violet/40">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-cyber-violet" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">Merkez Şube</h3>
                                    <p className="text-cyber-violet font-medium">Mimar Sinan</p>
                                </div>
                            </div>
                            <p className="text-gray-400 text-lg leading-relaxed mb-6">
                                Mimar Sinan Mh. Çavuşdere Cd. No.33/B<br />
                                Üsküdar-İSTANBUL
                            </p>
                            <a
                                href="https://maps.google.com/?q=Mimar+Sinan+Mh.+Çavuşdere+Cd.+No.33/B+Üsküdar-İSTANBUL"
                                target="_blank"
                                className="cyber-button inline-flex items-center gap-2 w-full justify-center"
                            >
                                <MapPin className="w-4 h-4" />
                                <span>Yol Tarifi Al</span>
                            </a>
                        </div>

                        {/* Branch 2 */}
                        <div className="glass-card rounded-3xl p-8 transition-all duration-500 hover:border-cyber-cyan/40">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-cyber-cyan" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">Bulgurlu Şubesi</h3>
                                    <p className="text-cyber-cyan font-medium">Bulgurlu</p>
                                </div>
                            </div>
                            <p className="text-gray-400 text-lg leading-relaxed mb-6">
                                Bulgurlu Mh. Söğütlüçayır Cd. No.14/A<br />
                                Üsküdar-İSTANBUL
                            </p>
                            <a
                                href="https://maps.google.com/?q=Bulgurlu+Mh.+Söğütlüçayır+Cd.+No.14/A+Üsküdar-İSTANBUL"
                                target="_blank"
                                className="cyber-button inline-flex items-center gap-2 w-full justify-center"
                            >
                                <MapPin className="w-4 h-4" />
                                <span>Yol Tarifi Al</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Maps Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-[400px] rounded-3xl overflow-hidden glass-card relative group">
                        <div className="absolute top-4 left-4 z-10 glass px-4 py-2 rounded-lg">
                            <span className="text-white font-bold text-sm">Merkez Şube Haritası</span>
                        </div>
                        <iframe
                            src="https://maps.google.com/maps?q=Mimar%20Sinan%20Mh.%20%C3%87avu%C5%9Fdere%20Cd.%20No.33%2FB%20%C3%9Csk%C3%BCdar-%C4%B0STANBUL&t=&z=15&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            className="grayscale group-hover:grayscale-0 transition-all duration-700"
                        ></iframe>
                    </div>
                    <div className="h-[400px] rounded-3xl overflow-hidden glass-card relative group">
                        <div className="absolute top-4 left-4 z-10 glass px-4 py-2 rounded-lg">
                            <span className="text-white font-bold text-sm">Bulgurlu Şubesi Haritası</span>
                        </div>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.668767856789!2d29.07778092656249!3d41.01734157134935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac926d9ecc93b%3A0x5080980966e54875!2sBulgurlu%2C%20S%C3%B6%C4%9F%C3%BCtl%C3%BC%20%C3%87ay%C4%B1r%20Cd.%20No%3A14%2FA%2C%2034100%20%C3%9Csk%C3%BCdar%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1709666666666!5m2!1str!2str"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            className="grayscale group-hover:grayscale-0 transition-all duration-700"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
}
