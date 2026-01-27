"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { toast } from "react-hot-toast";

type UrlResult = {
    url: string;
    status: 'pending' | 'success' | 'error';
    message?: string;
};

export default function CreateFromUrlModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [urls, setUrls] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<UrlResult[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Parse URLs from textarea (one per line)
        const urlList = urls
            .split('\n')
            .map(u => u.trim())
            .filter(u => u.length > 0);

        if (urlList.length === 0) {
            toast.error("Please enter at least one URL");
            return;
        }

        setLoading(true);
        setResults(urlList.map(url => ({ url, status: 'pending' })));

        let successCount = 0;
        let errorCount = 0;

        // Process each URL
        for (let i = 0; i < urlList.length; i++) {
            const url = urlList[i];

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
                    successCount++;
                    setResults(prev => prev.map((r, idx) =>
                        idx === i ? { ...r, status: 'success', message: data.message || 'Success' } : r
                    ));
                } else {
                    errorCount++;
                    setResults(prev => prev.map((r, idx) =>
                        idx === i ? {
                            ...r,
                            status: 'error',
                            message: data.error || data.message || 'Failed to submit request'
                        } : r
                    ));
                }
            } catch (error) {
                errorCount++;
                setResults(prev => prev.map((r, idx) =>
                    idx === i ? {
                        ...r,
                        status: 'error',
                        message: error instanceof Error ? error.message : 'An error occurred'
                    } : r
                ));
            }
        }

        setLoading(false);

        // Show summary toast
        if (errorCount === 0) {
            toast.success(`All ${successCount} template(s) submitted successfully!`);
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else if (successCount === 0) {
            toast.error(`All ${errorCount} template(s) failed. Check errors below.`);
        } else {
            toast.success(`${successCount} succeeded, ${errorCount} failed. Check details below.`);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setIsOpen(false);
            setUrls("");
            setResults([]);
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

            <Modal isOpen={isOpen} onClose={handleClose} className="max-w-2xl p-8">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Templates from URLs</h2>
                        <p className="mt-1 text-sm text-gray-500">Enter one or multiple URLs (one per line) to import trip details.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="urls" className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                URLs (one per line)
                            </label>
                            <textarea
                                id="urls"
                                value={urls}
                                onChange={(e) => setUrls(e.target.value)}
                                placeholder="https://example.com/video1&#10;https://example.com/video2&#10;https://example.com/video3"
                                rows={6}
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-mono transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800/50 resize-none"
                                required
                                disabled={loading}
                            />
                            <p className="text-xs text-gray-500">
                                {urls.split('\n').filter(u => u.trim().length > 0).length} URL(s) entered
                            </p>
                        </div>

                        {/* Results Section */}
                        {results.length > 0 && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                    Processing Results
                                </label>
                                <div className="max-h-64 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {results.map((result, idx) => (
                                            <div key={idx} className="p-3 flex items-start gap-3">
                                                {/* Status Icon */}
                                                <div className="flex-shrink-0 mt-0.5">
                                                    {result.status === 'pending' && (
                                                        <svg className="h-5 w-5 text-blue-500 animate-spin" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                        </svg>
                                                    )}
                                                    {result.status === 'success' && (
                                                        <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                    {result.status === 'error' && (
                                                        <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    )}
                                                </div>

                                                {/* URL and Message */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate" title={result.url}>
                                                        {result.url}
                                                    </p>
                                                    {result.message && (
                                                        <p className={`text-xs mt-1 ${result.status === 'error'
                                                                ? 'text-red-600 dark:text-red-400'
                                                                : 'text-emerald-600 dark:text-emerald-400'
                                                            }`}>
                                                            {result.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={loading}
                                className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-bold text-gray-600 transition-all hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-400"
                            >
                                {results.length > 0 && !loading ? 'Close' : 'Cancel'}
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
                                        Processing...
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
