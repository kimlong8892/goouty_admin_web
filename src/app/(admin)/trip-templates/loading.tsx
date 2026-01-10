export default function TripTemplatesLoading() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-3">
                    <div className="h-12 w-64 rounded-2xl bg-gray-200 dark:bg-gray-800" />
                    <div className="h-5 w-80 rounded-xl bg-gray-200 dark:bg-gray-800" />
                </div>
                <div className="h-14 w-48 rounded-2xl bg-gray-200 dark:bg-gray-800" />
            </div>

            {/* Filters Skeleton */}
            <div className="h-20 w-full rounded-[2rem] border border-gray-100 bg-white/50 dark:border-gray-800 dark:bg-gray-900/50" />

            {/* Grid Skeleton */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div className="aspect-[4/3] w-full bg-gray-200 dark:bg-gray-800" />
                        <div className="space-y-4 p-8">
                            <div className="flex gap-2">
                                <div className="h-4 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
                                <div className="h-4 w-12 rounded-full bg-gray-200 dark:bg-gray-800" />
                            </div>
                            <div className="h-8 w-3/4 rounded-xl bg-gray-200 dark:bg-gray-800" />
                            <div className="space-y-2">
                                <div className="h-4 w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
                                <div className="h-4 w-2/3 rounded-lg bg-gray-200 dark:bg-gray-800" />
                            </div>
                            <div className="flex items-center justify-between border-t border-gray-50 pt-6 dark:border-gray-800">
                                <div className="space-y-2">
                                    <div className="h-3 w-12 rounded bg-gray-200 dark:bg-gray-800" />
                                    <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-800" />
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-800" />
                                    <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-800" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
