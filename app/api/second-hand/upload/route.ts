import { NextResponse } from "next/server";
import { processAndSaveImage } from "@/lib/image-upload";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const result = await processAndSaveImage(file, "second-hand");

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        return NextResponse.json({ url: result.url });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Dosya yüklenirken bir hata oluştu" },
            { status: 500 }
        );
    }
}
