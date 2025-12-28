import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_DIMENSION = 3000;
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');

// Magic numbers for file type validation
const MAGIC_NUMBERS = {
    jpeg: 'ffd8ff',
    png: '89504e47',
    webp: '52494646' // RIFF (first 4 bytes of WebP)
};

interface UploadResult {
    success: boolean;
    url?: string;
    error?: string;
}

// Simple in-memory rate limiter (IP -> timestamp)
// Note: In a production serverless environment like Vercel, this would need Redis.
// Since this is a VPS/Node server, in-memory works for basic protection.
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 10;
const requestLog: Record<string, number[]> = {};

export function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const timestamps = requestLog[ip] || [];

    // Filter out old timestamps
    const recentTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);

    if (recentTimestamps.length >= MAX_REQUESTS_PER_MINUTE) {
        return false;
    }

    recentTimestamps.push(now);
    requestLog[ip] = recentTimestamps;
    return true;
}

async function validateFileHeader(buffer: Buffer): Promise<boolean> {
    const hex = buffer.toString('hex', 0, 4);

    // Check against magic numbers
    // JPEG
    if (hex.startsWith(MAGIC_NUMBERS.jpeg)) return true;
    // PNG
    if (hex.startsWith(MAGIC_NUMBERS.png)) return true;
    // WebP (RIFF....WEBP) - checks 'RIFF'
    if (hex.startsWith(MAGIC_NUMBERS.webp)) return true;

    return false;
}

export async function processAndSaveImage(
    file: File,
    subDirectory: string = 'general'
): Promise<UploadResult> {
    try {
        // 1. Basic Size Check
        if (file.size > MAX_FILE_SIZE) {
            return { success: false, error: 'Dosya boyutu 5 MB\'ı geçemez.' };
        }

        // 2. MIME Type Check
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            return { success: false, error: 'Sadece JPG, PNG ve WebP formatları desteklenir.' };
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // 3. Magic Number Validation
        const isValidHeader = await validateFileHeader(buffer);
        if (!isValidHeader) {
            return { success: false, error: 'Geçersiz dosya formatı.' };
        }

        // 4. Processing with Sharp
        const image = sharp(buffer);
        const metadata = await image.metadata();

        if (!metadata.width || !metadata.height) {
            return { success: false, error: 'Görüntü verisi okunamadı.' };
        }

        // Resize if needed
        if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
            image.resize({
                width: MAX_DIMENSION,
                height: MAX_DIMENSION,
                fit: 'inside',
                withoutEnlargement: true
            });
        }

        // 5. Compress & Strip EXIF
        const processedBuffer = await image
            .rotate() // Auto-rotate based on EXIF before stripping
            .webp({ quality: 80 }) // Convert everything to optimized WebP
            .keepMetadata().toBuffer().then(buf => sharp(buf).toBuffer()); // Double pass: 1. Rotate (uses EXIF) 2. Strip EXIF

        // 6. Save File
        const filename = `${uuidv4()}.webp`;
        const targetDir = path.join(UPLOAD_DIR, subDirectory);

        await fs.mkdir(targetDir, { recursive: true });
        await fs.writeFile(path.join(targetDir, filename), processedBuffer);

        return {
            success: true,
            url: `/uploads/${subDirectory}/${filename}`
        };

    } catch (error) {
        console.error('Image upload error:', error);
        return { success: false, error: 'Dosya işlenirken bir hata oluştu.' };
    }
}
