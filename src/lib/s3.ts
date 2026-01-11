import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Helper to ensure endpoint has protocol
const getEndpoint = () => {
    let endpoint = process.env.AWS_ENDPOINT;
    if (!endpoint) return undefined;
    if (!endpoint.startsWith('http')) {
        return `https://${endpoint}`;
    }
    return endpoint;
};

const s3Client = new S3Client({
    region: process.env.AWS_REGION || "ap-southeast-1",
    endpoint: getEndpoint(),
    forcePathStyle: !!process.env.AWS_ENDPOINT, // Often needed for custom endpoints
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || process.env.AWS_BUCKET || "";

export async function uploadToS3(
    file: Buffer,
    fileName: string,
    contentType: string,
    folder: string = "trip-templates"
): Promise<string> {
    const key = `${folder}/${Date.now()}-${fileName}`;

    if (!BUCKET_NAME) {
        throw new Error("AWS_S3_BUCKET or AWS_BUCKET is not defined in environment variables");
    }

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: contentType,
        ACL: "public-read",
    });

    try {
        await s3Client.send(command);
    } catch (error: any) {
        console.error("S3 Upload Error Detail:", {
            bucket: BUCKET_NAME,
            key: key,
            error: error.message,
            code: error.Code || error.code
        });
        throw error;
    }

    // If a custom endpoint is provided, the URL format might differ.
    // Usually, for Cloudflare R2 or others, users might have a public CDN URL.
    if (process.env.AWS_PUBLIC_URL) {
        return `${process.env.AWS_PUBLIC_URL}/${key}`;
    }

    const endpoint = getEndpoint();
    if (endpoint) {
        const cleanEndpoint = endpoint.replace(/\/$/, "");
        // Custom endpoints often use path-style or a specific subdomain format
        // This is a common format for many S3-compatible providers
        return `${cleanEndpoint}/${BUCKET_NAME}/${key}`;
    }

    // Default AWS S3 URL
    return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "ap-southeast-1"}.amazonaws.com/${key}`;
}

export async function deleteFromS3(url: string): Promise<void> {
    try {
        let key = "";

        if (process.env.AWS_PUBLIC_URL) {
            key = url.replace(`${process.env.AWS_PUBLIC_URL}/`, "");
        } else {
            const endpoint = getEndpoint();
            if (endpoint) {
                const cleanEndpoint = endpoint.replace(/\/$/, "");
                // Handle both path-style and virtual-hosted style attempts
                key = url.replace(`${cleanEndpoint}/${BUCKET_NAME}/`, "");
                if (key === url) {
                    // If it didn't change, try without the protocol if missing or other variations
                    const pureEndpoint = cleanEndpoint.replace(/^https?:\/\//, "");
                    key = url.split(pureEndpoint).pop()?.replace(/^\/[^\/]+\//, "") || "";
                }
            } else {
                // Default AWS S3: https://bucket.s3.region.amazonaws.com/key
                const urlObj = new URL(url);
                key = urlObj.pathname.substring(1);
            }
        }

        if (!key || key === url) {
            // Fallback for any other format: take everything after the last known bucket reference or just guess from path
            const parts = url.split(`${BUCKET_NAME}/`);
            key = parts.length > 1 ? parts[1] : new URL(url).pathname.substring(1);
        }

        const command = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });

        await s3Client.send(command);
    } catch (error) {
        console.error("Error deleting from S3:", error);
    }
}

export async function getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
}
