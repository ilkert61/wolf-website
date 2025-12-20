"use client";

import { useState, useEffect } from "react";
import { FileText, Clock, CheckCircle, XCircle, Eye, Trash2, Search, Filter, Smartphone, Laptop, Tablet, Watch } from "lucide-react";

interface FinanceApplication {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    deviceType: string;
    brandModel: string;
    estimatedValue: string | null;
    message: string | null;
    status: string;
    adminNotes: string | null;
    createdAt: string;
}

const statusColors: Record<string, string> = {
    "Beklemede": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    "İnceleniyor": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "Onaylandı": "bg-green-500/20 text-green-400 border-green-500/30",
    "Reddedildi": "bg-red-500/20 text-red-400 border-red-500/30",
};

const deviceIcons: Record<string, React.ReactNode> = {
    "Telefon": <Smartphone className="w-5 h-5" />,
    "Laptop": <Laptop className="w-5 h-5" />,
    "Tablet": <Tablet className="w-5 h-5" />,
    "Akıllı Saat": <Watch className="w-5 h-5" />,
};

export default function FinanceApplicationsPage() {
    const [applications, setApplications] = useState<FinanceApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<FinanceApplication | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchApplications();
    }, [filterStatus]);

    const fetchApplications = async () => {
        try {
            const url = filterStatus === "all"
                ? "/api/finance-applications"
                : `/api/finance-applications?status=${filterStatus}`;
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setApplications(data);
            }
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: number, newStatus: string) => {
        try {
            const res = await fetch(`/api/finance-applications/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                fetchApplications();
                if (selectedApp?.id === id) {
                    setSelectedApp({ ...selectedApp, status: newStatus });
                }
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const deleteApplication = async (id: number) => {
        if (!confirm("Bu başvuruyu silmek istediğinizden emin misiniz?")) return;

        try {
            const res = await fetch(`/api/finance-applications/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchApplications();
                if (selectedApp?.id === id) {
                    setSelectedApp(null);
                }
            }
        } catch (error) {
            console.error("Error deleting application:", error);
        }
    };

    const filteredApps = applications.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone.includes(searchTerm) ||
        app.brandModel.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === "Beklemede").length,
        approved: applications.filter(a => a.status === "Onaylandı").length,
        rejected: applications.filter(a => a.status === "Reddedildi").length,
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Finans Başvuruları</h1>
                    <p className="text-gray-400 mt-1">Elektronik finans başvurularını yönetin</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                    <div className="text-gray-400 text-sm">Toplam</div>
                    <div className="text-2xl font-bold">{stats.total}</div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
                    <div className="text-yellow-400 text-sm">Beklemede</div>
                    <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
                    <div className="text-green-400 text-sm">Onaylandı</div>
                    <div className="text-2xl font-bold text-green-400">{stats.approved}</div>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                    <div className="text-red-400 text-sm">Reddedildi</div>
                    <div className="text-2xl font-bold text-red-400">{stats.rejected}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="İsim, telefon veya cihaz ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500"
                >
                    <option value="all">Tüm Durumlar</option>
                    <option value="Beklemede">Beklemede</option>
                    <option value="İnceleniyor">İnceleniyor</option>
                    <option value="Onaylandı">Onaylandı</option>
                    <option value="Reddedildi">Reddedildi</option>
                </select>
            </div>

            {/* Applications List */}
            {loading ? (
                <div className="text-center py-12 text-gray-400">Yükleniyor...</div>
            ) : filteredApps.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                    <FileText className="w-12 h-12 mx-auto text-gray-500 mb-4" />
                    <p className="text-gray-400">Henüz başvuru bulunmuyor.</p>
                </div>
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-black/30">
                            <tr>
                                <th className="text-left p-4 text-gray-400 font-medium">Müşteri</th>
                                <th className="text-left p-4 text-gray-400 font-medium">Cihaz</th>
                                <th className="text-left p-4 text-gray-400 font-medium hidden md:table-cell">Telefon</th>
                                <th className="text-left p-4 text-gray-400 font-medium">Durum</th>
                                <th className="text-left p-4 text-gray-400 font-medium hidden lg:table-cell">Tarih</th>
                                <th className="text-right p-4 text-gray-400 font-medium">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredApps.map((app) => (
                                <tr key={app.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium">{app.name}</div>
                                        <div className="text-sm text-gray-400 md:hidden">{app.phone}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-blue-400">{deviceIcons[app.deviceType] || <Smartphone className="w-5 h-5" />}</span>
                                            <div>
                                                <div className="text-sm">{app.deviceType}</div>
                                                <div className="text-xs text-gray-400">{app.brandModel}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 hidden md:table-cell text-gray-300">{app.phone}</td>
                                    <td className="p-4">
                                        <select
                                            value={app.status}
                                            onChange={(e) => updateStatus(app.id, e.target.value)}
                                            className={`text-sm px-3 py-1.5 rounded-lg border ${statusColors[app.status]} bg-transparent cursor-pointer`}
                                        >
                                            <option value="Beklemede">Beklemede</option>
                                            <option value="İnceleniyor">İnceleniyor</option>
                                            <option value="Onaylandı">Onaylandı</option>
                                            <option value="Reddedildi">Reddedildi</option>
                                        </select>
                                    </td>
                                    <td className="p-4 hidden lg:table-cell text-gray-400 text-sm">
                                        {new Date(app.createdAt).toLocaleDateString("tr-TR")}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedApp(app)}
                                                className="p-2 hover:bg-white/10 rounded-lg text-blue-400"
                                                title="Detayları Gör"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteApplication(app.id)}
                                                className="p-2 hover:bg-white/10 rounded-lg text-red-400"
                                                title="Sil"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Detail Modal */}
            {selectedApp && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a1a] p-8 rounded-2xl w-full max-w-lg border border-white/10 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold">{selectedApp.name}</h2>
                                <p className="text-gray-400">{selectedApp.phone}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-lg text-sm border ${statusColors[selectedApp.status]}`}>
                                {selectedApp.status}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white/5 p-4 rounded-xl">
                                <div className="text-gray-400 text-sm mb-1">Cihaz</div>
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-400">{deviceIcons[selectedApp.deviceType]}</span>
                                    <span className="font-medium">{selectedApp.deviceType} - {selectedApp.brandModel}</span>
                                </div>
                            </div>

                            {selectedApp.estimatedValue && (
                                <div className="bg-white/5 p-4 rounded-xl">
                                    <div className="text-gray-400 text-sm mb-1">Tahmini Değer</div>
                                    <div className="font-medium text-green-400">₺{selectedApp.estimatedValue}</div>
                                </div>
                            )}

                            {selectedApp.email && (
                                <div className="bg-white/5 p-4 rounded-xl">
                                    <div className="text-gray-400 text-sm mb-1">E-posta</div>
                                    <div>{selectedApp.email}</div>
                                </div>
                            )}

                            {selectedApp.message && (
                                <div className="bg-white/5 p-4 rounded-xl">
                                    <div className="text-gray-400 text-sm mb-1">Mesaj</div>
                                    <div className="whitespace-pre-wrap">{selectedApp.message}</div>
                                </div>
                            )}

                            <div className="bg-white/5 p-4 rounded-xl">
                                <div className="text-gray-400 text-sm mb-1">Başvuru Tarihi</div>
                                <div>{new Date(selectedApp.createdAt).toLocaleString("tr-TR")}</div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                            >
                                Kapat
                            </button>
                            <a
                                href={`tel:${selectedApp.phone}`}
                                className="flex-1 px-4 py-3 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-xl transition-colors text-center"
                            >
                                Ara
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
