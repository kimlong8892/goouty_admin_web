import React from "react";
import { GroupIcon, BoxIcon, DollarLineIcon, ShootingStarIcon } from "@/icons";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                    <h4 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
                        {value}
                    </h4>
                </div>
                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${color} text-white`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
};

interface DashboardStatsProps {
    stats: {
        userCount: number;
        tripCount: number;
        totalExpense: number;
        provinceCount: number;
    };
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            <StatCard
                title="Total Users"
                value={stats.userCount}
                icon={<GroupIcon className="h-6 w-6" />}
                color="bg-blue-500"
            />
            <StatCard
                title="Total Trips"
                value={stats.tripCount}
                icon={<BoxIcon className="h-6 w-6" />}
                color="bg-emerald-500"
            />
            <StatCard
                title="Total Expenses"
                value={new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(stats.totalExpense || 0)}
                icon={<DollarLineIcon className="h-6 w-6" />}
                color="bg-orange-500"
            />
            <StatCard
                title="Provinces"
                value={stats.provinceCount}
                icon={<ShootingStarIcon className="h-6 w-6" />}
                color="bg-purple-500"
            />
        </div>
    );
};

export default DashboardStats;
