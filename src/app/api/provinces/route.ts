import { NextResponse } from "next/server";
import { initializeDataSource } from "@/lib/typeorm";
import { Province } from "@/entities/Province";

export async function GET() {
    try {
        const dataSource = await initializeDataSource();
        const provinceRepo = dataSource.getRepository(Province);

        const provinces = await provinceRepo.find({
            order: { name: "ASC" },
        });

        return NextResponse.json(provinces);
    } catch (error) {
        console.error("Error fetching provinces:", error);
        return NextResponse.json(
            { error: "Failed to fetch provinces" },
            { status: 500 }
        );
    }
}
