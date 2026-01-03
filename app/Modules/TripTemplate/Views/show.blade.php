@extends('layouts.app')

@section('title', 'Chi tiết Mẫu chuyến đi')

@section('content')
<div class="row">
    <!-- Template Info -->
    <div class="col-md-12">
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Thông tin Mẫu chuyến đi</h5>
                <div>
                    <a href="{{ route('trip-templates.edit', $template->id) }}" class="btn btn-primary btn-sm">
                        <i class="bx bx-edit me-1"></i> Chỉnh sửa
                    </a>
                    <a href="{{ route('trip-templates.index') }}" class="btn btn-outline-secondary btn-sm">
                        <i class="bx bx-arrow-back me-1"></i> Quay lại
                    </a>
                </div>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-3">
                        @if($template->avatar)
                            <img src="{{ $template->avatar }}" alt="Avatar" class="img-fluid rounded mb-3">
                        @else
                            <div class="bg-light d-flex align-items-center justify-content-center rounded mb-3" style="height: 200px;">
                                <i class="bx bx-image-alt" style="font-size: 3rem; color: #ccc;"></i>
                            </div>
                        @endif
                    </div>
                    <div class="col-md-9">
                        <table class="table table-borderless">
                            <tr>
                                <th style="width: 150px;">Tiêu đề:</th>
                                <td>{{ $template->title }}</td>
                            </tr>
                            <tr>
                                <th>Tỉnh thành:</th>
                                <td>{{ $template->province?->name ?? 'N/A' }}</td>
                            </tr>
                            <tr>
                                <th>Mô tả:</th>
                                <td>{{ $template->description ?: 'Không có mô tả' }}</td>
                            </tr>
                            <tr>
                                <th>Trạng thái:</th>
                                <td>
                                    @if($template->isPublic)
                                        <span class="badge bg-success">Công khai</span>
                                    @else
                                        <span class="badge bg-secondary">Riêng tư</span>
                                    @endif
                                </td>
                            </tr>
                            <tr>
                                <th>Người tạo:</th>
                                <td>{{ $template->user?->fullName ?? 'N/A' }} ({{ $template->user?->email }})</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Days and Activities -->
    <div class="col-md-12">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="mb-0">Lịch trình chi tiết ({{ $template->days->count() }} ngày)</h5>
            <button type="button" class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#addDayModal">
                <i class="bx bx-plus me-1"></i> Thêm ngày
            </button>
        </div>
        
        @forelse($template->days as $day)
            <div class="card mb-3 border-left-primary">
                <div class="card-header bg-light d-flex justify-content-between align-items-center py-2">
                    <h6 class="mb-0">
                        <strong>Ngày {{ $day->dayOrder }}: {{ $day->title }}</strong>
                        @if($day->description)
                            <small class="text-muted ms-2">- {{ $day->description }}</small>
                        @endif
                    </h6>
                    <div class="btn-group">
                        <button type="button" class="btn btn-outline-primary btn-xs" data-bs-toggle="modal" data-bs-target="#addActivityModal{{ $day->id }}">
                            <i class="bx bx-plus"></i> Hoạt động
                        </button>
                        <button type="button" class="btn btn-outline-secondary btn-xs" data-bs-toggle="modal" data-bs-target="#editDayModal{{ $day->id }}">
                            <i class="bx bx-edit"></i>
                        </button>
                        <form action="{{ route('trip-template-days.destroy', $day->id) }}" method="POST" class="ajax-delete" style="display:inline;">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-outline-danger btn-xs">
                                <i class="bx bx-trash"></i>
                            </button>
                        </form>
                    </div>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th style="width: 50px;">STT</th>
                                    <th style="width: 100px;">Thời gian</th>
                                    <th>Hoạt động</th>
                                    <th>Địa điểm</th>
                                    <th>Ghi chú</th>
                                    <th style="width: 80px;">Quan trọng</th>
                                    <th style="width: 100px;">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($day->activities as $activity)
                                    <tr>
                                        <td>{{ $activity->activityOrder }}</td>
                                        <td>{{ $activity->startTime ?: '--:--' }}</td>
                                        <td>
                                            <strong>{{ $activity->title }}</strong>
                                            @if($activity->durationMin)
                                                <br><small class="text-muted">Lượng: {{ $activity->durationMin }} phút</small>
                                            @endif
                                        </td>
                                        <td>{{ $activity->location ?: '-' }}</td>
                                        <td>{{ $activity->notes ?: '-' }}</td>
                                        <td>
                                            @if($activity->important)
                                                <i class="bx bxs-star text-warning"></i>
                                            @else
                                                <i class="bx bx-star text-muted"></i>
                                            @endif
                                        </td>
                                        <td>
                                            <button type="button" class="btn btn-sm btn-icon" data-bs-toggle="modal" data-bs-target="#editActivityModal{{ $activity->id }}">
                                                <i class="bx bx-edit text-info"></i>
                                            </button>
                                            <form action="{{ route('trip-template-activities.destroy', $activity->id) }}" method="POST" class="ajax-delete" style="display:inline;">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="btn btn-sm btn-icon">
                                                    <i class="bx bx-trash text-danger"></i>
                                                </button>
                                            </form>
                                        </td>
                                    </tr>

                                    <!-- Edit Activity Modal -->
                                    <div class="modal fade" id="editActivityModal{{ $activity->id }}" tabindex="-1" aria-hidden="true">
                                        <div class="modal-dialog">
                                            <form action="{{ route('trip-template-activities.update', $activity->id) }}" method="POST" class="ajax-form">
                                                @csrf
                                                @method('PUT')
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h5 class="modal-title">Chỉnh sửa hoạt động</h5>
                                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div class="modal-body">
                                                        <div class="row">
                                                            <div class="col-md-9 mb-3">
                                                                <label class="form-label">Tên hoạt động</label>
                                                                <input type="text" name="title" class="form-control" value="{{ $activity->title }}">
                                                            </div>
                                                            <div class="col-md-3 mb-3">
                                                                <label class="form-label">STT</label>
                                                                <input type="number" name="activityOrder" class="form-control" value="{{ $activity->activityOrder }}">
                                                            </div>
                                                        </div>
                                                        <div class="row">
                                                            <div class="col-md-6 mb-3">
                                                                <label class="form-label">Thời gian bắt đầu</label>
                                                                <input type="text" name="startTime" class="form-control" placeholder="HH:mm" value="{{ $activity->startTime }}">
                                                            </div>
                                                            <div class="col-md-6 mb-3">
                                                                <label class="form-label">Thời lượng (phút)</label>
                                                                <input type="number" name="durationMin" class="form-control" value="{{ $activity->durationMin }}">
                                                            </div>
                                                        </div>
                                                        <div class="mb-3">
                                                            <label class="form-label">Địa điểm</label>
                                                            <input type="text" name="location" class="form-control" value="{{ $activity->location }}">
                                                        </div>
                                                        <div class="mb-3">
                                                            <label class="form-label">Ghi chú</label>
                                                            <textarea name="notes" class="form-control" rows="2">{{ $activity->notes }}</textarea>
                                                        </div>
                                                        <div class="form-check form-switch">
                                                            <input type="checkbox" name="important" class="form-check-input" id="important{{ $activity->id }}" {{ $activity->important ? 'checked' : '' }}>
                                                            <label class="form-check-label" for="important{{ $activity->id }}"><i class="bx bx-star me-1"></i> Quan trọng</label>
                                                        </div>
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                                                            <i class="bx bx-x me-1"></i> Đóng
                                                        </button>
                                                        <button type="submit" class="btn btn-primary">
                                                            <i class="bx bx-check me-1"></i> Lưu thay đổi
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                @empty
                                    <tr>
                                        <td colspan="7" class="text-center py-3">Chưa có hoạt động nào cho ngày này.</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Edit Day Modal -->
            <div class="modal fade" id="editDayModal{{ $day->id }}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <form action="{{ route('trip-template-days.update', $day->id) }}" method="POST" class="ajax-form">
                        @csrf
                        @method('PUT')
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Chỉnh sửa ngày</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-md-9 mb-3">
                                        <label class="form-label">Tiêu đề</label>
                                        <input type="text" name="title" class="form-control" value="{{ $day->title }}">
                                    </div>
                                    <div class="col-md-3 mb-3">
                                        <label class="form-label">Thứ tự ngày</label>
                                        <input type="number" name="dayOrder" class="form-control" value="{{ $day->dayOrder }}">
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Mô tả</label>
                                    <textarea name="description" class="form-control" rows="2">{{ $day->description }}</textarea>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                                    <i class="bx bx-x me-1"></i> Đóng
                                </button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="bx bx-check me-1"></i> Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Add Activity Modal -->
            <div class="modal fade" id="addActivityModal{{ $day->id }}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <form action="{{ route('trip-template-activities.store', $day->id) }}" method="POST" class="ajax-form">
                        @csrf
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Thêm hoạt động mới cho {{ $day->title }}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-md-9 mb-3">
                                        <label class="form-label">Tên hoạt động</label>
                                        <input type="text" name="title" class="form-control" placeholder="VD: Ăn sáng tại khách sạn">
                                    </div>
                                    <div class="col-md-3 mb-3">
                                        <label class="form-label">STT</label>
                                        <input type="number" name="activityOrder" class="form-control" value="{{ $day->activities->count() + 1 }}">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Thời gian bắt đầu</label>
                                        <input type="text" name="startTime" class="form-control" placeholder="HH:mm">
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Thời lượng (phút)</label>
                                        <input type="number" name="durationMin" class="form-control">
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Địa điểm</label>
                                    <input type="text" name="location" class="form-control">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Ghi chú</label>
                                    <textarea name="notes" class="form-control" rows="2"></textarea>
                                </div>
                                <div class="form-check form-switch">
                                    <input type="checkbox" name="important" class="form-check-input" id="importantNew{{ $day->id }}">
                                    <label class="form-check-label" for="importantNew{{ $day->id }}"><i class="bx bx-star me-1"></i> Quan trọng</label>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                                    <i class="bx bx-x me-1"></i> Đóng
                                </button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="bx bx-plus me-1"></i> Thêm
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        @empty
            <div class="alert alert-warning">
                Mẫu chuyến đi này chưa có lịch trình ngày cụ thể.
            </div>
        @endforelse
    </div>
</div>

<!-- Add Day Modal -->
<div class="modal fade" id="addDayModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <form action="{{ route('trip-template-days.store', $template->id) }}" method="POST" class="ajax-form">
            @csrf
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Thêm ngày mới</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-9 mb-3">
                            <label class="form-label">Tiêu đề</label>
                            <input type="text" name="title" class="form-control" placeholder="VD: Ngày 1: Khám phá thành phố">
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="form-label">Ngày thứ</label>
                            <input type="number" name="dayOrder" class="form-control" value="{{ $template->days->count() + 1 }}">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Mô tả</label>
                        <textarea name="description" class="form-control" rows="2"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                        <i class="bx bx-x me-1"></i> Đóng
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <i class="bx bx-plus me-1"></i> Thêm
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>

@endsection
