import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, User, Phone, Mail, Smartphone, AlertCircle, Calendar, MessageSquare, Save, Image as ImageIcon } from "lucide-react";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function updateStatus(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    const status = formData.get("status") as string;
    const adminNotes = formData.get("adminNotes") as string;

    // @ts-ignore
    await prisma.repairRequest.update({
        where: { id },
        data: { status, adminNotes },
    });

    redirect("/wolf-admin-1392a14/repairs");
}

export default async function RepairDetailPage({ params }: { params: { id: string } }) {
    const id = Number(params.id);
    // @ts-ignore
    const request = await prisma.repairRequest.findUnique({
        where: { id },
    });

    if (!request) return notFound();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/wolf-admin-1392a14/repairs"
                    className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Talep Detayı #{request.id}</h1>
                    <div className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(request.createdAt).toLocaleString('tr-TR')}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Device & Problem */}
                    <div className="bg-[#16181d] border border-white/5 rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Smartphone className="w-5 h-5 text-blue-400" />
                            Cihaz ve Arıza Bilgileri
                        </h2>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                                <div className="text-xs text-gray-500 mb-1">Cihaz Türü</div>
                                <div className="text-white font-medium">{request.deviceType}</div>
                            </div>
                            <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                                <div className="text-xs text-gray-500 mb-1">Marka / Model</div>
                                <div className="text-white font-medium">{request.brandModel}</div>
                            </div>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                            <h3 className="text-red-400 text-sm font-bold mb-2 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Arıza Açıklaması
                            </h3>
                            <p className="text-white/90 leading-relaxed whitespace-pre-wrap">
                                {request.problemDescription}
                            </p>
                        </div>
                    </div>

                    {/* Photos */}
                    <div className="bg-[#16181d] border border-white/5 rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-purple-400" />
                            Yüklenen Fotoğraflar
                        </h2>

                        {/* @ts-ignore */}
                        {request.images && request.images.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {/* @ts-ignore */}
                                {request.images.map((img: string, idx: number) => (
                                    <a
                                        key={idx}
                                        href={img}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group cursor-zoom-in"
                                    >
                                        <img
                                            src={img}
                                            alt={`Repair Photo ${idx + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded backdrop-blur-md">
                                                Büyüt
                                            </span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-white/5 rounded-xl">
                                <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p>Fotoğraf yüklenmemiş</p>
                            </div>
                        )}

                        {/* External Media Link */}
                        {request.mediaUrl && !request.mediaUrl.startsWith("Foto") && (
                            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                <span className="text-xs text-blue-400 font-bold block mb-1">Harici Medya Linki</span>
                                <a href={request.mediaUrl} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-white hover:underline text-sm break-all">
                                    {request.mediaUrl}
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Info & Actions */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-[#16181d] border border-white/5 rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-green-400" />
                            Müşteri Bilgileri
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Ad Soyad</div>
                                <div className="text-white font-medium flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-600" />
                                    {request.fullName}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Telefon</div>
                                <div className="text-white font-medium flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-600" />
                                    <a href={`tel:${request.phone}`} className="hover:text-blue-400 transition-colors">{request.phone}</a>
                                </div>
                            </div>
                            {request.email && (
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">E-posta</div>
                                    <div className="text-white font-medium flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-600" />
                                        <a href={`mailto:${request.email}`} className="hover:text-blue-400 transition-colors break-all">{request.email}</a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="bg-[#16181d] border border-white/5 rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-yellow-400" />
                            Yönetim Paneli
                        </h2>

                        <form action={updateStatus} className="space-y-4">
                            <input type="hidden" name="id" value={request.id} />

                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Durum</label>
                                <select
                                    name="status"
                                    defaultValue={request.status}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                                >
                                    <option value="Beklemede" className="bg-[#16181d]">Beklemede</option>
                                    <option value="İnceleniyor" className="bg-[#16181d]">İnceleniyor</option>
                                    <option value="Fiyat Verildi" className="bg-[#16181d]">Fiyat Verildi</option>
                                    <option value="Onaylandı" className="bg-[#16181d]">Onaylandı</option>
                                    <option value="Tamirde" className="bg-[#16181d]">Tamirde</option>
                                    <option value="Tamamlandı" className="bg-[#16181d]">Tamamlandı</option>
                                    <option value="İptal Edildi" className="bg-[#16181d]">İptal Edildi</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Notlar</label>
                                <textarea
                                    name="adminNotes"
                                    defaultValue={request.adminNotes || ""}
                                    rows={4}
                                    placeholder="Yönetici notları..."
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Kaydet ve Güncelle
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
