import { NextRequest, NextResponse } from "next/server";
import { initializeDataSource } from "@/lib/typeorm";
import { TripTemplateDay } from "@/entities/TripTemplateDay";

// GET days for a template
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const dataSource = await initializeDataSource();
        const dayRepo = dataSource.getRepository(TripTemplateDay);

        const days = await dayRepo.find({
            where: { tripTemplateId: id },
            relations: { activities: true },
            order: {
                dayOrder: "ASC",
                activities: { activityOrder: "ASC" },
            },
        });

        return NextResponse.json(days);
    } catch (error) {
        console.error("Error fetching days:", error);
        return NextResponse.json(
            { error: "Failed to fetch days" },
            { status: 500 }
        );
    }
}

// POST create new day
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const dataSource = await initializeDataSource();
        const dayRepo = dataSource.getRepository(TripTemplateDay);
        const body = await request.json();

        const day = dayRepo.create({
            id: crypto.randomUUID(),
            title: body.title,
            description: body.description,
            dayOrder: body.dayOrder,
            tripTemplateId: id,
        });

        await dayRepo.save(day);

        return NextResponse.json(day, { status: 201 });
    } catch (error) {
        console.error("Error creating day:", error);
        return NextResponse.json(
            { error: "Failed to create day" },
            { status: 500 }
        );
    }
}
