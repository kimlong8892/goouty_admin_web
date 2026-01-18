"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";

interface UploadedFile {
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: Date;
}

export default function MediaPage() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        setIsUploading(true);
        const uploadPromises = acceptedFiles.map(async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", "media-manager");

            try {
                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || "Upload failed");
                }

                const data = await response.json();
                return {
                    name: file.name,
                    url: data.url,
                    type: file.type,
                    size: file.size,
                    uploadedAt: new Date(),
                };
            } catch (error: any) {
                toast.error(`Failed to upload ${file.name}: ${error.message}`);
                return null;
            }
        });

        const results = await Promise.all(uploadPromises);
        const successfulUploads = results.filter((f): f is UploadedFile => f !== null);

        if (successfulUploads.length > 0) {
            setUploadedFiles((prev) => [...successfulUploads, ...prev]);
            toast.success(`Successfully uploaded ${successfulUploads.length} file(s)`);
        }
        setIsUploading(false);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
    });

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            <PageBreadCrumb pageTitle="Media Manager" />

            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
                <ComponentCard title="Upload Files to S3">
                    <div className="p-4 sm:p-7">
                        <div
                            {...getRootProps()}
                            className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-[2rem] border-2 border-dashed transition-all duration-300 ${isDragActive
                                    ? "border-primary bg-primary/5 scale-[0.98]"
                                    : "border-gray-200 bg-gray-50/30 dark:border-gray-800 dark:bg-gray-900/30 hover:border-primary/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                                }`}
                        >
                            <input {...getInputProps()} />

                            <div className="flex flex-col items-center px-6 text-center">
                                <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700">
                                    {isUploading ? (
                                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                                    ) : (
                                        <svg
                                            className="h-8 w-8 text-primary"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <p className="text-sm font-black text-gray-900 dark:text-white">
                                    {isUploading
                                        ? "Uploading files..."
                                        : isDragActive
                                            ? "Release to drop files"
                                            : "Click to upload or drag and drop"}
                                </p>
                                <p className="mt-1 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    Any file type (Max 10MB)
                                </p>
                            </div>
                        </div>
                    </div>
                </ComponentCard>

                {uploadedFiles.length > 0 && (
                    <ComponentCard title="Recent Uploads">
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                        <th className="px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                                            File Name
                                        </th>
                                        <th className="px-4 py-4 font-medium text-black dark:text-white">
                                            Type
                                        </th>
                                        <th className="px-4 py-4 font-medium text-black dark:text-white">
                                            Size
                                        </th>
                                        <th className="px-4 py-4 font-medium text-black dark:text-white">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {uploadedFiles.map((file, key) => (
                                        <tr key={key} className="border-b border-[#eee] dark:border-strokedark">
                                            <td className="px-4 py-5 pl-9 xl:pl-11">
                                                <h5 className="font-medium text-black dark:text-white truncate max-w-[200px]" title={file.name}>
                                                    {file.name}
                                                </h5>
                                                <p className="text-xs text-gray-500">{file.uploadedAt.toLocaleString()}</p>
                                            </td>
                                            <td className="px-4 py-5">
                                                <p className="text-black dark:text-white">
                                                    {file.type.split("/")[1]?.toUpperCase() || "FILE"}
                                                </p>
                                            </td>
                                            <td className="px-4 py-5">
                                                <p className="text-black dark:text-white">{formatSize(file.size)}</p>
                                            </td>
                                            <td className="px-4 py-5">
                                                <div className="flex items-center space-x-3.5">
                                                    <button
                                                        onClick={() => copyToClipboard(file.url)}
                                                        className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
                                                    >
                                                        <svg
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                                            />
                                                        </svg>
                                                        Copy Link
                                                    </button>
                                                    <a
                                                        href={file.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                        View
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </ComponentCard>
                )}
            </div>
        </div>
    );
}
