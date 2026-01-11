import { NextRequest, NextResponse } from "next/server";
import { initializeDataSource } from "@/lib/typeorm";
import { TripTemplateActivity } from "@/entities/TripTemplateActivity";

// GET activities for a day
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; dayId: string }> }
) {
    try {
        const { dayId } = await params;
        const dataSource = await initializeDataSource();
        const activityRepo = dataSource.getRepository(TripTemplateActivity);

        const activities = await activityRepo.find({
            where: { dayId },
            order: { activityOrder: "ASC" },
        });

        return NextResponse.json(activities);
    } catch (error) {
        console.error("Error fetching activities:", error);
        return NextResponse.json(
            { error: "Failed to fetch activities" },
            { status: 500 }
        );
    }
}

// POST create new activity
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; dayId: string }> }
) {
    try {
        const { dayId } = await params;
        const dataSource = await initializeDataSource();
        const activityRepo = dataSource.getRepository(TripTemplateActivity);
        const body = await request.json();

        const activity = activityRepo.create({
            id: crypto.randomUUID(),
            title: body.title,
            startTime: body.startTime,
            durationMin: body.durationMin,
            location: body.location,
            notes: body.notes,
            important: body.important || false,
            activityOrder: body.activityOrder,
            dayId,
        });

        await activityRepo.save(activity);

        return NextResponse.json(activity, { status: 201 });
    } catch (error) {
        console.error("Error creating activity:", error);
        return NextResponse.json(
            { error: "Failed to create activity" },
            { status: 500 }
        );
    }
}
