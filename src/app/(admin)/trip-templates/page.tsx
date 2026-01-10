import Link from "next/link";
import Image from "next/image";
import { ILike } from "typeorm";
import { initializeDataSource } from "@/lib/typeorm";
import { TripTemplate } from "@/entities/TripTemplate";
import TripTemplatesFilters from "./TripTemplatesFilters";
import DeleteTemplateButton from "./DeleteTemplateButton";
import ExcelActions from "./ExcelActions";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        isPublic?: string;
    }>;
}

export default async function TripTemplatesPage(props: PageProps) {
    const searchParams = await props.searchParams;
    const page = parseInt(searchParams.page || "1");
    const limit = 10;
    const search = searchParams.search || "";
    const isPublic = searchParams.isPublic;

    const skip = (page - 1) * limit;

    const dataSource = await initializeDataSource();
    const tripTemplateRepo = dataSource.getRepository<TripTemplate>("TripTemplate");

    const commonWhere: any = {};
    if (isPublic !== undefined && isPublic !== "") {
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

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                        Trip Templates
                    </h1>
                    <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
                        Design and manage signature itineraries for your travelers.
                    </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <ExcelActions />
                    <Link
                        href="/trip-templates/new"
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


            {/* Filters Section */}
            <div className="rounded-3xl border border-gray-200 bg-white/50 p-2 backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-800/50">
                <TripTemplatesFilters initialSearch={search} initialIsPublic={isPublic} />
            </div>

            {/* Main Content: Premium Data Table */}
            {
                templates.length === 0 ? (
                    <div className="group relative flex flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border-2 border-dashed border-gray-200 bg-white p-20 text-center transition-all hover:border-primary/50 dark:border-gray-800 dark:bg-gray-900">
                        <div className="relative mb-6">
                            <div className="absolute -inset-4 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-all duration-500" />
                            <div className="relative rounded-3xl bg-gray-50 p-8 dark:bg-gray-800">
                                <svg className="h-12 w-12 text-gray-400 group-hover:text-primary transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">No results found</h3>
                        <p className="mt-2 max-w-sm text-gray-500">We couldn&apos;t find any templates matching your filters. Try adjusting your search or create a new one.</p>
                        <Link
                            href="/trip-templates/new"
                            className="mt-8 rounded-xl bg-gray-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-black"
                        >
                            Create Your First Template
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-xl shadow-gray-200/50 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-50 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/50">
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Itinerary</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Details</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Pricing</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                    {templates.map((template) => (
                                        <tr
                                            key={template.id}
                                            className="group transition-colors hover:bg-primary/[0.02] dark:hover:bg-primary/[0.01]"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
                                                        {template.avatar ? (
                                                            <Image
                                                                src={template.avatar}
                                                                alt={template.title}
                                                                fill
                                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                                unoptimized
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <svg className="h-6 w-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="truncate text-base font-bold text-gray-900 group-hover:text-primary dark:text-white">
                                                            {template.title}
                                                        </span>
                                                        <span className="line-clamp-1 text-xs text-gray-400 mt-0.5">
                                                            {template.description || "No description"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        </svg>
                                                        <span className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                                                            {template.province?.name || "Global"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="text-[10px] font-bold text-gray-400">
                                                            {template.days?.length || 0} Journey Days
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-gray-900 dark:text-white">
                                                        ${Number(template.fee).toLocaleString()}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">Platform Fee</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ring-1 ring-inset ${template.isPublic
                                                    ? "bg-emerald-50 text-emerald-600 ring-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                                                    : "bg-gray-50 text-gray-500 ring-gray-500/20 dark:bg-gray-500/10 dark:text-gray-400"
                                                    }`}>
                                                    <span className={`h-1 w-1 rounded-full ${template.isPublic ? "bg-emerald-500" : "bg-gray-500"}`} />
                                                    {template.isPublic ? "Public" : "Draft"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/trip-templates/${template.id}`}
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

            {/* Pagination Controls */}
            {
                totalPages > 1 && (
                    <div className="flex flex-col items-center justify-between gap-4 rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:flex-row">
                        <div className="text-sm font-medium text-gray-500">
                            Showing <span className="font-bold text-gray-900 dark:text-white">{(page - 1) * limit + 1}-{Math.min(page * limit, total)}</span> of <span className="font-bold text-gray-900 dark:text-white">{total}</span> templates
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href={{
                                    query: { ...searchParams, page: (page - 1).toString() },
                                }}
                                className={`flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 ${page === 1 ? "pointer-events-none opacity-50" : ""}`}
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                                Prev
                            </Link>

                            <div className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-primary/5 px-4 text-sm font-black text-primary dark:bg-primary/10">
                                {page} <span className="mx-1 text-gray-400 font-normal">/</span> {totalPages}
                            </div>

                            <Link
                                href={{
                                    query: { ...searchParams, page: (page + 1).toString() },
                                }}
                                className={`flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 ${page === totalPages ? "pointer-events-none opacity-50" : ""}`}
                            >
                                Next
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                            </Link>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
