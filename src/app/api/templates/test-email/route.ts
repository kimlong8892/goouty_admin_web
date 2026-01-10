
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { to, subject, html } = body;

        if (!to || !subject || !html) {
            return NextResponse.json(
                { error: "Missing required fields: to, subject, html" },
                { status: 400 }
            );
        }

        await sendEmail({ to, subject, html });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Test email failed:", error);
        return NextResponse.json(
            { error: error.message || "Failed to send test email" },
            { status: 500 }
        );
    }
}
