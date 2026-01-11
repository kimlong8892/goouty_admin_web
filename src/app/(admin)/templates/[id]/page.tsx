import "reflect-metadata";
import { initializeDataSource } from "@/lib/typeorm";
import { Template } from "@/entities/Template";
import TemplateForm from "../_components/TemplateForm";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const dataSource = await initializeDataSource();
    const repo = dataSource.getRepository("Template");
    const template = await repo.findOne({ where: { id } }) as Template | null;

    return {
        title: template ? `Edit ${template.title}` : "Edit Template",
    };
}

export default async function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const dataSource = await initializeDataSource();
    const repo = dataSource.getRepository("Template");
    const template = await repo.findOne({ where: { id } });

    if (!template) {
        return <div>Template not found</div>;
    }

    // Convert to plain object if needed, though TypeORM entities are usually fine in SC -> CC if simple
    // But Dates need to be handled if passed to Client Component as props if strict serialization check is on
    // Next.js handles Date serialization automatically in recent versions for Server Components -> Client Components props?
    // Usually it warns. Safe to pass plain object or let Next.js serialize. 
    // TypeORM Entity instance might have methods, best to spread.

    return <TemplateForm initialData={JSON.parse(JSON.stringify(template))} />;
}
