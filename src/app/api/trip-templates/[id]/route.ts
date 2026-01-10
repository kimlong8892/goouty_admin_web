import { NextRequest, NextResponse } from "next/server";
import { In } from "typeorm";
import { initializeDataSource } from "@/lib/typeorm";
import { TripTemplate } from "@/entities/TripTemplate";
import { TripTemplateDay } from "@/entities/TripTemplateDay";
import { TripTemplateActivity } from "@/entities/TripTemplateActivity";
import { Province } from "@/entities/Province";
import { deleteFromS3 } from "@/lib/s3";

// GET single template
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const dataSource = await initializeDataSource();
        const tripTemplateRepo = dataSource.getRepository<TripTemplate>("TripTemplate");

        const template = await tripTemplateRepo.findOne({
            where: { id },
            relations: {
                province: true,
                days: {
                    activities: true,
                },
            },
            order: {
                days: {
                    dayOrder: "ASC",
                    activities: {
                        activityOrder: "ASC",
                    },
                },
            },
        });

        if (!template) {
            return NextResponse.json(
                { error: "Template not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(template);
    } catch (error) {
        console.error("Error fetching template:", error);
        return NextResponse.json(
            { error: "Failed to fetch template" },
            { status: 500 }
        );
    }
}

// PUT update template
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const dataSource = await initializeDataSource();
        const tripTemplateRepo = dataSource.getRepository<TripTemplate>("TripTemplate");
        const dayRepo = dataSource.getRepository<TripTemplateDay>("TripTemplateDay");
        const activityRepo = dataSource.getRepository<TripTemplateActivity>("TripTemplateActivity");

        const body = await request.json();

        const template = await tripTemplateRepo.findOne({
            where: { id },
            relations: { days: { activities: true } }
        });

        if (!template) {
            return NextResponse.json(
                { error: "Template not found" },
                { status: 404 }
            );
        }

        // If avatar is being updated and old one exists, delete old one from S3
        if (body.avatar && template.avatar && body.avatar !== template.avatar) {
            try {
                await deleteFromS3(template.avatar);
            } catch (error) {
                console.error("Error deleting old avatar:", error);
            }
        }

        // Handle deletion of removed days
        const existingDayIds = template.days.map(d => d.id);
        const incomingDayIds = body.days ? body.days.map((d: any) => d.id) : [];
        const daysToDelete = existingDayIds.filter(id => !incomingDayIds.includes(id));

        if (daysToDelete.length > 0) {
            await dayRepo.delete({ id: In(daysToDelete) });
        }

        // Handle deletion of removed activities in remaining days
        if (body.days) {
            for (const incomingDay of body.days) {
                const existingDay = template.days.find(d => d.id === incomingDay.id);
                if (existingDay) {
                    const existingActivityIds = existingDay.activities.map(a => a.id);
                    const incomingActivityIds = incomingDay.activities ? incomingDay.activities.map((a: any) => a.id) : [];
                    const activitiesToDelete = existingActivityIds.filter(id => !incomingActivityIds.includes(id));

                    if (activitiesToDelete.length > 0) {
                        await activityRepo.delete({ id: In(activitiesToDelete) });
                    }
                }
            }
        }

        // Update basic fields
        template.title = body.title;
        template.description = body.description;
        template.provinceId = body.provinceId;
        template.isPublic = body.isPublic;
        template.avatar = body.avatar;
        template.fee = body.fee;
        template.updatedAt = new Date();

        // Update days (cascade will handle update/insert of days and activities)
        if (body.days) {
            template.days = body.days;
        }

        await tripTemplateRepo.save(template);

        return NextResponse.json(template);
    } catch (error) {
        console.error("Error updating template:", error);
        return NextResponse.json(
            { error: "Failed to update template" },
            { status: 500 }
        );
    }
}

// DELETE template
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const dataSource = await initializeDataSource();
        const tripTemplateRepo = dataSource.getRepository<TripTemplate>("TripTemplate");

        const template = await tripTemplateRepo.findOne({ where: { id } });

        if (!template) {
            return NextResponse.json(
                { error: "Template not found" },
                { status: 404 }
            );
        }

        // Delete avatar from S3 if exists
        if (template.avatar) {
            try {
                await deleteFromS3(template.avatar);
            } catch (error) {
                console.error("Error deleting avatar:", error);
            }
        }

        await tripTemplateRepo.remove(template);

        return NextResponse.json({ message: "Template deleted successfully" });
    } catch (error) {
        console.error("Error deleting template:", error);
        return NextResponse.json(
            { error: "Failed to delete template" },
            { status: 500 }
        );
    }
}
