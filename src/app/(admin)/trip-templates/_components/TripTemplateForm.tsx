"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

interface TripTemplateFormProps {
    initialData?: TemplateForm;
    id?: string;
    provinces: Province[];
    returnParams?: { [key: string]: string | string[] | undefined };
}

export default function TripTemplateForm({ initialData, id, provinces, returnParams }: TripTemplateFormProps) {
    const router = useRouter();
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([0]));
    const [form, setForm] = useState<TemplateForm>(initialData || {
        title: "",
        description: "",
        provinceId: "",
        isPublic: false,
        avatar: "",
        fee: 0,
        days: [],
    });

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
            let avatarUrl = form.avatar;

            // 1. Upload image if a new one was selected
            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (uploadRes.ok) {
                    const data = await uploadRes.json();
                    avatarUrl = data.url;
                } else {
                    throw new Error("Failed to upload image");
                }
            }

            // 2. Submit the form with the (potentially new) avatar URL
            const url = isEdit
                ? `/api/trip-templates/${id}`
                : "/api/trip-templates";
            const method = isEdit ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, avatar: avatarUrl }),
            });

            if (response.ok) {
                const params = new URLSearchParams();
                if (returnParams) {
                    Object.entries(returnParams).forEach(([key, value]) => {
                        if (value !== undefined) {
                            if (Array.isArray(value)) {
                                value.forEach(v => params.append(key, v));
                            } else {
                                params.set(key, value);
                            }
                        }
                    });
                }
                if (id) params.set("lastId", id);
                const queryString = params.toString();
                router.push(queryString ? `/trip-templates?${queryString}` : "/trip-templates");
                router.refresh();
            } else {
                alert("Không thể lưu lịch trình");
            }
        } catch (error) {
            console.error("Error saving template:", error);
            alert(error instanceof Error ? error.message : "Không thể lưu lịch trình");
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
            setExpandedDays(prev => new Set([...prev, newDays.length - 1]));
            return { ...prev, days: newDays };
        });
    };

    const removeDay = (index: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa ngày này? Tất cả các hoạt động trong ngày này sẽ bị mất.")) return;
        setForm((prev) => ({
            ...prev,
            days: prev.days.filter((_, i) => i !== index).map((day, idx) => ({
                ...day,
                dayOrder: idx + 1
            })),
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
                                startTime: "09:00",
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
                        activities: day.activities.filter((_, j) => j !== activityIndex).map((act, idx) => ({
                            ...act,
                            activityOrder: idx + 1
                        })),
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
        <div className="-mx-4 -mt-4 md:-m-6 w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] bg-gray-50 dark:bg-[#020617] min-h-screen">
            {/* Premium Glass Header */}
            <div className="sticky top-[58px] lg:top-[74px] z-30 border-b border-gray-200 bg-white/95 px-4 py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-[#020617]/90 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                {isEdit ? "Chỉnh sửa Lịch trình" : "Tạo Lịch trình Mới"}
                            </h1>
                            <span className="rounded-full bg-brand-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                                {isEdit ? "Chế độ Chỉnh sửa" : "Đang Soạn thảo"}
                            </span>
                        </div>
                        <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                            {isEdit ? "Hoàn thiện trải nghiệm du lịch tuyệt vời cho khách hàng của bạn." : "Bắt đầu xây dựng một hành trình du lịch huyền thoại."}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => {
                                const params = new URLSearchParams();
                                if (returnParams) {
                                    Object.entries(returnParams).forEach(([key, value]) => {
                                        if (value !== undefined) {
                                            if (Array.isArray(value)) {
                                                value.forEach(v => params.append(key, v));
                                            } else {
                                                params.set(key, value);
                                            }
                                        }
                                    });
                                }
                                if (id) params.set("lastId", id);
                                const queryString = params.toString();
                                router.push(queryString ? `/trip-templates?${queryString}` : "/trip-templates");
                            }}
                            className="rounded-2xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-bold text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-400 dark:hover:bg-gray-700 active:scale-95"
                        >
                            Hủy Thay đổi
                        </button>
                        <button
                            type="submit"
                            form="template-form"
                            disabled={loading}
                            className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-brand-600 px-10 py-3.5 text-sm font-bold text-white shadow-[0_20px_40px_-15px_rgba(54,65,245,0.35)] transition-all hover:scale-[1.02] hover:shadow-brand-500/40 active:scale-95 disabled:opacity-50"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-500 group-hover:translate-x-full -translate-x-full" />
                            {loading ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                                <>
                                    <span>{isEdit ? "Lưu Thay đổi" : "Tạo Lịch trình"}</span>
                                    <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <form id="template-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                {/* Left Column: Itinerary Building */}
                <div className="lg:col-span-12">
                    {/* Unified Info Card */}
                    <div className="overflow-hidden bg-white dark:bg-gray-900">
                        <div className="bg-gray-50/50 px-8 py-6 dark:bg-slate-800/40 border-b border-gray-100 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Thông tin Chung</h2>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                {/* Left Side: Text Fields */}
                                <div className="lg:col-span-7 space-y-6">
                                    <div className="group relative">
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-400 group-focus-within:text-brand-600 transition-colors">
                                            Tiêu đề Chuyến đi
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={form.title}
                                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                                            className="w-full rounded-2xl border-gray-100 bg-gray-50/50 px-5 py-4 text-gray-900 placeholder-gray-400 transition-all focus:bg-white focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:focus:bg-slate-800"
                                            placeholder="VD: 7 Ngày Khám phá Cố đô Kyoto"
                                        />
                                    </div>

                                    <div className="group relative">
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-400 group-focus-within:text-brand-600 transition-colors">
                                            Mô tả & Câu chuyện
                                        </label>
                                        <textarea
                                            rows={8}
                                            value={form.description}
                                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                                            className="w-full rounded-2xl border-gray-100 bg-gray-50/50 px-5 py-4 text-gray-900 placeholder-gray-400 transition-all focus:bg-white focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:focus:bg-slate-800"
                                            placeholder="Mô tả sự kỳ diệu đằng sau hành trình này..."
                                        />
                                    </div>
                                </div>

                                {/* Right Side: Visual & Logistics */}
                                <div className="lg:col-span-5 space-y-8">
                                    <div>
                                        <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-gray-400">Hình ảnh Đại diện</label>
                                        <ImageUpload
                                            value={form.avatar}
                                            onChange={(file) => setSelectedFile(file)}
                                            onRemove={() => setForm({ ...form, avatar: "" })}
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Tỉnh thành</label>
                                            <select
                                                value={form.provinceId}
                                                onChange={(e) => setForm({ ...form, provinceId: e.target.value })}
                                                className="w-full rounded-2xl border-gray-100 bg-gray-50/50 px-4 py-3.5 text-sm font-bold text-gray-900 transition-all focus:bg-white focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white appearance-none cursor-pointer"
                                            >
                                                <option value="">Chọn Điểm đến</option>
                                                {provinces.map((province) => (
                                                    <option key={province.id} value={province.id}>
                                                        {province.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Phí dự kiến ($)</label>
                                            <div className="relative group">
                                                <span className="absolute inset-y-0 left-4 flex items-center text-sm font-bold text-gray-300 group-focus-within:text-brand-600 transition-colors">$</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={form.fee}
                                                    onChange={(e) => setForm({ ...form, fee: parseFloat(e.target.value) || 0 })}
                                                    className="w-full rounded-2xl border-gray-100 bg-gray-50/50 py-3.5 pl-8 pr-4 text-sm font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-[2rem] bg-brand-50/50 p-6 ring-1 ring-brand-100 dark:bg-brand-500/5 dark:ring-brand-500/20">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-sm font-bold text-brand-600 uppercase tracking-tighter dark:text-brand-400">Chế độ Công khai</h4>
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Hiển thị cho tất cả mọi người</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setForm({ ...form, isPublic: !form.isPublic })}
                                                className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${form.isPublic ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                                            >
                                                <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out mt-[2px] ml-[2px] ${form.isPublic ? 'translate-x-6' : 'translate-x-0'}`} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Itinerary Section */}
                        <div className="border-t border-gray-100 dark:border-gray-800">
                            <div className="flex items-center justify-between bg-gray-50/50 px-8 py-6 dark:bg-slate-800/40 border-b border-gray-100 dark:border-slate-800">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lịch trình Chi tiết</h2>
                                    <p className="text-sm text-gray-500 mt-1">Ghi lại hành trình theo từng ngày.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addDay}
                                    className="group inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:scale-[1.02] hover:bg-brand-700 active:scale-95"
                                >
                                    <svg className="h-4 w-4 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Thêm Ngày Hành trình
                                </button>
                            </div>

                            <div className="p-8 space-y-6">
                                {form.days.map((day, dayIndex) => (
                                    <div
                                        key={day.id}
                                        className="group/day relative overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white transition-all hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 dark:border-gray-800 dark:bg-gray-900"
                                    >
                                        {/* Day Header */}
                                        <div
                                            className="flex cursor-pointer items-center justify-between bg-gray-50/50 px-8 py-6 transition-colors hover:bg-gray-100/50 dark:bg-gray-800/50"
                                            onClick={() => toggleDay(dayIndex)}
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-xl font-bold text-white shadow-lg shadow-brand-500/20 transition-transform group-hover/day:scale-110">
                                                    {dayIndex + 1}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                                                        {day.title || `Ngày ${dayIndex + 1}`}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                                        <span>{day.activities.length} Hoạt động</span>
                                                        {day.description && (
                                                            <>
                                                                <span>•</span>
                                                                <span className="line-clamp-1">{day.description}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeDay(dayIndex);
                                                    }}
                                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 opacity-0 group-hover/day:opacity-100 transition-all hover:bg-red-500 hover:text-white dark:bg-red-500/10"
                                                >
                                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                                <div className={`rounded-xl p-2 transition-all duration-500 ${expandedDays.has(dayIndex) ? 'rotate-180 bg-brand-600/10 text-brand-600' : 'bg-gray-100 text-gray-400'}`}>
                                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Body */}
                                        {expandedDays.has(dayIndex) && (
                                            <div className="animate-in fade-in slide-in-from-top-4 duration-500 p-8 pt-4 space-y-8">
                                                {/* Day Metadata */}
                                                <div className="grid gap-6 md:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Tiêu đề Nổi bật Ngày</label>
                                                        <input
                                                            type="text"
                                                            value={day.title}
                                                            onChange={(e) => updateDay(dayIndex, "title", e.target.value)}
                                                            className="w-full rounded-xl border-gray-100 bg-gray-50/50 px-4 py-3 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800/50 dark:text-white"
                                                            placeholder="VD: Tham quan Đền Kinkaku-ji"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Tóm tắt Ngày</label>
                                                        <input
                                                            type="text"
                                                            value={day.description || ""}
                                                            onChange={(e) => updateDay(dayIndex, "description", e.target.value)}
                                                            className="w-full rounded-xl border-gray-100 bg-gray-50/50 px-4 py-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800/50 dark:text-white"
                                                            placeholder="Tóm tắt ngắn gọn trải nghiệm của ngày"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Activities List */}
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between border-b border-gray-100 pb-2 dark:border-gray-800">
                                                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">Từ Sáng đến Tối</h4>
                                                        <button
                                                            type="button"
                                                            onClick={() => addActivity(dayIndex)}
                                                            className="group flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-600 hover:text-brand-500 transition-colors"
                                                        >
                                                            <svg className="h-3.5 w-3.5 transition-transform group-hover:scale-125" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                                            </svg>
                                                            Thêm Hoạt động
                                                        </button>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {day.activities.length === 0 ? (
                                                            <div className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-gray-100 bg-gray-50/30 py-10 dark:border-gray-800 dark:bg-gray-900/30">
                                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Chưa có hoạt động nào được thêm</p>
                                                            </div>
                                                        ) : (
                                                            <div className="relative space-y-4 before:absolute before:inset-y-0 before:left-[1.65rem] before:w-[2px] before:bg-gradient-to-b before:from-primary/20 before:via-primary/20 before:to-transparent">
                                                                {day.activities.map((activity, activityIndex) => (
                                                                    <div
                                                                        key={activity.id}
                                                                        className="group/act relative ml-1.5 flex gap-6 rounded-3xl border border-transparent bg-transparent p-2 transition-all hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 dark:hover:bg-gray-800 dark:hover:shadow-none"
                                                                    >
                                                                        {/* Timeline Dot */}
                                                                        <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-bold text-gray-900 shadow-sm ring-2 ring-brand-500/20 transition-all group-hover/act:bg-brand-600 group-hover/act:text-white group-hover/act:scale-110 dark:bg-gray-800 dark:text-white dark:ring-gray-700">
                                                                            {activityIndex + 1}
                                                                        </div>

                                                                        <div className="flex-1 space-y-4 pt-1">
                                                                            {/* Activity Header */}
                                                                            <div className="flex items-start justify-between">
                                                                                <div className="flex-1">
                                                                                    <input
                                                                                        type="text"
                                                                                        placeholder="Chúng ta làm gì?"
                                                                                        value={activity.title}
                                                                                        onChange={(e) => updateActivity(dayIndex, activityIndex, "title", e.target.value)}
                                                                                        className="w-full bg-transparent text-lg font-bold text-gray-900 placeholder-gray-300 focus:outline-none dark:text-white"
                                                                                    />
                                                                                </div>
                                                                                <div className="flex items-center gap-3">
                                                                                    <label className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-100 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-sm transition-all hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={activity.important}
                                                                                            onChange={(e) => updateActivity(dayIndex, activityIndex, "important", e.target.checked)}
                                                                                            className="h-3 w-3 rounded-full border-gray-300 text-brand-600 focus:ring-brand-500"
                                                                                        />
                                                                                        <span className={activity.important ? 'text-brand-600' : 'text-gray-400'}>Quan trọng</span>
                                                                                    </label>
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => removeActivity(dayIndex, activityIndex)}
                                                                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover/act:opacity-100 dark:hover:bg-red-500/10"
                                                                                    >
                                                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                                        </svg>
                                                                                    </button>
                                                                                </div>
                                                                            </div>

                                                                            {/* Activity Metadata Grid */}
                                                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                                                                <div className="relative group/field">
                                                                                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                                                                        <svg className="h-4 w-4 text-gray-300 group-focus-within/field:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                        </svg>
                                                                                    </div>
                                                                                    <input
                                                                                        type="time"
                                                                                        value={activity.startTime}
                                                                                        onChange={(e) => updateActivity(dayIndex, activityIndex, "startTime", e.target.value)}
                                                                                        className="w-full rounded-xl border border-gray-100 bg-gray-50/50 py-2.5 pl-9 pr-3 text-xs font-bold focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800"
                                                                                    />
                                                                                </div>
                                                                                <div className="relative group/field">
                                                                                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                                                                        <svg className="h-4 w-4 text-gray-300 group-focus-within/field:text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                        </svg>
                                                                                    </div>
                                                                                    <input
                                                                                        type="number"
                                                                                        placeholder="Thời lượng (phút)"
                                                                                        value={activity.durationMin}
                                                                                        onChange={(e) => updateActivity(dayIndex, activityIndex, "durationMin", parseInt(e.target.value) || 0)}
                                                                                        className="w-full rounded-xl border border-gray-100 bg-gray-50/50 py-2.5 pl-9 pr-3 text-xs font-bold focus:bg-white focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800"
                                                                                    />
                                                                                </div>
                                                                                <div className="relative group/field">
                                                                                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                                                                        <svg className="h-4 w-4 text-gray-300 group-focus-within/field:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                        </svg>
                                                                                    </div>
                                                                                    <input
                                                                                        type="text"
                                                                                        placeholder="Địa điểm"
                                                                                        value={activity.location || ""}
                                                                                        onChange={(e) => updateActivity(dayIndex, activityIndex, "location", e.target.value)}
                                                                                        className="w-full rounded-xl border border-gray-100 bg-gray-50/50 py-2.5 pl-9 pr-3 text-xs font-bold focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800"
                                                                                    />
                                                                                </div>
                                                                            </div>

                                                                            <textarea
                                                                                rows={1}
                                                                                placeholder="Ghi chú đặc biệt hoặc hướng dẫn cho hoạt động này..."
                                                                                value={activity.notes || ""}
                                                                                onChange={(e) => updateActivity(dayIndex, activityIndex, "notes", e.target.value)}
                                                                                className="w-full border-0 border-l-2 border-gray-100 bg-transparent px-4 py-1 text-xs italic text-gray-500 focus:border-brand-600 focus:ring-0 dark:border-gray-800"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {form.days.length === 0 && (
                                    <div className="flex flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border-2 border-dashed border-gray-100 bg-gray-50/50 p-20 text-center dark:border-gray-800 dark:bg-gray-900/50">
                                        <div className="relative mb-6">
                                            <div className="absolute -inset-4 rounded-full bg-brand-500/10 blur-2xl" />
                                            <div className="relative rounded-3xl bg-white p-6 shadow-xl dark:bg-gray-800">
                                                <svg className="h-10 w-10 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Bắt đầu kể một Câu chuyện</h3>
                                        <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto">Thêm ngày đầu tiên để bắt đầu mô tả hành trình tuyệt vời này.</p>
                                        <button
                                            type="button"
                                            onClick={addDay}
                                            className="mt-8 rounded-2xl bg-brand-600 px-10 py-4 text-sm font-bold text-white shadow-xl shadow-brand-500/20 transition-all hover:scale-105 hover:bg-brand-700 active:scale-95"
                                        >
                                            Khởi tạo Ngày 1
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
