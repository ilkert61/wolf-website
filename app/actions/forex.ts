"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// TCMB or Free Currency API
export async function getLiveRates() {
    try {
        // Fetching USD to TRY
        const usdRes = await fetch("https://api.frankfurter.app/latest?from=USD&to=TRY", { cache: 'no-store' });
        const usdData = await usdRes.json();
        const usdRate = usdData.rates.TRY;

        // Fetching EUR to TRY
        const eurRes = await fetch("https://api.frankfurter.app/latest?from=EUR&to=TRY", { cache: 'no-store' });
        const eurData = await eurRes.json();
        const eurRate = eurData.rates.TRY;

        return { USD: usdRate, EUR: eurRate, TRY: 1 };
    } catch (error) {
        console.error("Döviz kurları çekilirken hata oluştu:", error);
        return null;
    }
}

export async function syncProductPrices(adminId?: number) {
    try {
        const rates = await getLiveRates();
        if (!rates) return { success: false, message: "Canlı döviz kurları çekilemedi. Bağlantıyı kontrol edin." };

        // Get Global Settings for Threshold (Default to 10%)
        const settings = await prisma.siteSettings.findFirst();
        const thresholdPercent = settings?.exchangeThreshold ? Number(settings.exchangeThreshold) : 10;
        const thresholdDec = thresholdPercent / 100;

        // Fetch products indexed to foreign currencies
        const products = await prisma.product.findMany({
            where: {
                currency: { in: ["USD", "EUR"] },
                basePrice: { not: null }
            }
        });

        let updatedCount = 0;

        for (const product of products) {
            if (!product.basePrice) continue;

            const basePrice = Number(product.basePrice);
            const currencyKey = product.currency as keyof typeof rates;
            const liveRate = rates[currencyKey];

            const currentUsedRate = Number(product.exchangeRateUsed || liveRate);

            // Calculate percentage difference between the live rate and the rate last used to price the product
            const diff = Math.abs(liveRate - currentUsedRate) / currentUsedRate;

            // If the difference exceeds our threshold (e.g., 10%) or it's the first time setting it
            if (diff >= thresholdDec || !product.exchangeRateUsed) {
                const oldPrice = Number(product.price);
                const newPrice = Math.round(basePrice * liveRate); // Yuvarlanmış net fiyat

                await prisma.product.update({
                    where: { id: product.id },
                    data: {
                        price: newPrice,
                        exchangeRateUsed: liveRate
                    }
                });

                // Audit Trail: Log the change
                await prisma.priceLog.create({
                    data: {
                        productId: product.id,
                        oldPrice: oldPrice,
                        newPrice: newPrice,
                        currency: product.currency,
                        reason: `SİSTEM OTO: Kur (Eski: ${currentUsedRate.toFixed(2)}, Yeni: ${liveRate.toFixed(2)}) %${thresholdPercent} eşiğini aştı.`,
                        adminId: adminId || null
                    }
                });

                // Also log to ActivityLog for complete transparency
                await prisma.activityLog.create({
                    data: {
                        adminId: adminId || null,
                        action: "Oto Fiyat Güncellemesi",
                        details: JSON.stringify({ productId: product.id, old: oldPrice, new: newPrice, rate: liveRate }),
                    }
                });

                updatedCount++;
            }
        }

        revalidatePath("/products");
        revalidatePath("/admin/products");

        return {
            success: true,
            message: `${updatedCount} ürünün TL fiyatı güncel döviz kuruna (%${thresholdPercent} eşik) göre senkronize edildi.`,
            rates
        };

    } catch (error: any) {
        console.error("Senkronizasyon hatası:", error);
        return { success: false, message: error.message || "Bilinmeyen bir hata oluştu." };
    }
}
