import { NextRequest, NextResponse } from "next/server";
import { initializeDataSource } from "@/lib/typeorm";
import { TripTemplate } from "@/entities/TripTemplate";
import { TripTemplateDay } from "@/entities/TripTemplateDay";
import { TripTemplateActivity } from "@/entities/TripTemplateActivity";

export async function POST(request: NextRequest) {
    try {
        const templatesData = await request.json();

        if (!Array.isArray(templatesData)) {
            return NextResponse.json(
                { error: "Invalid data format. Expected an array of templates." },
                { status: 400 }
            );
        }

        const dataSource = await initializeDataSource();

        const createdTemplates: TripTemplate[] = [];

        await dataSource.transaction(async (transactionalEntityManager) => {
            for (const tData of templatesData) {
                // Create Template
                const template = new TripTemplate();
                template.id = crypto.randomUUID();
                template.title = tData.title || "Untitled Template";
                template.description = tData.description;
                template.fee = tData.fee || 0;
                template.isPublic = tData.isPublic;
                template.provinceId = tData.provinceId || null;
                template.createdAt = new Date();
                template.updatedAt = new Date();

                // Create Days
                const days: TripTemplateDay[] = [];
                if (tData.days && Array.isArray(tData.days)) {
                    for (const dData of tData.days) {
                        const day = new TripTemplateDay();
                        day.id = crypto.randomUUID();
                        day.dayOrder = dData.dayOrder;
                        day.title = dData.title || `Day ${dData.dayOrder}`;
                        day.description = dData.description;

                        const activities: TripTemplateActivity[] = [];
                        if (dData.activities && Array.isArray(dData.activities)) {
                            for (const aData of dData.activities) {
                                const activity = new TripTemplateActivity();
                                activity.id = crypto.randomUUID();
                                activity.activityOrder = aData.activityOrder;
                                activity.title = aData.title || "Untitled Activity";
                                activity.startTime = aData.startTime;
                                activity.durationMin = aData.durationMin;
                                activity.location = aData.location;
                                activity.notes = aData.notes;
                                activity.important = aData.important;
                                activities.push(activity);
                            }
                        }
                        day.activities = activities;
                        days.push(day);
                    }
                }
                template.days = days;

                const savedTemplate = await transactionalEntityManager.save("TripTemplate", template);
                createdTemplates.push(savedTemplate);
            }
        });

        return NextResponse.json({
            message: `Successfully imported ${createdTemplates.length} templates`,
            count: createdTemplates.length
        });

    } catch (error) {
        console.error("Error importing templates:", error);
        return NextResponse.json(
            { error: "Failed to import templates", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
