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

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EditTemplatePage(props: PageProps) {
    const { id } = await props.params;
    const searchParams = await props.searchParams;
    const dataSource = await initializeDataSource();
    const repo = dataSource.getRepository("Template");
    const template = await repo.findOne({ where: { id } });

    if (!template) {
        return <div>Template not found</div>;
    }

    return <TemplateForm initialData={JSON.parse(JSON.stringify(template))} returnParams={searchParams} />;
}
