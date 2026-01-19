import { initializeDataSource } from "@/lib/typeorm";
import { User } from "@/entities/User";
import Link from "next/link";
import { formatDateReadable } from "@/lib/date-utils";
import ComponentCard from "@/components/common/ComponentCard";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "User Management | GoOuty",
};

interface PageProps {
    searchParams: Promise<{
        page?: string;
    }>;
}

export default async function UsersPage(props: PageProps) {
    const searchParams = await props.searchParams;
    const page = parseInt(searchParams.page || "1");
    const limit = 5;
    const skip = (page - 1) * limit;

    const dataSource = await initializeDataSource();
    const userRepo = dataSource.getRepository<User>("User");

    const [users, total] = await userRepo.findAndCount({
        order: {
            createdAt: "DESC",
        },
        skip,
        take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                    User Management
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    A comprehensive list of all users on the platform.
                </p>
            </div>

            <ComponentCard title="All Users" desc={`Total ${total} users registered`}>
                <div className="overflow-x-auto -m-4 sm:-m-6">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-white/[0.02]">
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    User
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Joined Date
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Phone Number
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-transparent">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors group">
                                    <td className="whitespace-nowrap px-6 py-5">
                                        <div className="flex items-center">
                                            <div className="relative h-11 w-11 flex-shrink-0">
                                                {u.profilePicture ? (
                                                    <img
                                                        className="h-11 w-11 rounded-xl object-cover ring-2 ring-gray-100 dark:ring-gray-800 transition-transform group-hover:scale-105"
                                                        src={u.profilePicture}
                                                        alt=""
                                                    />
                                                ) : (
                                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/10 to-brand-600/10 text-brand-600 dark:text-brand-400 font-bold border border-brand-100 dark:border-brand-900/50 uppercase transition-transform group-hover:scale-105">
                                                        {u.fullName?.charAt(0) || u.email.charAt(0)}
                                                    </div>
                                                )}
                                                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 dark:border-gray-900" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors">
                                                    {u.fullName || "Unnamed User"}
                                                </div>
                                                <div className="text-[10px] font-medium text-gray-400 uppercase tracking-tight">
                                                    UID: {u.id.substring(0, 8)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-5">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors cursor-default">
                                            {u.email}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {formatDateReadable(u.createdAt)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-500 dark:text-gray-400">
                                        {u.phoneNumber ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                                {u.phoneNumber}
                                            </span>
                                        ) : (
                                            <span className="text-gray-300 dark:text-gray-600 italic">Not provided</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 px-6 py-6 dark:border-gray-800 -m-4 sm:-m-6 mt-4">
                        <p className="text-sm font-medium text-gray-500">
                            Showing <span className="text-gray-900 dark:text-white font-bold">{skip + 1}</span> to <span className="text-gray-900 dark:text-white font-bold">{Math.min(skip + limit, total)}</span> of <span className="text-gray-900 dark:text-white font-bold">{total}</span> entries
                        </p>
                        <div className="flex items-center gap-2">
                            <Link
                                href={{ query: { ...searchParams, page: (page - 1).toString() } }}
                                className={`flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-300 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                                Previous
                            </Link>

                            <div className="flex items-center bg-gray-50 dark:bg-white/[0.03] rounded-xl px-4 h-10 border border-gray-100 dark:border-gray-800">
                                <span className="text-sm font-black text-brand-600 dark:text-brand-400">{page}</span>
                                <span className="mx-2 text-gray-400">/</span>
                                <span className="text-sm font-bold text-gray-500">{totalPages}</span>
                            </div>

                            <Link
                                href={{ query: { ...searchParams, page: (page + 1).toString() } }}
                                className={`flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-300 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 ${page >= totalPages ? "pointer-events-none opacity-50" : ""}`}
                            >
                                Next
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                            </Link>
                        </div>
                    </div>
                )}
            </ComponentCard>
        </div>
    );
}
