import { initializeDataSource } from "@/lib/typeorm";
import { TripTemplate } from "@/entities/TripTemplate";
import { Province } from "@/entities/Province";
import TripTemplateForm from "../_components/TripTemplateForm";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params;
    const dataSource = await initializeDataSource();
    const tripTemplateRepo = dataSource.getRepository<TripTemplate>("TripTemplate");
    const template = await tripTemplateRepo.findOne({
        where: { id: params.id }
    });

    return {
        title: template ? `Edit ${template.title}` : "Edit Trip Template",
    };
}

export default async function TripTemplateFormPage(props: PageProps) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const isEdit = params.id !== "new";
    const dataSource = await initializeDataSource();

    // Fetch Provinces
    const provinceRepo = dataSource.getRepository<Province>("Province");
    const provinces = await provinceRepo.find({
        order: { name: "ASC" }
    });

    let initialData = undefined;

    if (isEdit) {
        const tripTemplateRepo = dataSource.getRepository<TripTemplate>("TripTemplate");
        const template = await tripTemplateRepo.findOne({
            where: { id: params.id },
            relations: {
                days: {
                    activities: true
                }
            }
        });

        if (!template) {
            notFound();
        }

        initialData = {
            title: template.title,
            description: template.description || "",
            provinceId: template.provinceId || "",
            isPublic: template.isPublic,
            avatar: template.avatar || "",
            fee: Number(template.fee),
            days: (template.days || []).map(day => ({
                id: day.id,
                title: day.title,
                description: day.description || "",
                dayOrder: day.dayOrder,
                activities: (day.activities || []).map(activity => ({
                    id: activity.id,
                    title: activity.title,
                    startTime: activity.startTime || "",
                    durationMin: activity.durationMin ?? 60,
                    location: activity.location || "",
                    notes: activity.notes || "",
                    avatar: activity.avatar || "",
                    important: activity.important,
                    activityOrder: activity.activityOrder,
                })).sort((a, b) => a.activityOrder - b.activityOrder),
            })).sort((a, b) => a.dayOrder - b.dayOrder),
        };
    }

    return (
        <TripTemplateForm
            initialData={initialData}
            id={isEdit ? params.id : undefined}
            provinces={provinces.map(p => ({ id: p.id, name: p.name }))}
            returnParams={searchParams}
        />
    );
}
