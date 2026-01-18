"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";

interface Province {
    id: string;
    name: string;
}

interface ProvinceSelectProps {
    provinces: Province[];
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export default function ProvinceSelect({ provinces, value, onChange, disabled }: ProvinceSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedProvince = useMemo(() =>
        provinces.find((p) => String(p.id) === String(value)),
        [provinces, value]);

    const filteredProvinces = useMemo(() => {
        if (!search) return provinces;
        return provinces.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [provinces, search]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center gap-2.5 rounded-2xl border border-gray-100 bg-gray-50/50 px-4 py-3.5 text-sm font-bold text-gray-900 transition-all hover:bg-white focus:bg-white focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
            >
                <svg className="h-5 w-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className={`flex-1 text-left ${selectedProvince ? "truncate" : "text-gray-400"}`}>
                    {selectedProvince ? selectedProvince.name : "Tất cả địa điểm"}
                </span>
                <svg
                    className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-[1.5rem] border border-gray-100 bg-white shadow-[0_30px_60px_-12px_rgba(0,0,0,0.18)] dark:border-slate-700 dark:bg-slate-800 animate-in fade-in zoom-in-95 duration-300 origin-top">
                    {/* Search Input Container */}
                    <div className="p-3">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <svg className="h-4 w-4 text-gray-400 group-focus-within/input:text-brand-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                autoFocus
                                type="text"
                                placeholder="Tìm nhanh tỉnh thành..."
                                value={search}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                                className="w-full rounded-xl border-0 bg-gray-50/80 px-9 py-2.5 text-sm font-medium text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-brand-500/20 dark:bg-slate-900 dark:text-white dark:placeholder-gray-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="h-px bg-gray-50 dark:bg-slate-700" />

                    {/* Provinces List */}
                    <div className="max-h-[340px] overflow-y-auto p-1.5 space-y-0.5 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-700">
                        {/* Option: All (If applicable or as placeholder) */}
                        {!search && (
                            <button
                                key="all"
                                type="button"
                                onClick={() => {
                                    onChange("");
                                    setIsOpen(false);
                                    setSearch("");
                                }}
                                className={`group flex w-full items-center gap-3 px-3 py-3 text-sm font-bold rounded-xl transition-all ${value === ""
                                        ? "bg-brand-600 text-white shadow-lg shadow-brand-500/30"
                                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-slate-700/50"
                                    }`}
                            >
                                <div className="flex h-5 w-5 items-center justify-center shrink-0">
                                    {value === "" && (
                                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <span className="flex-1 text-left truncate">Tất cả tỉnh thành</span>
                            </button>
                        )}

                        {filteredProvinces.map((province: Province) => {
                            const isSelected = String(value) === String(province.id);
                            return (
                                <button
                                    key={province.id}
                                    type="button"
                                    onClick={() => {
                                        onChange(province.id);
                                        setIsOpen(false);
                                        setSearch("");
                                    }}
                                    className={`group flex w-full items-center gap-3 px-3 py-3 text-sm font-bold rounded-xl transition-all ${isSelected
                                            ? "bg-brand-600 text-white shadow-lg shadow-brand-500/30"
                                            : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-slate-700/50"
                                        }`}
                                >
                                    <div className="flex h-5 w-5 items-center justify-center shrink-0">
                                        {isSelected && (
                                            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className={`flex-1 text-left truncate ${!isSelected ? "group-hover:translate-x-1" : ""} transition-transform`}>
                                        {province.name}
                                    </span>
                                </button>
                            );
                        })}

                        {filteredProvinces.length === 0 && search && (
                            <div className="px-3 py-10 text-center">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Không tìm thấy kết quả</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
