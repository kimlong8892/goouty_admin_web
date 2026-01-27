import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized - Please login" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { url } = body;

        if (!url) {
            return NextResponse.json(
                { error: "URL is required" },
                { status: 400 }
            );
        }

        // Validate URL format
        try {
            new URL(url);
        } catch {
            return NextResponse.json(
                { error: "Invalid URL format" },
                { status: 400 }
            );
        }

        // Check if URL already exists in pending
        const existingPending = await prisma.pendingTripTemplate.findUnique({
            where: { url }
        });

        if (existingPending) {
            if (existingPending.status === "PENDING" || existingPending.status === "PROCESSING") {
                return NextResponse.json(
                    { error: "This URL is already being processed" },
                    { status: 409 }
                );
            }

            if (existingPending.status === "COMPLETED") {
                return NextResponse.json(
                    {
                        error: "Template from this URL already exists",
                        tripTemplateId: existingPending.tripTemplateId
                    },
                    { status: 409 }
                );
            }

            // If FAILED, we can allow retry by updating the existing record
            if (existingPending.status === "FAILED") {
                const updated = await prisma.pendingTripTemplate.update({
                    where: { id: existingPending.id },
                    data: {
                        status: "PENDING",
                        error: null,
                        tripTemplateId: null,
                        updatedAt: new Date()
                    }
                });

                return NextResponse.json({
                    message: "Template creation request resubmitted successfully",
                    pendingId: updated.id
                }, { status: 200 });
            }
        }

        // Create new pending template
        const pendingTemplate = await prisma.pendingTripTemplate.create({
            data: {
                url,
                status: "PENDING"
            }
        });

        return NextResponse.json({
            message: "Template creation request submitted successfully. It will be processed shortly.",
            pendingId: pendingTemplate.id
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating pending template:", error);
        return NextResponse.json(
            {
                error: "Failed to submit template creation request",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}
