'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { processAndSaveImage } from '@/lib/image-upload'

// ── Validation helpers ──
const PHONE_REGEX = /^[\d\s\+\-\(\)]{10,15}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_TEXT_LENGTH = 1000;
const MAX_NAME_LENGTH = 100;

function sanitize(str: string | null, maxLen: number): string {
    if (!str) return '';
    return String(str).trim().slice(0, maxLen);
}

export async function submitFinanceRequest(formData: FormData) {
    const fullName = sanitize(formData.get('fullName') as string, MAX_NAME_LENGTH);
    const phone = sanitize(formData.get('phone') as string, 15);
    const email = sanitize(formData.get('email') as string, MAX_NAME_LENGTH);
    const deviceType = sanitize(formData.get('deviceType') as string, 50);
    const brandModel = sanitize(formData.get('brandModel') as string, MAX_NAME_LENGTH);
    const deviceCondition = sanitize(formData.get('deviceCondition') as string, 50);
    const requestedAmount = sanitize(formData.get('requestedAmount') as string, 20);
    const message = sanitize(formData.get('message') as string, MAX_TEXT_LENGTH);

    // Validation
    if (!fullName || !phone || !brandModel) {
        return { success: false, message: 'Lütfen zorunlu alanları doldurunuz.' }
    }

    if (!PHONE_REGEX.test(phone)) {
        return { success: false, message: 'Geçerli bir telefon numarası giriniz.' }
    }

    if (email && !EMAIL_REGEX.test(email)) {
        return { success: false, message: 'Geçerli bir e-posta adresi giriniz.' }
    }

    // Validate requestedAmount is a number if provided
    if (requestedAmount && (isNaN(parseFloat(requestedAmount)) || parseFloat(requestedAmount) < 0)) {
        return { success: false, message: 'Geçerli bir tutar giriniz.' }
    }

    // Image Processing (max 5)
    const photos = formData.getAll('photos') as File[]
    const uploadedImageUrls: string[] = []

    const validPhotos = photos.slice(0, 5);
    for (const file of validPhotos) {
        if (file.size > 0 && file.name !== 'undefined') {
            const result = await processAndSaveImage(file, 'finance')
            if (result.success && result.url) {
                uploadedImageUrls.push(result.url)
            }
        }
    }

    try {
        // @ts-ignore
        await prisma.financeRequest.create({
            data: {
                fullName,
                phone,
                email: email || null,
                deviceType,
                brandModel,
                deviceCondition: deviceCondition || null,
                requestedAmount: requestedAmount ? parseFloat(requestedAmount) : null,
                message: message || null,
                images: uploadedImageUrls,
            },
        })

        revalidatePath('/wolf-admin-1392a14/requests/finance')
        return { success: true, message: 'Başvurunuz başarıyla alındı.' }
    } catch (error) {
        console.error('Finance Request Error:', error)
        return { success: false, message: 'Bir hata oluştu. Lütfen tekrar deneyiniz.' }
    }
}
