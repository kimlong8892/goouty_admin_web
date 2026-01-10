import type { Metadata } from "next";
import React from "react";
import { auth } from "@/auth";
import { initializeDataSource } from "@/lib/typeorm";
import { User } from "@/entities/User";
import { Trip } from "@/entities/Trip";
import { Expense } from "@/entities/Expense";
import { Province } from "@/entities/Province";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentUsers from "@/components/dashboard/RecentUsers";
import RecentTrips from "@/components/dashboard/RecentTrips";

export const metadata: Metadata = {
  title: "Admin Dashboard | GoOuty",
  description: "Admin Dashboard",
};

export default async function Dashboard() {
  const session = await auth();
  const dataSource = await initializeDataSource();

  const userRepo = dataSource.getRepository(User);
  const tripRepo = dataSource.getRepository(Trip);
  const expenseRepo = dataSource.getRepository(Expense);
  const provinceRepo = dataSource.getRepository(Province);

  // Fetch stats from public schema
  const [userCount, tripCount, totalExpenseResult, provinceCount] = await Promise.all([
    userRepo.count(),
    tripRepo.count(),
    expenseRepo
      .createQueryBuilder("expense")
      .select("SUM(expense.amount)", "sum")
      .getRawOne(),
    provinceRepo.count(),
  ]);

  const recentUsers = await userRepo.find({
    take: 6,
    order: { createdAt: "DESC" },
  });

  const recentTrips = await tripRepo.find({
    take: 6,
    order: { createdAt: "DESC" },
    relations: {
      user: true,
    },
  });

  const totalExpense = totalExpenseResult?.sum ? Number(totalExpenseResult.sum) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Welcome, {session?.user?.name || session?.user?.email}!
        </p>
      </div>

      <DashboardStats
        stats={{
          userCount,
          tripCount,
          totalExpense,
          provinceCount,
        }}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentUsers users={JSON.parse(JSON.stringify(recentUsers))} />
        <RecentTrips trips={JSON.parse(JSON.stringify(recentTrips))} />
      </div>
    </div>
  );
}
