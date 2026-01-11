
// Utility for sending emails
import nodemailer from "nodemailer";

interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SSL === "true", // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: `"${process.env.SMTP_SENDER || process.env.SMTP_USER}" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });
        console.log("Message sent: %s", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};
