"use client";

import { useEffect } from "react";
import Button from "@/components/ui/button/Button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
                Something went wrong!
            </h2>
            <div className="max-w-md p-4 mb-6 text-sm text-left bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 font-mono overflow-auto">
                <p className="font-bold mb-2">Error Details:</p>
                <p>{error.message || "An unexpected error occurred."}</p>
                {error.digest && <p className="mt-2 text-xs opacity-50">Digest: {error.digest}</p>}
            </div>
            <Button
                onClick={() => reset()}
                className="px-6 py-2 transition-transform active:scale-95"
            >
                Try again
            </Button>
        </div>
    );
}
