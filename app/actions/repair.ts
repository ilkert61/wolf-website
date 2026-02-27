'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { processAndSaveImage } from '@/lib/image-upload'

// ── Validation helpers ──
const PHONE_REGEX = /^[\d\s\+\-\(\)]{10,15}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_TEXT_LENGTH = 500;
const MAX_NAME_LENGTH = 100;

function sanitize(str: string | null, maxLen: number): string {
    if (!str) return '';
    return String(str).trim().slice(0, maxLen);
}

export async function submitRepairRequest(formData: FormData) {
    const fullName = sanitize(formData.get('fullName') as string, MAX_NAME_LENGTH);
    const phone = sanitize(formData.get('phone') as string, 15);
    const email = sanitize(formData.get('email') as string, MAX_NAME_LENGTH);
    const deviceType = sanitize(formData.get('deviceType') as string, 50);
    const brandModel = sanitize(formData.get('brandModel') as string, MAX_NAME_LENGTH);
    const problemDescription = sanitize(formData.get('problemDescription') as string, MAX_TEXT_LENGTH);
    const mediaUrl = sanitize(formData.get('mediaUrl') as string, MAX_TEXT_LENGTH);

    // Validation
    if (!fullName || !phone || !brandModel || !problemDescription) {
        return { success: false, message: 'Lütfen zorunlu alanları doldurunuz.' }
    }

    if (!PHONE_REGEX.test(phone)) {
        return { success: false, message: 'Geçerli bir telefon numarası giriniz.' }
    }

    if (email && !EMAIL_REGEX.test(email)) {
        return { success: false, message: 'Geçerli bir e-posta adresi giriniz.' }
    }

    // Handle Photo Uploads (max 3)
    const photos = formData.getAll('photos') as File[]
    const photoPaths: string[] = []

    const validPhotos = photos.slice(0, 3); // Hard cap at 3
    for (const photo of validPhotos) {
        if (photo instanceof File && photo.size > 0 && photo.name !== 'undefined') {
            const result = await processAndSaveImage(photo, 'repair')
            if (result.success && result.url) {
                photoPaths.push(result.url)
            }
        }
    }

    try {
        // @ts-ignore
        await prisma.repairRequest.create({
            data: {
                fullName,
                phone,
                email: email || null,
                deviceType,
                brandModel,
                problemDescription,
                mediaUrl: mediaUrl || null,
                images: photoPaths,
            },
        })

        revalidatePath('/wolf-admin-1392a14/requests/repair')
        return { success: true, message: 'Tamir talebiniz başarıyla alındı.' }
    } catch (error) {
        console.error('Repair Request Error:', error)
        return { success: false, message: 'Bir hata oluştu. Lütfen tekrar deneyiniz.' }
    }
}
