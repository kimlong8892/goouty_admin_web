import { NextRequest, NextResponse } from "next/server";
import { initializeDataSource } from "@/lib/typeorm";
import { TripTemplateDay } from "@/entities/TripTemplateDay";

// PUT update day
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; dayId: string }> }
) {
    try {
        const { dayId } = await params;
        const dataSource = await initializeDataSource();
        const dayRepo = dataSource.getRepository(TripTemplateDay);
        const body = await request.json();

        const day = await dayRepo.findOne({ where: { id: dayId } });

        if (!day) {
            return NextResponse.json(
                { error: "Day not found" },
                { status: 404 }
            );
        }

        dayRepo.merge(day, {
            title: body.title,
            description: body.description,
            dayOrder: body.dayOrder,
        });

        await dayRepo.save(day);

        return NextResponse.json(day);
    } catch (error) {
        console.error("Error updating day:", error);
        return NextResponse.json(
            { error: "Failed to update day" },
            { status: 500 }
        );
    }
}

// DELETE day
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; dayId: string }> }
) {
    try {
        const { dayId } = await params;
        const dataSource = await initializeDataSource();
        const dayRepo = dataSource.getRepository(TripTemplateDay);

        const day = await dayRepo.findOne({ where: { id: dayId } });

        if (!day) {
            return NextResponse.json(
                { error: "Day not found" },
                { status: 404 }
            );
        }

        await dayRepo.remove(day);

        return NextResponse.json({ message: "Day deleted successfully" });
    } catch (error) {
        console.error("Error deleting day:", error);
        return NextResponse.json(
            { error: "Failed to delete day" },
            { status: 500 }
        );
    }
}
