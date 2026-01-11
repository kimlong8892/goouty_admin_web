"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { toast } from "react-hot-toast";

interface Props {
    n8nUrl: string;
}

export default function CreateFromApiButton({ n8nUrl }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [platform, setPlatform] = useState<"tiktok" | "youtube">("tiktok");
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) {
            toast.error("Please enter a URL");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Sending request to n8n...");
        try {
            const apiUrl = `${n8nUrl}?platform=${platform}&url=${encodeURIComponent(url)}`;
            const response = await fetch(apiUrl, {
                method: 'GET',
            });

            const data = await response.json().catch(() => ({}));

            if (response.ok) {
                toast.success(data.message || "Template creation started successfully!", { id: toastId });
                setIsOpen(false);
                setUrl("");
                alert(data.message || "Template creation started successfully!");
                window.location.reload();
            } else {
                toast.error(data.details || data.message || "Failed to create template. Please try again.", { id: toastId });
            }
        } catch (error) {
            console.error("Error creating template:", error);
            toast.error("An error occurred. Please try again.", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
                <svg className="mr-2 h-4 w-4 text-gray-400 group-hover:text-brand-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Create from Youtube / Tiktok
            </button>

            <Modal isOpen={isOpen} onClose={() => !loading && setIsOpen(false)} className="max-w-lg p-8">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Template from URL</h2>
                        <p className="mt-1 text-sm text-gray-500">Import trip details from TikTok or YouTube videos.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Platform</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setPlatform("tiktok")}
                                    className={`flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-bold transition-all ${platform === "tiktok"
                                        ? "bg-black text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                                        }`}
                                >
                                    TikTok
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPlatform("youtube")}
                                    className={`flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-bold transition-all ${platform === "youtube"
                                        ? "bg-red-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                                        }`}
                                >
                                    YouTube
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="url" className="text-sm font-bold text-gray-700 dark:text-gray-300">URL</label>
                            <input
                                id="url"
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800/50"
                                required
                            />
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                disabled={loading}
                                className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-bold text-gray-600 transition-all hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-[2] rounded-xl bg-brand-600 py-3 text-sm font-bold text-white transition-all hover:bg-brand-700 disabled:opacity-50 inline-flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Creating...
                                    </>
                                ) : "Start Import"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
