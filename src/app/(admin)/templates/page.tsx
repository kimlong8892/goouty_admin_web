import Link from "next/link";
import { initializeDataSource } from "@/lib/typeorm";
import { Template } from "@/entities/Template";
import DeleteTemplateButton from "./_components/DeleteTemplateButton";
import ScrollToHighlight from "@/components/common/ScrollToHighlight";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Templates",
};


interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TemplatesPage(props: PageProps) {
    const searchParams = await props.searchParams;
    const dataSource = await initializeDataSource();
    const templateRepo = dataSource.getRepository("Template");

    const templates = await templateRepo.find({
        order: {
            createdAt: "DESC",
        },
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                        Templates
                    </h1>
                    <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
                        Manage system templates for notifications and emails.
                    </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Link
                        href={{
                            pathname: "/templates/new",
                            query: searchParams,
                        }}
                        className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-brand-600 px-8 py-4 font-bold text-white shadow-[0_20px_40px_-15px_rgba(54,65,245,0.3)] transition-all hover:scale-[1.02] hover:shadow-brand-500/40 active:scale-95"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-500 group-hover:translate-x-full -translate-x-full" />
                        <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New Template
                    </Link>
                </div>
            </div>

            <ScrollToHighlight />

            {/* Main Content */}
            {
                templates.length === 0 ? (
                    <div className="group relative flex flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border-2 border-dashed border-gray-200 bg-white p-20 text-center transition-all hover:border-primary/50 dark:border-gray-800 dark:bg-gray-900">
                        <div className="relative mb-6">
                            <div className="absolute -inset-4 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-all duration-500" />
                            <div className="relative rounded-3xl bg-gray-50 p-8 dark:bg-gray-800">
                                <svg className="h-12 w-12 text-gray-400 group-hover:text-primary transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">No templates found</h3>
                        <p className="mt-2 max-w-sm text-gray-500">Get started by creating your first template.</p>
                        <Link
                            href="/templates/new"
                            className="mt-8 rounded-xl bg-gray-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-black"
                        >
                            Create Your First Template
                        </Link>
                    </div>
                ) : (
                    <div className="max-w-full overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-xl shadow-gray-200/50 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[700px]">
                                <thead>
                                    <tr className="border-b border-gray-50 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/50">
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 min-w-[150px]">Code/Title</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 min-w-[200px]">Message</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Attributes</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                    {templates.map((template) => (
                                        <tr
                                            key={template.id}
                                            id={`template-${template.id}`}
                                            className="group transition-colors hover:bg-primary/[0.02] dark:hover:bg-primary/[0.01]"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col min-w-0">
                                                    <span className="truncate text-base font-bold text-gray-900 group-hover:text-primary dark:text-white">
                                                        {template.code}
                                                    </span>
                                                    <span className="line-clamp-1 text-xs text-gray-400 mt-0.5">
                                                        {template.title || "No Title"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col max-w-xs">
                                                    <span className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                                                        {template.message ?? template.emailSubject ?? "-"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {template.color && (
                                                        <span
                                                            className="h-4 w-4 rounded-full border border-gray-100 dark:border-gray-700"
                                                            style={{ backgroundColor: template.color }}
                                                            title={template.color}
                                                        />
                                                    )}
                                                    {template.icon && (
                                                        <span className="text-xs text-gray-400 bg-gray-100 rounded px-1.5 py-0.5 dark:bg-gray-800">
                                                            Icon Present
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={{
                                                            pathname: `/templates/${template.id}`,
                                                            query: searchParams,
                                                        }}
                                                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-600 transition-all hover:bg-primary hover:text-white dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-primary dark:hover:text-white"
                                                        title="Edit Template"
                                                    >
                                                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                        </svg>
                                                    </Link>
                                                    <DeleteTemplateButton id={template.id} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
