import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { processAndSaveImage } from "@/lib/image-upload";

export async function POST(request: Request) {
    // Session protection - only authenticated admins can upload
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Use secure image processing with validation
        const result = await processAndSaveImage(file, "products");

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        return NextResponse.json({ url: result.url });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Failed to upload file" },
            { status: 500 }
        );
    }
}
