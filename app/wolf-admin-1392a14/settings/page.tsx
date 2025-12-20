"use client";

import { useState, useEffect } from "react";
import { Save, Globe, Mail, Phone, MapPin, Instagram, Facebook, Twitter, Youtube, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("general");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        siteName: "",
        description: "",
        contactEmail: "",
        contactPhone: "",
        address: "",
        socialMedia: {
            instagram: "",
            facebook: "",
            twitter: "",
            youtube: "",
            tiktok: ""
        },
        maintenanceMode: false
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/settings");
            const data = await res.json();

            if (data.id) {
                setFormData({
                    siteName: data.siteName || "",
                    description: data.description || "",
                    contactEmail: data.contactEmail || "",
                    contactPhone: data.contactPhone || "",
                    address: data.address || "",
                    socialMedia: data.socialMedia ? JSON.parse(data.socialMedia) : { instagram: "", facebook: "", twitter: "", youtube: "", tiktok: "" },
                    maintenanceMode: data.maintenanceMode || false
                });
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSocialChange = (key: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            socialMedia: {
                ...prev.socialMedia,
                [key]: value
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);

        try {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("Ayarlar kaydedilirken bir hata oluştu.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-gray-400 p-8">Yükleniyor...</div>;

    const tabs = [
        { id: "general", label: "Genel", icon: Globe },
        { id: "contact", label: "İletişim", icon: Mail },
        { id: "social", label: "Sosyal Medya", icon: Instagram },
        { id: "system", label: "Sistem", icon: AlertTriangle },
    ];

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Site Ayarları</h1>
                <p className="text-gray-400">Web sitesinin genel yapılandırmasını yönetin.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Tabs */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeTab === tab.id
                                    ? "bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20 shadow-glow-sm-cyan font-medium"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 space-y-6">
                    <div className="glass-card p-6 md:p-8 rounded-3xl min-h-[500px]">
                        {/* GENERAL TAB */}
                        {activeTab === "general" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <h2 className="text-xl font-bold text-white mb-4 border-b border-white/5 pb-4">Genel Bilgiler</h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Site Başlığı</label>
                                    <input
                                        type="text"
                                        value={formData.siteName}
                                        onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-cyber-cyan transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Site Açıklaması (Meta Description)</label>
                                    <textarea
                                        rows={4}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-cyber-cyan transition-colors"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* CONTACT TAB */}
                        {activeTab === "contact" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <h2 className="text-xl font-bold text-white mb-4 border-b border-white/5 pb-4">İletişim Bilgileri</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">E-posta Adresi</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                            <input
                                                type="email"
                                                value={formData.contactEmail}
                                                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-cyber-cyan transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Telefon Numarası</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                            <input
                                                type="text"
                                                value={formData.contactPhone}
                                                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-cyber-cyan transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Açık Adres</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                                        <textarea
                                            rows={3}
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-cyber-cyan transition-colors"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* SOCIAL TAB */}
                        {activeTab === "social" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <h2 className="text-xl font-bold text-white mb-4 border-b border-white/5 pb-4">Sosyal Medya Hesapları</h2>

                                <div className="space-y-4">
                                    {[
                                        { key: 'instagram', icon: Instagram, label: "Instagram" },
                                        { key: 'facebook', icon: Facebook, label: "Facebook" },
                                        { key: 'twitter', icon: Twitter, label: "Twitter / X" },
                                        { key: 'youtube', icon: Youtube, label: "YouTube" }
                                    ].map((item) => (
                                        <div key={item.key}>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">{item.label}</label>
                                            <div className="relative">
                                                <item.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                                <input
                                                    type="text"
                                                    // @ts-ignore
                                                    value={formData.socialMedia[item.key]}
                                                    onChange={(e) => handleSocialChange(item.key, e.target.value)}
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-cyber-cyan transition-colors"
                                                    placeholder={`https://${item.key}.com/...`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* SYSTEM TAB */}
                        {activeTab === "system" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <h2 className="text-xl font-bold text-white mb-4 border-b border-white/5 pb-4">Sistem Ayarları</h2>

                                <div className="flex items-center justify-between p-6 bg-red-500/5 border border-red-500/20 rounded-2xl">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                                            <AlertTriangle className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1">Bakım Modu</h3>
                                            <p className="text-gray-400 text-sm">Siteyi bakım moduna alır. Sadece adminler siteye erişebilir.</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={formData.maintenanceMode}
                                            onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                                        />
                                        <div className="w-14 h-7 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-500"></div>
                                    </label>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-cyan-500/20 transition-all ${success
                                    ? "bg-cyber-emerald text-surface-dark"
                                    : "bg-gradient-cyber text-surface-dark hover:scale-105"
                                }`}
                        >
                            {success ? (
                                <>
                                    <CheckCircle2 className="w-6 h-6" />
                                    Kaydedildi
                                </>
                            ) : (
                                <>
                                    <Save className="w-6 h-6" />
                                    {saving ? "Kaydediliyor..." : "Ayarları Kaydet"}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
