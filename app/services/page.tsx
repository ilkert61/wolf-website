import { Monitor, Cpu, Wrench, ShieldCheck, Server, Headphones } from "lucide-react";

export default function ServicesPage() {
    const services = [
        {
            icon: <Monitor className="w-10 h-10" />,
            title: "Özel PC Toplama",
            description: "İhtiyaçlarınıza ve bütçenize uygun, oyun veya iş istasyonu için özel bilgisayarlar topluyoruz.",
            color: "cyan",
            gradient: "from-cyan-500/20 to-cyan-500/5"
        },
        {
            icon: <Wrench className="w-10 h-10" />,
            title: "Tamir & Bakım",
            description: "Bilgisayarlarınız için profesyonel tamir, temizlik ve termal macun yenileme hizmetleri.",
            color: "emerald",
            gradient: "from-emerald-500/20 to-emerald-500/5"
        },
        {
            icon: <Cpu className="w-10 h-10" />,
            title: "Donanım Yükseltme",
            description: "Eski bilgisayarınızı en yeni donanımlarla güçlendirerek performansını artırın.",
            color: "violet",
            gradient: "from-violet-500/20 to-violet-500/5"
        },
        {
            icon: <ShieldCheck className="w-10 h-10" />,
            title: "Virüs Temizleme",
            description: "Kapsamlı virüs taraması ve temizliği ile verilerinizi ve güvenliğinizi koruyun.",
            color: "rose",
            gradient: "from-rose-500/20 to-rose-500/5"
        },
        {
            icon: <Server className="w-10 h-10" />,
            title: "Ağ Kurulumu",
            description: "Ev ve ofisler için güvenli ve hızlı kablolu/kablosuz ağ çözümleri.",
            color: "amber",
            gradient: "from-amber-500/20 to-amber-500/5"
        },
        {
            icon: <Headphones className="w-10 h-10" />,
            title: "Teknik Destek",
            description: "Yazılım ve donanım sorunlarınız için 7/24 uzman teknik destek.",
            color: "cyan",
            gradient: "from-cyan-500/20 to-cyan-500/5"
        }
    ];

    const colorMap: { [key: string]: string } = {
        cyan: "text-cyber-cyan border-cyber-cyan/30 hover:border-cyber-cyan/60 hover:shadow-glow-cyan",
        emerald: "text-cyber-emerald border-cyber-emerald/30 hover:border-cyber-emerald/60 hover:shadow-glow-emerald",
        violet: "text-cyber-violet border-cyber-violet/30 hover:border-cyber-violet/60 hover:shadow-glow-violet",
        rose: "text-rose-500 border-rose-500/30 hover:border-rose-500/60 hover:shadow-[0_0_30px_rgba(244,63,94,0.4)]",
        amber: "text-amber-500 border-amber-500/30 hover:border-amber-500/60 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]"
    };

    return (
        <div className="container mx-auto px-4 py-24 pt-32">
            {/* Hero Section */}
            <div className="text-center mb-20 relative">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyber-cyan/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="relative">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyber-violet/30 mb-6">
                        <span className="w-2 h-2 rounded-full bg-cyber-violet pulse-glow" />
                        <span className="text-sm font-medium text-cyber-violet">Profesyonel Çözümler</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black mb-6">
                        <span className="text-white">Hizmet</span>{" "}
                        <span className="gradient-text">Portföyümüz</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Teknoloji dünyasındaki tüm ihtiyaçlarınız için{" "}
                        <span className="text-cyber-cyan font-semibold">profesyonel çözümler</span> sunuyoruz.
                    </p>
                </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className={`group glass-card p-8 rounded-3xl transition-all duration-500 ${colorMap[service.color]}`}
                    >
                        {/* Icon */}
                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                            <span className={colorMap[service.color].split(' ')[0]}>
                                {service.icon}
                            </span>
                        </div>

                        {/* Content */}
                        <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-cyber-cyan transition-colors">
                            {service.title}
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                            {service.description}
                        </p>

                        {/* Corner Decoration */}
                        <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-white/0 group-hover:border-white/10 rounded-tr-3xl transition-all duration-500" />
                    </div>
                ))}
            </div>

            {/* CTA Section */}
            <div className="mt-20 text-center">
                <div className="glass-card rounded-3xl p-12 max-w-3xl mx-auto relative overflow-hidden">
                    {/* Background Gradient */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-cyan/10 rounded-full blur-[80px]" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyber-violet/10 rounded-full blur-[80px]" />

                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                            <span className="text-white">Özel bir projeniz mi var?</span>
                        </h2>
                        <p className="text-gray-400 mb-8">
                            Uzman ekibimizle iletişime geçin, size özel çözümler sunalım.
                        </p>
                        <a
                            href="/contact"
                            className="cyber-button inline-flex items-center gap-2"
                        >
                            <span>Teklif Alın</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
