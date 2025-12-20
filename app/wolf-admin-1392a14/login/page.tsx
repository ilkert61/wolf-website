"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";

export default function AdminLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                router.push("/wolf-admin-1392a14/dashboard");
            } else {
                setError("Geçersiz kullanıcı adı veya şifre");
            }
        } catch (err) {
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black/90">
            <div className="w-full max-w-md p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
                <div className="text-center mb-8">
                    <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain mx-auto mb-4" />
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                        Wolf Bilişim Admin
                    </h1>
                    <p className="text-gray-400 mt-2">Devam etmek için giriş yapın</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Kullanıcı Adı
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-white"
                                placeholder="Kullanıcı adınızı girin"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Şifre
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-white"
                                placeholder="Şifrenizi girin"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                    >
                        Giriş Yap
                    </button>
                </form>
            </div>
        </div>
    );
}
