export default function TripTemplatesLoading() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-4 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="h-10 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Filters Skeleton */}
            <div className="flex gap-4">
                <div className="h-10 flex-1 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-10 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Grid Skeleton */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                        <div className="h-48 animate-pulse bg-gray-200 dark:bg-gray-700" />
                        <div className="space-y-3 p-4">
                            <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                            <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                            <div className="flex gap-2">
                                <div className="h-10 flex-1 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                                <div className="h-10 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
