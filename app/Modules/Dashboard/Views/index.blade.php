@extends('layouts.app')

@section('title', 'Bảng điều khiển')

@section('content')
<div class="row">
    <!-- Welcome Card -->
    <div class="col-lg-12 mb-4 order-0">
        <div class="card">
            <div class="d-flex align-items-end row">
                <div class="col-sm-7">
                    <div class="card-body">
                        <h5 class="card-title text-primary">Xin chào {{ Auth::user()->name }}! 🎉</h5>
                        <p class="mb-4">
                            Hệ thống GoOuty đang hoạt động ổn định. Dưới đây là tóm tắt dữ liệu hệ thống.
                        </p>
                    </div>
                </div>
                <div class="col-sm-5 text-center text-sm-left">
                    <div class="card-body pb-0 px-0 px-md-4">
                        <img
                            src="{{ asset('assets/img/illustrations/man-with-laptop-light.png') }}"
                            height="100"
                            alt="View Badge User"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Stats Cards -->
    <div class="col-lg-3 col-md-6 col-6 mb-4">
        <div class="card">
            <div class="card-body">
                <div class="card-title d-flex align-items-start justify-content-between">
                    <div class="avatar flex-shrink-0">
                        <span class="avatar-initial rounded bg-label-primary"><i class="bx bx-user"></i></span>
                    </div>
                </div>
                <span class="fw-semibold d-block mb-1">Tổng người dùng</span>
                <h3 class="card-title mb-2">{{ number_format($stats['total_users']) }}</h3>
            </div>
        </div>
    </div>
    <div class="col-lg-3 col-md-6 col-6 mb-4">
        <div class="card">
            <div class="card-body">
                <div class="card-title d-flex align-items-start justify-content-between">
                    <div class="avatar flex-shrink-0">
                        <span class="avatar-initial rounded bg-label-success"><i class="bx bx-map"></i></span>
                    </div>
                </div>
                <span class="fw-semibold d-block mb-1">Tổng chuyến đi</span>
                <h3 class="card-title mb-2">{{ number_format($stats['total_trips']) }}</h3>
            </div>
        </div>
    </div>
    <div class="col-lg-3 col-md-6 col-6 mb-4">
        <div class="card">
            <div class="card-body">
                <div class="card-title d-flex align-items-start justify-content-between">
                    <div class="avatar flex-shrink-0">
                        <span class="avatar-initial rounded bg-label-info"><i class="bx bx-wallet"></i></span>
                    </div>
                </div>
                <span class="fw-semibold d-block mb-1">Tổng chi tiêu</span>
                <h3 class="card-title mb-2">{{ number_format($stats['total_expenses'], 0, ',', '.') }} đ</h3>
            </div>
        </div>
    </div>
    <div class="col-lg-3 col-md-6 col-6 mb-4">
        <div class="card">
            <div class="card-body">
                <div class="card-title d-flex align-items-start justify-content-between">
                    <div class="avatar flex-shrink-0">
                        <span class="avatar-initial rounded bg-label-warning"><i class="bx bx-transfer"></i></span>
                    </div>
                </div>
                <span class="fw-semibold d-block mb-1">Tất toán</span>
                <h3 class="card-title mb-2">{{ number_format($stats['total_settlements']) }}</h3>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <!-- User Growth Chart -->
    <div class="col-md-8 col-lg-8 mb-4">
        <div class="card">
            <div class="card-header d-flex align-items-center justify-content-between">
                <h5 class="card-title m-0 me-2">Tăng trưởng người dùng</h5>
            </div>
            <div class="card-body">
                <div id="userGrowthChart"></div>
            </div>
        </div>
    </div>

    <!-- Province Distribution -->
    <div class="col-md-4 col-lg-4 mb-4">
        <div class="card h-100">
            <div class="card-header d-flex align-items-center justify-content-between">
                <h5 class="card-title m-0 me-2">Điểm đến phổ biến</h5>
            </div>
            <div class="card-body">
                <ul class="p-0 m-0">
                    @forelse($provinceStats as $province)
                    <li class="d-flex mb-4 pb-1">
                        <div class="avatar flex-shrink-0 me-3">
                            <span class="avatar-initial rounded bg-label-secondary"><i class="bx bx-pin"></i></span>
                        </div>
                        <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                            <div class="me-2">
                                <h6 class="mb-0">{{ $province->name }}</h6>
                            </div>
                            <div class="user-progress d-flex align-items-center gap-1">
                                <span class="text-muted">Chuyến đi:</span>
                                <h6 class="mb-0">{{ $province->total }}</h6>
                            </div>
                        </div>
                    </li>
                    @empty
                    <li class="text-center text-muted">Chưa có dữ liệu</li>
                    @endforelse
                </ul>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <!-- Recent Trips Table -->
    <div class="col-md-6 col-lg-6 mb-4">
        <div class="card h-100">
            <div class="card-header d-flex align-items-center justify-content-between">
                <h5 class="card-title m-0 me-2">Chuyến đi mới nhất</h5>
            </div>
            <div class="table-responsive text-nowrap">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Tên chuyến đi</th>
                            <th>Người tạo</th>
                            <th>Ngày tạo</th>
                        </tr>
                    </thead>
                    <tbody class="table-border-bottom-0">
                        @forelse($recentTrips as $trip)
                        <tr>
                            <td><strong>{{ $trip->title }}</strong></td>
                            <td>{{ $trip->creator_name ?? $trip->creator_email ?? 'Ẩn danh' }}</td>
                            <td>{{ \Carbon\Carbon::parse($trip->createdAt)->format('d/m/Y') }}</td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="3" class="text-center">Chưa có dữ liệu</td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Recent Transactions -->
    <div class="col-md-6 col-lg-6 mb-4">
        <div class="card h-100">
            <div class="card-header d-flex align-items-center justify-content-between">
                <h5 class="card-title m-0 me-2">Giao dịch gần đây</h5>
            </div>
            <div class="table-responsive text-nowrap">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Từ</th>
                            <th>Đến</th>
                            <th>Số tiền</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody class="table-border-bottom-0">
                        @forelse($recentTransactions as $tx)
                        <tr>
                            <td>{{ $tx->from_name ?? 'N/A' }}</td>
                            <td>{{ $tx->to_name ?? 'N/A' }}</td>
                            <td>{{ number_format($tx->amount, 0, ',', '.') }} đ</td>
                            <td>
                                <span class="badge bg-label-{{ $tx->status == 'success' ? 'success' : 'warning' }}">
                                    {{ $tx->status }}
                                </span>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="4" class="text-center">Chưa có dữ liệu</td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
<script>
    document.addEventListener('DOMContentLoaded', function () {
        // User Growth Chart
        const growthData = @json($userGrowth);
        const growthOptions = {
            series: [{
                name: 'Người dùng mới',
                data: growthData.map(item => item.count)
            }],
            chart: {
                height: 350,
                type: 'area',
                toolbar: { show: false }
            },
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth' },
            xaxis: {
                categories: growthData.map(item => item.month)
            },
            colors: ['#696cff'],
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [0, 90, 100]
                }
            }
        };

        const growthChart = new ApexCharts(document.querySelector("#userGrowthChart"), growthOptions);
        growthChart.render();
    });
</script>
@endsection
