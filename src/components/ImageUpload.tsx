"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    disabled?: boolean;
}

export default function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | undefined>(value);

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            if (acceptedFiles.length === 0) return;

            const file = acceptedFiles[0];
            setUploading(true);

            try {
                // Create preview
                const objectUrl = URL.createObjectURL(file);
                setPreview(objectUrl);

                // Upload to S3
                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("Upload failed");
                }

                const data = await response.json();
                onChange(data.url);
                setPreview(data.url);
            } catch (error) {
                console.error("Error uploading image:", error);
                alert("Failed to upload image");
                setPreview(value);
            } finally {
                setUploading(false);
            }
        },
        [onChange, value]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".webp"],
        },
        maxFiles: 1,
        disabled: disabled || uploading,
    });

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`
          relative flex h-64 cursor-pointer flex-col items-center justify-center
          rounded-lg border-2 border-dashed transition-colors
          ${isDragActive ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-600"}
          ${disabled || uploading ? "cursor-not-allowed opacity-50" : "hover:border-primary"}
        `}
            >
                <input {...getInputProps()} />

                {preview ? (
                    <div className="relative h-full w-full">
                        <Image
                            src={preview}
                            alt="Preview"
                            fill
                            className="rounded-lg object-cover"
                        />
                        {uploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                        >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {isDragActive ? "Drop the image here" : "Drag & drop an image, or click to select"}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">PNG, JPG, WebP up to 5MB</p>
                    </div>
                )}
            </div>

            {preview && !uploading && (
                <button
                    type="button"
                    onClick={() => {
                        setPreview(undefined);
                        onChange("");
                    }}
                    disabled={disabled}
                    className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                >
                    Remove image
                </button>
            )}
        </div>
    );
}
