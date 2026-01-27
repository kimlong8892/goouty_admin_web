"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AutoRefresh() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(30);
    const [isEnabled, setIsEnabled] = useState(true);

    useEffect(() => {
        if (!isEnabled) return;

        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    router.refresh();
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [router, isEnabled]);

    const handleManualRefresh = () => {
        router.refresh();
        setCountdown(30);
    };

    const toggleAutoRefresh = () => {
        setIsEnabled(!isEnabled);
        if (!isEnabled) {
            setCountdown(30);
        }
    };

    return (
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white/50 px-4 py-2.5 backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-800/50">
            {/* Auto-refresh toggle */}
            <button
                onClick={toggleAutoRefresh}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${isEnabled
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                    }`}
            >
                <div className="relative">
                    <svg
                        className={`h-4 w-4 ${isEnabled ? "animate-spin" : ""}`}
                        style={{ animationDuration: "3s" }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                    {isEnabled && (
                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                        </span>
                    )}
                </div>
                <span>{isEnabled ? "Auto" : "Off"}</span>
            </button>

            {/* Countdown */}
            {isEnabled && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span className="font-mono font-bold">{countdown}s</span>
                </div>
            )}

            {/* Manual refresh button */}
            <button
                onClick={handleManualRefresh}
                className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-brand-700 active:scale-95"
            >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                </svg>
                Refresh
            </button>
        </div>
    );
}
