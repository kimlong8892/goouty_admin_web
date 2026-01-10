import { NextResponse } from "next/server";
import { initializeDataSource } from "@/lib/typeorm";
import { Template } from "@/entities/Template";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const dataSource = await initializeDataSource();
        const repo = dataSource.getRepository("Template");

        const template = await repo.findOne({ where: { id } });
        if (!template) {
            return NextResponse.json({ error: "Template not found" }, { status: 404 });
        }

        return NextResponse.json(template);
    } catch (error) {
        console.error("Error fetching template:", error);
        return NextResponse.json({ error: "Failed to fetch template" }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const dataSource = await initializeDataSource();
        const repo = dataSource.getRepository("Template");

        let template = await repo.findOne({ where: { id } });
        if (!template) {
            return NextResponse.json({ error: "Template not found" }, { status: 404 });
        }

        // Update fields
        repo.merge(template, body);
        const result = await repo.save(template);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error updating template:", error);
        return NextResponse.json({ error: "Failed to update template" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const dataSource = await initializeDataSource();
        const repo = dataSource.getRepository("Template");

        const result = await repo.delete(id);
        if (result.affected === 0) {
            return NextResponse.json({ error: "Template not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting template:", error);
        return NextResponse.json({ error: "Failed to delete template" }, { status: 500 });
    }
}
