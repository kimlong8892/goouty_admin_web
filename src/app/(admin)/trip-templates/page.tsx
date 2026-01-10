"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

interface Province {
    id: string;
    name: string;
}

interface TripTemplate {
    id: string;
    title: string;
    description?: string;
    avatar?: string;
    fee: number;
    isPublic: boolean;
    province?: Province;
    createdAt: string;
    days?: any[];
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function TripTemplatesPage() {
    const [templates, setTemplates] = useState<TripTemplate[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterPublic, setFilterPublic] = useState<string>("");

    const fetchTemplates = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });

            if (search) params.append("search", search);
            if (filterPublic) params.append("isPublic", filterPublic);

            const response = await fetch(`/api/trip-templates?${params}`);
            const data = await response.json();

            setTemplates(data.data || []);
            setPagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 });
        } catch (error) {
            console.error("Error fetching templates:", error);
            setTemplates([]);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, search, filterPublic]);

    useEffect(() => {
        fetchTemplates();
    }, [fetchTemplates]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this template?")) return;

        try {
            const response = await fetch(`/api/trip-templates/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchTemplates();
            } else {
                alert("Failed to delete template");
            }
        } catch (error) {
            console.error("Error deleting template:", error);
            alert("Failed to delete template");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Trip Templates
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Manage trip templates for users
                    </p>
                </div>
                <Link
                    href="/trip-templates/new"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                >
                    Create Template
                </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <input
                    type="text"
                    placeholder="Search templates..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPagination((prev) => ({ ...prev, page: 1 }));
                    }}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800"
                />
                <select
                    value={filterPublic}
                    onChange={(e) => {
                        setFilterPublic(e.target.value);
                        setPagination((prev) => ({ ...prev, page: 1 }));
                    }}
                    className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800"
                >
                    <option value="">All Status</option>
                    <option value="true">Public</option>
                    <option value="false">Private</option>
                </select>
            </div>

            {/* Templates Table */}
            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            ) : templates.length === 0 ? (
                <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <div className="text-center">
                        <p className="text-gray-500 dark:text-gray-400">No templates found</p>
                        <Link
                            href="/trip-templates/new"
                            className="mt-2 inline-block text-sm text-primary hover:underline"
                        >
                            Create your first template
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Template</th>
                                    <th scope="col" className="px-6 py-3">Province</th>
                                    <th scope="col" className="px-6 py-3">Stats</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Created</th>
                                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {templates.map((template) => (
                                    <tr key={template.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                                                    {template.avatar && (template.avatar.startsWith('http://') || template.avatar.startsWith('https://')) ? (
                                                        <Image
                                                            src={template.avatar}
                                                            alt={template.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center">
                                                            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {template.title}
                                                    </div>
                                                    {template.description && (
                                                        <div className="max-w-xs truncate text-xs text-gray-500">
                                                            {template.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {template.province ? (
                                                <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {template.province.name}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    ${Number(template.fee).toLocaleString()}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {template.days?.length || 0} days
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${template.isPublic
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                                    }`}
                                            >
                                                {template.isPublic ? "Public" : "Private"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-500 dark:text-gray-400">
                                                {new Date(template.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="relative z-10 flex items-center justify-end gap-3">
                                                <Link
                                                    href={`/trip-templates/${template.id}`}
                                                    className="rounded px-2 py-1 font-medium text-blue-600 hover:bg-blue-50 hover:underline dark:text-blue-400 dark:hover:bg-blue-900/20"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(template.id);
                                                    }}
                                                    className="rounded px-2 py-1 font-medium text-red-600 hover:bg-red-50 hover:underline dark:text-red-400 dark:hover:bg-red-900/20"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium disabled:opacity-50 dark:border-gray-600"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                        disabled={pagination.page === pagination.totalPages}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium disabled:opacity-50 dark:border-gray-600"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
