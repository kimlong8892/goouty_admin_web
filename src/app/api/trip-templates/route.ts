import { NextRequest, NextResponse } from "next/server";
import { ILike } from "typeorm";
import { initializeDataSource } from "@/lib/typeorm";
import { TripTemplate } from "@/entities/TripTemplate";
import { parseTripTemplateFormData } from "@/lib/template-utils";
import { TripTemplateDay } from "@/entities/TripTemplateDay";
import { TripTemplateActivity } from "@/entities/TripTemplateActivity";
import { Province } from "@/entities/Province";

// GET all templates
export async function GET(request: NextRequest) {
    try {
        const dataSource = await initializeDataSource();
        const tripTemplateRepo = dataSource.getRepository<TripTemplate>("TripTemplate");

        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search") || "";
        const provinceId = searchParams.get("provinceId") || "";
        const isPublic = searchParams.get("isPublic");

        const skip = (page - 1) * limit;

        const commonWhere: any = {};

        if (provinceId) {
            commonWhere.provinceId = provinceId;
        }

        if (isPublic !== null && isPublic !== undefined) {
            commonWhere.isPublic = isPublic === "true";
        }

        let whereCondition = commonWhere;

        if (search) {
            whereCondition = [
                { ...commonWhere, title: ILike(`%${search}%`) },
                { ...commonWhere, description: ILike(`%${search}%`) }
            ];
        }

        const [templates, total] = await tripTemplateRepo.findAndCount({
            where: whereCondition,
            relations: {
                province: true,
                days: true,
            },
            order: {
                createdAt: "DESC",
            },
            skip,
            take: limit,
        });

        return NextResponse.json({
            data: templates,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching templates:", error);
        return NextResponse.json(
            { error: "Failed to fetch templates" },
            { status: 500 }
        );
    }
}

// POST create new template
export async function POST(request: NextRequest) {
    try {
        const dataSource = await initializeDataSource();
        const tripTemplateRepo = dataSource.getRepository<TripTemplate>("TripTemplate");

        const body = await parseTripTemplateFormData(request);

        const templateId = crypto.randomUUID();

        // Patch FKs for cascade
        let days = body.days || [];
        if (days && Array.isArray(days)) {
            days = days.map((day: any) => {
                day.tripTemplateId = templateId;

                // Ensure dates are actual Date objects to avoid "date/time field value out of range"
                if (day.createdAt) day.createdAt = new Date(day.createdAt);
                if (day.updatedAt) day.updatedAt = new Date(day.updatedAt);

                if (day.activities && Array.isArray(day.activities)) {
                    day.activities = day.activities.map((activity: any) => {
                        activity.dayId = day.id;

                        if (activity.createdAt) activity.createdAt = new Date(activity.createdAt);
                        if (activity.updatedAt) activity.updatedAt = new Date(activity.updatedAt);

                        return activity;
                    });
                }
                return day;
            });
        }

        const template = tripTemplateRepo.create({
            id: templateId,
            title: body.title,
            description: body.description,
            provinceId: body.provinceId || null,
            isPublic: body.isPublic || false,
            avatar: body.avatar,
            fee: body.fee || 0,
            days: days,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await tripTemplateRepo.save(template);

        return NextResponse.json(template, { status: 201 });
    } catch (error) {
        console.error("Error creating template:", error);
        return NextResponse.json(
            { error: "Failed to create template" },
            { status: 500 }
        );
    }
}
