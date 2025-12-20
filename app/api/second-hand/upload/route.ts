
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { mkdir } from "fs/promises";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Validate File Type
        const validTypes = ["image/jpeg", "image/png", "image/webp", "image/heic"];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({ error: "Sadece resim dosyaları yüklenebilir (JPG, PNG, WEBP)" }, { status: 400 });
        }

        // Validate File Size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "Dosya boyutu 5MB'dan büyük olamaz" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create uploads directory if not exists
        const uploadDir = path.join(process.cwd(), "public", "uploads", "second-hand");
        await mkdir(uploadDir, { recursive: true });

        // Unique filename
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.name)}`;
        const filepath = path.join(uploadDir, filename);

        await writeFile(filepath, buffer);

        return NextResponse.json({ url: `/uploads/second-hand/${filename}` });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Dosya yüklenirken bir hata oluştu" },
            { status: 500 }
        );
    }
}
