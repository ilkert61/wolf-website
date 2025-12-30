'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { processAndSaveImage } from '@/lib/image-upload'

export async function submitRepairRequest(formData: FormData) {
    const fullName = formData.get('fullName') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string
    const deviceType = formData.get('deviceType') as string
    const brandModel = formData.get('brandModel') as string
    const problemDescription = formData.get('problemDescription') as string
    const mediaUrl = formData.get('mediaUrl') as string

    // Handle Photo Uploads
    const photos = formData.getAll('photos') as File[]
    const photoPaths: string[] = []

    for (const photo of photos) {
        if (photo instanceof File && photo.size > 0 && photo.name !== 'undefined') {
            const result = await processAndSaveImage(photo, 'repair')
            if (result.success && result.url) {
                photoPaths.push(result.url)
            }
        }
    }

    // Combine mediaUrl logic (Video Link + Uploaded Photos)
    // Now stored in a more structured way if needed, but keeping the string format for now as per schema "mediaUrl String?"
    const finalMediaUrl = [
        mediaUrl ? `Video: ${mediaUrl}` : null,
        photoPaths.length > 0 ? `Fotos: ${photoPaths.join(', ')}` : null
    ].filter(Boolean).join(' | ')

    if (!fullName || !phone || !brandModel || !problemDescription) {
        return { success: false, message: 'Lütfen zorunlu alanları doldurunuz.' }
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
