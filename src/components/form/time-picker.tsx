"use client";

import { useEffect, useRef, useState } from "react";
import { TimeIcon } from "@/icons";

interface TimePickerProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
}

export default function TimePicker({ value, onChange, className, placeholder }: TimePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const hourRef = useRef<HTMLDivElement>(null);
    const minuteRef = useRef<HTMLDivElement>(null);

    // Ensure we have a valid time format, default to 09:00
    const timeValue = value || "09:00";
    const [hour, minute] = timeValue.split(":");

    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Scroll to current selection when opened
    useEffect(() => {
        if (isOpen) {
            // Tiny delay to ensure DOM is ready
            const timer = setTimeout(() => {
                if (hourRef.current) {
                    const activeHour = hourRef.current.querySelector(`[data-hour="${hour}"]`);
                    if (activeHour) {
                        activeHour.scrollIntoView({ block: "center", behavior: "auto" });
                    }
                }
                if (minuteRef.current) {
                    const activeMinute = minuteRef.current.querySelector(`[data-minute="${minute}"]`);
                    if (activeMinute) {
                        activeMinute.scrollIntoView({ block: "center", behavior: "auto" });
                    }
                }
            }, 10);
            return () => clearTimeout(timer);
        }
    }, [isOpen, hour, minute]);

    const handleHourChange = (newHour: string) => {
        onChange(`${newHour}:${minute}`);
    };

    const handleMinuteChange = (newMinute: string) => {
        onChange(`${hour}:${newMinute}`);
    };

    return (
        <div className="relative inline-block w-full" ref={containerRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex cursor-pointer items-center justify-between gap-2 px-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl transition-all hover:bg-white focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 ${className}`}
            >
                <div className="flex items-center gap-2">
                    <TimeIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                        {timeValue}
                    </span>
                </div>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 z-[100] flex gap-0.5 bg-white border border-gray-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-2 dark:bg-[#020617] dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-200 min-w-[140px]">
                    {/* Hour Column */}
                    <div ref={hourRef} className="flex flex-col h-48 overflow-y-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overscroll-contain pb-32 pt-2">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center py-2 sticky top-0 bg-white/90 dark:bg-[#020617]/90 backdrop-blur-sm z-10">Giờ</div>
                        {hours.map((h) => (
                            <button
                                key={h}
                                type="button"
                                data-hour={h}
                                onClick={() => handleHourChange(h)}
                                className={`h-8 flex shrink-0 items-center justify-center text-xs font-bold rounded-lg transition-all mx-1 ${h === hour
                                        ? "bg-brand-600 text-white shadow-lg shadow-brand-500/30"
                                        : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800"
                                    }`}
                            >
                                {h}
                            </button>
                        ))}
                    </div>

                    <div className="w-[1px] bg-gray-100 dark:bg-slate-800 self-stretch my-2 shrink-0" />

                    {/* Minute Column */}
                    <div ref={minuteRef} className="flex flex-col h-48 overflow-y-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overscroll-contain pb-32 pt-2">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center py-2 sticky top-0 bg-white/90 dark:bg-[#020617]/90 backdrop-blur-sm z-10">Phút</div>
                        {minutes.map((m) => (
                            <button
                                key={m}
                                type="button"
                                data-minute={m}
                                onClick={() => handleMinuteChange(m)}
                                className={`h-8 flex shrink-0 items-center justify-center text-xs font-bold rounded-lg transition-all mx-1 ${m === minute
                                        ? "bg-brand-600 text-white shadow-lg shadow-brand-500/30"
                                        : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800"
                                    }`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
