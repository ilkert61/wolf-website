'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { processAndSaveImage } from '@/lib/image-upload'

export async function submitFinanceRequest(formData: FormData) {
    const fullName = formData.get('fullName') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string
    const deviceType = formData.get('deviceType') as string
    const brandModel = formData.get('brandModel') as string
    const deviceCondition = formData.get('deviceCondition') as string
    const requestedAmount = formData.get('requestedAmount') as string
    const message = formData.get('message') as string

    // Image Processing
    const photos = formData.getAll('photos') as File[]
    const uploadedImageUrls: string[] = []

    for (const file of photos) {
        if (file.size > 0 && file.name !== 'undefined') {
            const result = await processAndSaveImage(file, 'finance')
            if (result.success && result.url) {
                uploadedImageUrls.push(result.url)
            }
        }
    }

    if (!fullName || !phone || !brandModel) {
        return { success: false, message: 'Lütfen zorunlu alanları doldurunuz.' }
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

        revalidatePath('/admin/requests/finance')
        return { success: true, message: 'Başvurunuz başarıyla alındı.' }
    } catch (error) {
        console.error('Finance Request Error:', error)
        return { success: false, message: 'Bir hata oluştu. Lütfen tekrar deneyiniz.' }
    }
}
