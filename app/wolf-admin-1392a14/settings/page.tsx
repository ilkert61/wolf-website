import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { Settings } from "lucide-react";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    let settings = await prisma.siteSettings.findFirst();

    // If no settings exist yet, provide defaults for the form
    if (!settings) {
        settings = {
            id: 0,
            exchangeThreshold: new Prisma.Decimal(10), // Example fallback
            maintenanceMode: false,
            announcementActive: false,
            announcementText: "",
            updatedAt: new Date()
        } as any;
    }

    // Convert Prisma Decimals to numbers for client components
    const plainSettings = {
        ...settings,
        exchangeThreshold: Number(settings!.exchangeThreshold)
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
                        <Settings className="w-8 h-8 text-brand-violet" />
                        Platform Ayarları
                    </h1>
                    <p className="text-slate-400 font-medium">B2B portalının temel işleyiş, döviz kuru eşikleri ve güvenlik modlarını yönetin.</p>
                </div>
            </div>

            <SiteSettingsForm initialData={plainSettings} />
        </div>
    );
}
