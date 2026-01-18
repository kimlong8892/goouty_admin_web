import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/s3";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Validate file type (optional, or more permissive)
        const allowedTypes = [
            "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml",
            "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/plain", "application/zip"
        ];

        // If we want to allow EVERYTHING, we can comment out the check, but let's keep some safety
        // if (!allowedTypes.includes(file.type)) {
        //     return NextResponse.json(
        //         { error: "Invalid file type." },
        //         { status: 400 }
        //     );
        // }

        const folder = (formData.get("folder") as string) || "uploads";

        // Validate file size (max 10MB for general files)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "File size exceeds 10MB limit" },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const url = await uploadToS3(buffer, file.name, file.type, folder);

        return NextResponse.json({ url });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            { error: "Failed to upload file" },
            { status: 500 }
        );
    }
}
