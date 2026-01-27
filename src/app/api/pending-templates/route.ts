import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const status = searchParams.get("status") || "";

        const skip = (page - 1) * limit;

        const where: any = {};
        if (status) {
            where.status = status;
        }

        const [pendingTemplates, total] = await Promise.all([
            prisma.pendingTripTemplate.findMany({
                where,
                include: {
                    tripTemplate: {
                        select: {
                            id: true,
                            title: true,
                            avatar: true,
                        }
                    }
                },
                skip,
                take: limit,
            }),
            prisma.pendingTripTemplate.count({ where })
        ]);

        return NextResponse.json({
            data: pendingTemplates,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching pending templates:", error);
        return NextResponse.json(
            { error: "Failed to fetch pending templates" },
            { status: 500 }
        );
    }
}
