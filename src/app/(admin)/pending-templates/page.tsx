import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CreateFromUrlModal from "./CreateFromUrlModal";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Pending Templates",
};

interface PageProps {
    searchParams: Promise<{
        page?: string;
        status?: string;
    }>;
}

type PendingTemplate = {
    id: string;
    url: string;
    status: string;
    error: string | null;
    tripTemplateId: string | null;
    createdAt: Date;
    updatedAt: Date;
    tripTemplate: {
        id: string;
        title: string;
        avatar: string | null;
    } | null;
};


export default async function PendingTemplatesPage(props: PageProps) {
    const searchParams = await props.searchParams;
    const page = parseInt(searchParams.page || "1");
    const limit = 10;
    const status = searchParams.status || "";

    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
        where.status = status;
    }

    const [pendingTemplates, total] = await Promise.all([
        prisma.pendingTripTemplate.findMany({
            where,
            include: {
                tripTemplate: {
                    select: {
                        id: true,
                        title: true,
                        avatar: true,
                    }
                }
            },
            skip,
            take: limit,
        }),
        prisma.pendingTripTemplate.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    const statusColors = {
        PENDING: "bg-yellow-50 text-yellow-600 ring-yellow-500/20 dark:bg-yellow-500/10 dark:text-yellow-400",
        PROCESSING: "bg-blue-50 text-blue-600 ring-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400",
        COMPLETED: "bg-emerald-50 text-emerald-600 ring-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400",
        FAILED: "bg-red-50 text-red-600 ring-red-500/20 dark:bg-red-500/10 dark:text-red-400",
    };

    const statusDots = {
        PENDING: "bg-yellow-500",
        PROCESSING: "bg-blue-500",
        COMPLETED: "bg-emerald-500",
        FAILED: "bg-red-500",
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        Pending Templates
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Templates being created from URLs
                    </p>
                </div>
                <CreateFromUrlModal />
            </div>

            {/* Filters */}
            <div className="rounded-3xl border border-gray-200 bg-white/50 p-4 backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-800/50">
                <div className="flex flex-wrap gap-2">
                    <Link
                        href="/pending-templates"
                        className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${!status
                            ? "bg-brand-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                            }`}
                    >
                        All
                    </Link>
                    <Link
                        href="/pending-templates?status=PENDING"
                        className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${status === "PENDING"
                            ? "bg-yellow-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                            }`}
                    >
                        Pending
                    </Link>
                    <Link
                        href="/pending-templates?status=PROCESSING"
                        className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${status === "PROCESSING"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                            }`}
                    >
                        Processing
                    </Link>
                    <Link
                        href="/pending-templates?status=COMPLETED"
                        className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${status === "COMPLETED"
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                            }`}
                    >
                        Completed
                    </Link>
                    <Link
                        href="/pending-templates?status=FAILED"
                        className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${status === "FAILED"
                            ? "bg-red-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                            }`}
                    >
                        Failed
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            {pendingTemplates.length === 0 ? (
                <div className="group relative flex flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border-2 border-dashed border-gray-200 bg-white p-20 text-center transition-all hover:border-primary/50 dark:border-gray-800 dark:bg-gray-900">
                    <div className="relative mb-6">
                        <div className="absolute -inset-4 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-all duration-500" />
                        <div className="relative rounded-3xl bg-gray-50 p-8 dark:bg-gray-800">
                            <svg className="h-12 w-12 text-gray-400 group-hover:text-primary transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">No pending templates</h3>
                    <p className="mt-2 max-w-sm text-gray-500">Create a new template from URL to get started.</p>
                </div>
            ) : (
                <div className="max-w-full overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-xl shadow-gray-200/50 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead>
                                <tr className="border-b border-gray-50 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/50">
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 min-w-[400px]">URL</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Template</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Created</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {pendingTemplates.map((pending) => (
                                    <tr
                                        key={pending.id}
                                        className="group transition-colors hover:bg-primary/[0.02] dark:hover:bg-primary/[0.01]"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <a
                                                    href={pending.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 truncate max-w-[350px] block"
                                                >
                                                    {pending.url}
                                                </a>
                                                {pending.error && (
                                                    <span className="text-xs text-red-500 mt-1 line-clamp-2">{pending.error}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ring-1 ring-inset ${statusColors[pending.status as keyof typeof statusColors]}`}>
                                                <span className={`h-1 w-1 rounded-full ${statusDots[pending.status as keyof typeof statusDots]}`} />
                                                {pending.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {pending.tripTemplate ? (
                                                <Link
                                                    href={`/trip-templates/${pending.tripTemplateId}`}
                                                    className="text-sm font-medium text-brand-600 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300"
                                                >
                                                    {pending.tripTemplate.title}
                                                </Link>
                                            ) : (
                                                <span className="text-sm text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-gray-500">
                                                {new Date(pending.createdAt).toLocaleString()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
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
            )}
        </div>
    );
}
