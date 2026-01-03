<?php

namespace App\Modules\Dashboard\Services;

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardService
{
    /**
     * Get all data required for the admin dashboard.
     *
     * @return array
     */
    public function getDashboardData(): array
    {
        try {
            // 1. Statistics Cards
            $stats = [
                'total_users' => DB::table('public.User')->count(),
                'total_trips' => DB::table('public.Trip')->count(),
                'total_expenses' => DB::table('public.Expense')->sum('amount') ?? 0,
                'total_settlements' => DB::table('public.PaymentSettlement')->count(),
            ];

            // 2. Recent Trips
            $recentTrips = DB::table('public.Trip')
                ->leftJoin('public.User', 'public.Trip.userId', '=', 'public.User.id')
                ->select('public.Trip.*', 'public.User.fullName as creator_name', 'public.User.email as creator_email')
                ->orderBy('public.Trip.createdAt', 'desc')
                ->limit(5)
                ->get();

            // 3. Trip Distribution by Province (Top 5)
            $provinceStats = DB::table('public.Trip')
                ->join('public.Province', 'public.Trip.provinceId', '=', 'public.Province.id')
                ->select('public.Province.name', DB::raw('count("public"."Trip".id) as total'))
                ->groupBy('public.Province.id', 'public.Province.name')
                ->orderBy('total', 'desc')
                ->limit(5)
                ->get();

            // 4. Monthly New Users (Last 6 Months)
            $userGrowth = DB::table('public.User')
                ->select(
                    DB::raw("to_char(\"createdAt\", 'Mon') as month"),
                    DB::raw('count(id) as count'),
                    DB::raw("extract(month from \"createdAt\") as month_num")
                )
                ->where('createdAt', '>=', Carbon::now()->subMonths(6))
                ->groupBy(DB::raw("to_char(\"createdAt\", 'Mon')"), DB::raw("extract(month from \"createdAt\")"))
                ->orderBy('month_num')
                ->get();

            // 5. Recent Transactions
            $recentTransactions = DB::table('public.PaymentTransaction')
                ->leftJoin('public.User as fromUser', 'public.PaymentTransaction.fromUserId', '=', 'fromUser.id')
                ->leftJoin('public.User as toUser', 'public.PaymentTransaction.toUserId', '=', 'toUser.id')
                ->select(
                    'public.PaymentTransaction.*',
                    'fromUser.fullName as from_name',
                    'toUser.fullName as to_name'
                )
                ->orderBy('public.PaymentTransaction.createdAt', 'desc')
                ->limit(5)
                ->get();

            return [
                'stats' => $stats,
                'recentTrips' => $recentTrips,
                'provinceStats' => $provinceStats,
                'userGrowth' => $userGrowth,
                'recentTransactions' => $recentTransactions,
            ];

        } catch (\Exception $e) {
            // Log error if needed: logger($e->getMessage());
            return [
                'stats' => [
                    'total_users' => 0,
                    'total_trips' => 0,
                    'total_expenses' => 0,
                    'total_settlements' => 0,
                ],
                'recentTrips' => collect(),
                'provinceStats' => collect(),
                'userGrowth' => collect(),
                'recentTransactions' => collect(),
            ];
        }
    }
}
