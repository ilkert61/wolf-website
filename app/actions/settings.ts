"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSiteSettings() {
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
        settings = await prisma.siteSettings.create({
            data: {
                exchangeThreshold: 10,
                maintenanceMode: false,
                announcementActive: false,
                announcementText: ""
            }
        });
    }
    return settings;
}

export async function updateSiteSettings(data: {
    exchangeThreshold: number;
    maintenanceMode: boolean;
    announcementActive: boolean;
    announcementText: string;
}, adminId?: number) {
    try {
        let settings = await prisma.siteSettings.findFirst();
        if (!settings) {
            settings = await prisma.siteSettings.create({ data });
        } else {
            settings = await prisma.siteSettings.update({
                where: { id: settings.id },
                data
            });
        }

        if (adminId) {
            await prisma.activityLog.create({
                data: {
                    action: "Site Ayarları Güncellendi",
                    details: `Yeni Eşik: %${data.exchangeThreshold}, Bakım Modu: ${data.maintenanceMode ? 'Açık' : 'Kapalı'}`,
                    adminId
                }
            });
        }

        revalidatePath("/");
        revalidatePath("/wolf-admin-1392a14");

        return { success: true, message: "Ayarlar başarıyla kaydedildi.", settings };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
