import { NextRequest, NextResponse } from "next/server";
import { initializeDataSource } from "@/lib/typeorm";
import { TripTemplateActivity } from "@/entities/TripTemplateActivity";

// PUT update activity
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; dayId: string; activityId: string }> }
) {
    try {
        const { activityId } = await params;
        const dataSource = await initializeDataSource();
        const activityRepo = dataSource.getRepository(TripTemplateActivity);
        const body = await request.json();

        const activity = await activityRepo.findOne({ where: { id: activityId } });

        if (!activity) {
            return NextResponse.json(
                { error: "Activity not found" },
                { status: 404 }
            );
        }

        activityRepo.merge(activity, {
            title: body.title,
            startTime: body.startTime,
            durationMin: body.durationMin,
            location: body.location,
            notes: body.notes,
            important: body.important,
            activityOrder: body.activityOrder,
        });

        await activityRepo.save(activity);

        return NextResponse.json(activity);
    } catch (error) {
        console.error("Error updating activity:", error);
        return NextResponse.json(
            { error: "Failed to update activity" },
            { status: 500 }
        );
    }
}

// DELETE activity
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; dayId: string; activityId: string }> }
) {
    try {
        const { activityId } = await params;
        const dataSource = await initializeDataSource();
        const activityRepo = dataSource.getRepository(TripTemplateActivity);

        const activity = await activityRepo.findOne({ where: { id: activityId } });

        if (!activity) {
            return NextResponse.json(
                { error: "Activity not found" },
                { status: 404 }
            );
        }

        await activityRepo.remove(activity);

        return NextResponse.json({ message: "Activity deleted successfully" });
    } catch (error) {
        console.error("Error deleting activity:", error);
        return NextResponse.json(
            { error: "Failed to delete activity" },
            { status: 500 }
        );
    }
}
