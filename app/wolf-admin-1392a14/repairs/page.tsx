import prisma from "@/lib/prisma";
import Link from "next/link";
import { Wrench, Search, Smartphone, Calendar, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RepairsPage() {
    // @ts-ignore
    const requests = await prisma.repairRequest.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Teknik Servis Başvuruları</h1>
                    <p className="text-gray-400 mt-1">Cihaz tamir ve bakım taleplerini yönetin.</p>
                </div>
            </div>

            <div className="bg-[#16181d] border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/5 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="İsim, telefon veya cihaz ara..."
                            className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400 text-sm font-medium">
                            <tr>
                                <th className="px-6 py-4">Müşteri</th>
                                <th className="px-6 py-4">Cihaz</th>
                                <th className="px-6 py-4">Sorun</th>
                                <th className="px-6 py-4">Tarih</th>
                                <th className="px-6 py-4">Durum</th>
                                <th className="px-6 py-4 text-right">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {requests.map((req: any) => (
                                <tr key={req.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{req.fullName}</div>
                                        <div className="text-sm text-gray-500">{req.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-white">
                                            <Smartphone className="w-4 h-4 text-gray-500" />
                                            {req.brandModel}
                                        </div>
                                        <div className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded inline-block mt-1">
                                            {req.deviceType}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-300 max-w-xs truncate" title={req.problemDescription}>
                                            {req.problemDescription}
                                        </div>
                                        {/* @ts-ignore */}
                                        {req.images && req.images.length > 0 && (
                                            <span className="text-xs text-blue-400 flex items-center gap-1 mt-1">
                                                <Eye className="w-3 h-3" />
                                                {req.images.length} Fotoğraf
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(req.createdAt).toLocaleDateString('tr-TR')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${req.status === 'Beklemede' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                                                req.status === 'İnceleniyor' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                                    req.status === 'Tamamlandı' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                                        'bg-gray-500/10 border-gray-500/20 text-gray-400'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/wolf-admin-1392a14/repairs/${req.id}`}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-all text-sm font-medium"
                                        >
                                            <Eye className="w-4 h-4" />
                                            İncele
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {requests.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <Wrench className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        Henüz teknik servis başvurusu bulunmuyor.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
