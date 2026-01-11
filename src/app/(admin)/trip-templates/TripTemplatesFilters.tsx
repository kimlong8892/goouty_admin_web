"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";

export default function TripTemplatesFilters({
    initialSearch = "",
    initialIsPublic = "",
}: {
    initialSearch?: string;
    initialIsPublic?: string;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [search, setSearch] = useState(initialSearch);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== initialSearch) {
                updateFilters("search", search);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const updateFilters = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(name, value);
        } else {
            params.delete(name);
        }
        params.set("page", "1");

        startTransition(() => {
            router.push(`/trip-templates?${params.toString()}`);
        });
    };

    return (
        <div className="flex flex-col gap-4 p-2 sm:flex-row sm:items-center">
            <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <svg className={`h-5 w-5 transition-colors duration-300 ${isPending ? 'text-primary animate-pulse' : 'text-gray-400 group-focus-within:text-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search signature itineraries..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-2xl border-0 bg-white/50 px-12 py-3.5 text-sm font-medium text-gray-900 ring-1 ring-gray-200 transition-all focus:bg-white focus:ring-2 focus:ring-primary/20 dark:bg-gray-800/50 dark:text-white dark:ring-gray-700 dark:focus:bg-gray-800 dark:focus:ring-primary/20"
                />
            </div>

            <div className="flex gap-2">
                <select
                    defaultValue={initialIsPublic}
                    onChange={(e) => updateFilters("isPublic", e.target.value)}
                    className="rounded-2xl border-0 bg-white/50 px-5 py-3.5 text-sm font-bold text-gray-700 ring-1 ring-gray-200 transition-all focus:bg-white focus:ring-2 focus:ring-primary/20 dark:bg-gray-800/50 dark:text-gray-300 dark:ring-gray-700 dark:focus:bg-gray-800 dark:focus:ring-primary/20 cursor-pointer appearance-none min-w-[140px]"
                >
                    <option value="">Status: All</option>
                    <option value="true">Public Only</option>
                    <option value="false">Private Only</option>
                </select>

                {(initialSearch || initialIsPublic) && (
                    <button
                        onClick={() => {
                            setSearch("");
                            router.push("/trip-templates");
                        }}
                        className="rounded-2xl bg-gray-100 p-3.5 text-gray-400 transition-all hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700"
                        title="Clear Filters"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
