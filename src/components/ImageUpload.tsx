"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

interface ImageUploadProps {
    value?: string; // Existing image URL
    onChange: (file: File | null) => void;
    onRemove?: () => void;
    disabled?: boolean;
    className?: string;
}

export default function ImageUpload({ value, onChange, onRemove, disabled, className = "" }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | undefined>(value);

    // Update preview if value changes from outside (e.g. initial data)
    useEffect(() => {
        if (value) setPreview(value);
    }, [value]);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length === 0) return;

            const file = acceptedFiles[0];

            // Create local preview
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            // Pass file to parent
            onChange(file);
        },
        [onChange]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".webp"],
        },
        maxFiles: 1,
        disabled: disabled,
    });

    return (
        <div className={`flex flex-col h-full w-full ${className}`}>
            <div
                {...getRootProps()}
                className={`
                    relative flex-1 w-full cursor-pointer flex-col items-center justify-center
                    rounded-[2rem] border-2 border-dashed transition-all duration-300
                    ${isDragActive ? "border-primary bg-primary/5 scale-[0.98]" : "border-gray-200 bg-gray-50/30 dark:border-gray-800 dark:bg-gray-900/30"}
                    ${disabled ? "cursor-not-allowed opacity-50" : "hover:border-primary/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"}
                `}
            >
                <input {...getInputProps()} />

                {preview ? (
                    <div className="relative h-full w-full p-2">
                        <div className="relative h-full w-full overflow-hidden rounded-[1.5rem] shadow-inner">
                            <Image
                                src={preview}
                                alt="Preview"
                                fill
                                className="object-cover transition-transform duration-500 hover:scale-105"
                                unoptimized={true} // Always unoptimized for S3 and blobs to avoid proxy issues
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center px-6 text-center">
                        <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700">
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
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <p className="text-sm font-black text-gray-900 dark:text-white">
                            {isDragActive ? "Release to drop" : "Select Cover Image"}
                        </p>
                        <p className="mt-1 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            JPEG, PNG, WebP (Max 5MB)
                        </p>
                    </div>
                )}
            </div>
            {preview && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setPreview(undefined);
                        onChange(null);
                        if (onRemove) onRemove();
                    }}
                    disabled={disabled}
                    className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl py-2 text-xs font-black uppercase tracking-widest text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove Visual
                </button>
            )}
        </div>
    );
}
