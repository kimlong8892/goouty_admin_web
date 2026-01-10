import React from "react";
import ComponentCard from "@/components/common/ComponentCard";

interface RecentTripsProps {
    trips: any[];
}

const RecentTrips: React.FC<RecentTripsProps> = ({ trips }) => {
    return (
        <ComponentCard title="Recent Trips" desc="Latest trips created by users">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead>
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Trip Title
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Created By
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Start Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Privacy
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {trips.map((trip: any) => (
                            <tr key={trip.id}>
                                <td className="whitespace-nowrap px-4 py-3">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white/90">
                                        {trip.title}
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                    {trip.user.fullName || trip.user.email}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                    {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : "TBD"}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm">
                                    <span
                                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${trip.isPublic
                                            ? "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-500"
                                            : "bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400"
                                            }`}
                                    >
                                        {trip.isPublic ? "Public" : "Private"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </ComponentCard>
    );
};

export default RecentTrips;
