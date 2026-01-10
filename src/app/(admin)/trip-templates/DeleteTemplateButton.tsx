"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteTemplateButton({ id }: { id: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this template? This action cannot be undone.")) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/trip-templates/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                router.refresh();
            } else {
                alert("Failed to delete template");
            }
        } catch (error) {
            console.error("Error deleting template:", error);
            alert("Failed to delete template");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                handleDelete();
            }}
            disabled={isDeleting}
            className="group/delete flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-all hover:bg-red-500 hover:text-white dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white disabled:opacity-50"
            title="Delete Template"
        >
            {isDeleting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
                <svg className="h-5 w-5 transition-transform group-hover/delete:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            )}
        </button>
    );
}
