"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

interface Province {
    id: string;
    name: string;
}

interface Activity {
    id: string;
    title: string;
    startTime?: string;
    durationMin?: number;
    location?: string;
    notes?: string;
    important: boolean;
    activityOrder: number;
}

interface Day {
    id: string;
    title: string;
    description?: string;
    dayOrder: number;
    activities: Activity[];
}

interface TemplateForm {
    title: string;
    description: string;
    provinceId: string;
    isPublic: boolean;
    avatar: string;
    fee: number;
    days: Day[];
}

export default function TripTemplateFormPage() {
    const router = useRouter();
    const params = useParams();
    const isEdit = !!params?.id;

    const [loading, setLoading] = useState(false);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([0])); // Default expand first day
    const [form, setForm] = useState<TemplateForm>({
        title: "",
        description: "",
        provinceId: "",
        isPublic: false,
        avatar: "",
        fee: 0,
        days: [],
    });

    useEffect(() => {
        fetchProvinces();
        if (isEdit) {
            fetchTemplate();
        }
    }, []);

    const fetchProvinces = async () => {
        try {
            const response = await fetch("/api/provinces");
            if (response.ok) {
                const data = await response.json();
                setProvinces(data);
            }
        } catch (error) {
            console.error("Error fetching provinces:", error);
        }
    };

    const fetchTemplate = async () => {
        try {
            const response = await fetch(`/api/trip-templates/${params.id}`);
            if (response.ok) {
                const data = await response.json();
                setForm({
                    title: data.title,
                    description: data.description || "",
                    provinceId: data.provinceId || "",
                    isPublic: data.isPublic,
                    avatar: data.avatar || "",
                    fee: Number(data.fee),
                    days: data.days || [],
                });
                // Expand all days on edit load
                if (data.days) {
                    setExpandedDays(new Set(data.days.map((_: any, i: number) => i)));
                }
            }
        } catch (error) {
            console.error("Error fetching template:", error);
        }
    };

    const toggleDay = (index: number) => {
        const newExpanded = new Set(expandedDays);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedDays(newExpanded);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEdit
                ? `/api/trip-templates/${params.id}`
                : "/api/trip-templates";
            const method = isEdit ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                router.push("/trip-templates");
            } else {
                alert("Failed to save template");
            }
        } catch (error) {
            console.error("Error saving template:", error);
            alert("Failed to save template");
        } finally {
            setLoading(false);
        }
    };

    const addDay = () => {
        setForm((prev) => {
            const newDays = [
                ...prev.days,
                {
                    id: crypto.randomUUID(),
                    title: `Day ${prev.days.length + 1}`,
                    description: "",
                    dayOrder: prev.days.length + 1,
                    activities: [],
                },
            ];
            // Auto expand new day
            setExpandedDays(prev => new Set([...prev, newDays.length - 1]));
            return { ...prev, days: newDays };
        });
    };

    const removeDay = (index: number) => {
        if (!confirm("Remove this day and all its activities?")) return;
        setForm((prev) => ({
            ...prev,
            days: prev.days.filter((_, i) => i !== index),
        }));
    };

    const updateDay = (index: number, field: keyof Day, value: any) => {
        setForm((prev) => ({
            ...prev,
            days: prev.days.map((day, i) =>
                i === index ? { ...day, [field]: value } : day
            ),
        }));
    };

    const addActivity = (dayIndex: number) => {
        setForm((prev) => ({
            ...prev,
            days: prev.days.map((day, i) =>
                i === dayIndex
                    ? {
                        ...day,
                        activities: [
                            ...day.activities,
                            {
                                id: crypto.randomUUID(),
                                title: "",
                                startTime: "",
                                durationMin: 60,
                                location: "",
                                notes: "",
                                important: false,
                                activityOrder: day.activities.length + 1,
                            },
                        ],
                    }
                    : day
            ),
        }));
    };

    const removeActivity = (dayIndex: number, activityIndex: number) => {
        setForm((prev) => ({
            ...prev,
            days: prev.days.map((day, i) =>
                i === dayIndex
                    ? {
                        ...day,
                        activities: day.activities.filter((_, j) => j !== activityIndex),
                    }
                    : day
            ),
        }));
    };

    const updateActivity = (
        dayIndex: number,
        activityIndex: number,
        field: keyof Activity,
        value: any
    ) => {
        setForm((prev) => ({
            ...prev,
            days: prev.days.map((day, i) =>
                i === dayIndex
                    ? {
                        ...day,
                        activities: day.activities.map((activity, j) =>
                            j === activityIndex ? { ...activity, [field]: value } : activity
                        ),
                    }
                    : day
            ),
        }));
    };

    return (
        <div className="mx-auto max-w-5xl space-y-8 pb-10">
            {/* Header with Actions */}
            <div className="sticky top-0 z-10 -mx-4 border-b border-gray-200 bg-white/80 px-4 py-4 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80 sm:-mx-8 sm:px-8">
                <div className="mx-auto flex max-w-5xl items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                            {isEdit ? "Edit Template" : "Create Template"}
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {isEdit ? "Update template details" : "Create a new trip template"}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="template-form"
                            disabled={loading}
                            className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save Template"}
                        </button>
                    </div>
                </div>
            </div>

            <form id="template-form" onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 pb-2 dark:border-gray-700">
                                Basic Information
                            </h2>

                            <div className="space-y-5">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="e.g. Amazing Da Lat Trip"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Description
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        placeholder="Brief description about this trip..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Days & Activities */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Itinerary
                                </h2>
                                <button
                                    type="button"
                                    onClick={addDay}
                                    className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-primary shadow-sm hover:bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Day
                                </button>
                            </div>

                            <div className="space-y-4">
                                {form.days.map((day, dayIndex) => (
                                    <div
                                        key={day.id}
                                        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        <div
                                            className="flex cursor-pointer items-center justify-between bg-gray-50/50 px-6 py-4 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/50"
                                            onClick={() => toggleDay(dayIndex)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                                    {dayIndex + 1}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                                        {day.title || `Day ${dayIndex + 1}`}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">
                                                        {day.activities.length} activities
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeDay(dayIndex);
                                                    }}
                                                    className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                                                >
                                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                                <svg
                                                    className={`h-5 w-5 text-gray-400 transition-transform ${expandedDays.has(dayIndex) ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>

                                        {expandedDays.has(dayIndex) && (
                                            <div className="border-t border-gray-100 p-6 dark:border-gray-700">
                                                <div className="mb-6 grid gap-4 md:grid-cols-2">
                                                    <div>
                                                        <label className="mb-1 block text-xs font-medium text-gray-500">Title</label>
                                                        <input
                                                            type="text"
                                                            value={day.title}
                                                            onChange={(e) => updateDay(dayIndex, "title", e.target.value)}
                                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
                                                            placeholder="e.g. Arrival & Check-in"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="mb-1 block text-xs font-medium text-gray-500">Short Description</label>
                                                        <input
                                                            type="text"
                                                            value={day.description || ""}
                                                            onChange={(e) => updateDay(dayIndex, "description", e.target.value)}
                                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
                                                            placeholder="Highlights of the day"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                                            Activities
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => addActivity(dayIndex)}
                                                            className="text-xs font-medium text-primary hover:underline hover:text-primary/80"
                                                        >
                                                            + Add Activity
                                                        </button>
                                                    </div>

                                                    {day.activities.length === 0 ? (
                                                        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800/50">
                                                            No activities yet
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-3">
                                                            {day.activities.map((activity, activityIndex) => (
                                                                <div
                                                                    key={activity.id}
                                                                    className="group relative rounded-lg border border-gray-200 bg-gray-50/50 p-4 transition-all hover:border-primary/30 hover:bg-white hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary/30 dark:hover:bg-gray-800"
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeActivity(dayIndex, activityIndex)}
                                                                        className="absolute right-2 top-2 hidden rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 group-hover:block"
                                                                    >
                                                                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </button>

                                                                    <div className="mb-3 grid gap-3 sm:grid-cols-2">
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Activity Name"
                                                                            value={activity.title}
                                                                            onChange={(e) => updateActivity(dayIndex, activityIndex, "title", e.target.value)}
                                                                            className="w-full bg-transparent font-medium text-gray-900 placeholder-gray-400 focus:outline-none dark:text-white"
                                                                        />
                                                                        <div className="flex items-center gap-2 sm:justify-end">
                                                                            <label className="flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-2 py-0.5 text-xs shadow-sm dark:bg-gray-700">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={activity.important}
                                                                                    onChange={(e) => updateActivity(dayIndex, activityIndex, "important", e.target.checked)}
                                                                                    className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary"
                                                                                />
                                                                                <span className="text-gray-600 dark:text-gray-300">Important</span>
                                                                            </label>
                                                                        </div>
                                                                    </div>

                                                                    <div className="grid gap-3 sm:grid-cols-3">
                                                                        <div className="relative">
                                                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                                                                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                </svg>
                                                                            </div>
                                                                            <input
                                                                                type="time"
                                                                                value={activity.startTime}
                                                                                onChange={(e) => updateActivity(dayIndex, activityIndex, "startTime", e.target.value)}
                                                                                className="block w-full rounded-md border-gray-200 bg-white py-1.5 pl-8 text-xs focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                                                                            />
                                                                        </div>
                                                                        <div className="relative">
                                                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                                                                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                </svg>
                                                                            </div>
                                                                            <input
                                                                                type="number"
                                                                                placeholder="Mins"
                                                                                value={activity.durationMin}
                                                                                onChange={(e) => updateActivity(dayIndex, activityIndex, "durationMin", parseInt(e.target.value) || 0)}
                                                                                className="block w-full rounded-md border-gray-200 bg-white py-1.5 pl-8 text-xs focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                                                                            />
                                                                        </div>
                                                                        <div className="relative">
                                                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                                                                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                </svg>
                                                                            </div>
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Location"
                                                                                value={activity.location || ""}
                                                                                onChange={(e) => updateActivity(dayIndex, activityIndex, "location", e.target.value)}
                                                                                className="block w-full rounded-md border-gray-200 bg-white py-1.5 pl-8 text-xs focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <input
                                                                        type="text"
                                                                        className="mt-2 w-full border-0 bg-transparent p-0 text-xs text-gray-600 placeholder-gray-400 focus:ring-0 dark:text-gray-300"
                                                                        placeholder="Add notes..."
                                                                        value={activity.notes || ""}
                                                                        onChange={(e) => updateActivity(dayIndex, activityIndex, "notes", e.target.value)}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {form.days.length === 0 && (
                                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-gray-600 dark:bg-gray-800/50">
                                        <div className="mb-3 rounded-full bg-gray-100 p-3 dark:bg-gray-700">
                                            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="mb-1 text-sm font-medium text-gray-900 dark:text-white">Start Building the Itinerary</h3>
                                        <p className="mb-4 text-xs text-gray-500">Add the first day to get started</p>
                                        <button
                                            type="button"
                                            onClick={addDay}
                                            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                                        >
                                            Add Day 1
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Metadata */}
                    <div className="space-y-6">
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 pb-2 dark:border-gray-700">
                                Settings
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Province
                                    </label>
                                    <select
                                        value={form.provinceId}
                                        onChange={(e) => setForm({ ...form, provinceId: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    >
                                        <option value="">Select province</option>
                                        {provinces.map((province) => (
                                            <option key={province.id} value={province.id}>
                                                {province.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Estimated Fee ($)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={form.fee}
                                            onChange={(e) => setForm({ ...form, fee: parseFloat(e.target.value) || 0 })}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-8 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700/50">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-5 items-center">
                                            <input
                                                type="checkbox"
                                                id="isPublic"
                                                checked={form.isPublic}
                                                onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                        </div>
                                        <div className="text-sm">
                                            <label htmlFor="isPublic" className="font-medium text-gray-700 dark:text-gray-200">
                                                Public Template
                                            </label>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Visible to all users when enabled
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                                Cover Image
                            </h2>
                            <ImageUpload
                                value={form.avatar}
                                onChange={(url) => setForm({ ...form, avatar: url })}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
