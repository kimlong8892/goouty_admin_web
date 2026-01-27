"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { toast } from "react-hot-toast";

export default function CreateFromUrlModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) {
            toast.error("Please enter a URL");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Submitting template creation request...");
        try {
            const response = await fetch('/api/trip-templates/create-from-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url })
            });

            const data = await response.json().catch(() => ({}));

            if (response.ok) {
                toast.success(data.message || "Template creation request submitted successfully!", { id: toastId });
                setIsOpen(false);
                setUrl("");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                toast.error(data.error || data.message || "Failed to submit request. Please try again.", { id: toastId });
            }
        } catch (error) {
            console.error("Error submitting template request:", error);
            toast.error("An error occurred. Please try again.", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-[0_20px_40px_-15px_rgba(54,65,245,0.3)] transition-all hover:scale-[1.02] hover:shadow-brand-500/40 active:scale-95"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-500 group-hover:translate-x-full -translate-x-full" />
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
                Create from URL
            </button>

            <Modal isOpen={isOpen} onClose={() => !loading && setIsOpen(false)} className="max-w-lg p-8">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Template from URL</h2>
                        <p className="mt-1 text-sm text-gray-500">Import trip details from video URL.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                ) : "Submit"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
