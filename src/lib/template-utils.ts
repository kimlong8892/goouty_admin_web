import { NextRequest } from "next/server";
import { uploadToS3 } from "@/lib/s3";

export async function parseTripTemplateFormData(request: NextRequest) {
    const formData = await request.formData();
    const dataString = formData.get("data") as string;

    if (!dataString) {
        throw new Error("Missing 'data' field in FormData");
    }

    let body = JSON.parse(dataString);

    // 1. Handle Main Avatar
    const mainFile = formData.get("avatarFile") as File | null;
    if (mainFile && mainFile.size > 0) {
        console.log(`Uploading main avatar: ${mainFile.name}`);
        const buffer = Buffer.from(await mainFile.arrayBuffer());
        const url = await uploadToS3(buffer, mainFile.name, mainFile.type);
        body.avatar = url;
    }

    // 2. Handle Activity Avatars
    if (body.days && Array.isArray(body.days)) {
        for (const day of body.days) {
            if (day.activities && Array.isArray(day.activities)) {
                for (const activity of day.activities) {
                    const activityFileKey = `activity_avatar_${activity.id}`;
                    const activityFile = formData.get(activityFileKey) as File | null;

                    if (activityFile && activityFile.size > 0) {
                        console.log(`Found avatar file for activity ${activity.id}: ${activityFile.name}`);
                        const buffer = Buffer.from(await activityFile.arrayBuffer());
                        const url = await uploadToS3(buffer, activityFile.name, activityFile.type);
                        console.log(`Uploaded activity avatar to: ${url}`);
                        activity.avatar = url;
                    }
                }
            }
        }
    }

    // Clean up activity files from body if they somehow got in (optional safety)
    return body;
}
