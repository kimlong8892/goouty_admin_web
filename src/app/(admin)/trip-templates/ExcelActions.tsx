"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { generateSampleExcel, parseExcelRows, groupRowsToTemplates } from "@/lib/excel-utils";

export default function ExcelActions() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isImporting, setIsImporting] = useState(false);

    const handleDownloadSample = () => {
        try {
            const excelBuffer = generateSampleExcel();
            const blob = new Blob([excelBuffer as any], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'trip_templates_sample.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to generate sample:", error);
            alert("Failed to download sample file");
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset input so same file can be selected again if needed
        e.target.value = "";

        setIsImporting(true);
        try {
            const buffer = await file.arrayBuffer();
            const rows = parseExcelRows(buffer);
            const templates = groupRowsToTemplates(rows);

            if (templates.length === 0) {
                alert("No templates found in file.");
                setIsImporting(false);
                return;
            }

            if (confirm(`Found ${templates.length} templates. Do you want to import them?\n\nTitles:\n${templates.map(t => `- ${t.title}`).join('\n')}`)) {
                const response = await fetch('/api/trip-templates/batch-import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(templates)
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.details || "Import failed");
                }

                const result = await response.json();
                alert(result.message);
                router.refresh();
            }

        } catch (error) {
            console.error("Import error:", error);
            alert(`Error importing file: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={handleDownloadSample}
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 py-3 font-bold text-gray-700 transition-all hover:bg-gray-50 focus:outline-none active:scale-95 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                title="Download Sample Template"
            >
                <svg className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Sample Excel</span>
            </button>

            <div className="relative">
                <input
                    type="file"
                    ref={fileInputRef}
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    className="hidden"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImporting}
                    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gray-900 px-5 py-3 font-bold text-white transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                    {isImporting ? (
                        <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                    )}
                    <span>Import Excel</span>
                </button>
            </div>
        </div>
    );
}
