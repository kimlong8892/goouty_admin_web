import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
interface RecentUsersProps {
    users: any[];
}

const RecentUsers: React.FC<RecentUsersProps> = ({ users }) => {
    return (
        <ComponentCard title="Recent Users" desc="Latest users who joined GoOuty">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead>
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                User
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Email
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Joined
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {users.map((u: any) => (
                            <tr key={u.id}>
                                <td className="whitespace-nowrap px-4 py-3">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 flex-shrink-0">
                                            {u.profilePicture ? (
                                                <img
                                                    className="h-8 w-8 rounded-full object-cover"
                                                    src={u.profilePicture}
                                                    alt=""
                                                />
                                            ) : (
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                                                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                                        {u.fullName?.charAt(0) || u.email.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white/90">
                                                {u.fullName || "N/A"}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                    {u.email}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(u.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </ComponentCard>
    );
};

export default RecentUsers;
