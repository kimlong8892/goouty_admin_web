import { NextResponse } from "next/server";
import { initializeDataSource } from "@/lib/typeorm";
import { Template } from "@/entities/Template";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const dataSource = await initializeDataSource();
        const repo = dataSource.getRepository("Template");

        // Validate code uniqueness
        const existing = await repo.findOne({ where: { code: body.code } });
        if (existing) {
            return NextResponse.json({ error: "Template with this code already exists" }, { status: 400 });
        }

        const template = repo.create(body);
        await repo.save(template);

        return NextResponse.json(template);
    } catch (error) {
        console.error("Error creating template:", error);
        return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
    }
}
