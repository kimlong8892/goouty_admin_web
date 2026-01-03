@extends('layouts.app')

@section('title', 'Danh sách Mẫu chuyến đi')

@section('content')
<div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Danh sách Mẫu chuyến đi</h5>
        <a href="{{ route('trip-templates.create') }}" class="btn btn-primary">
            <i class="bx bx-plus me-1"></i> Thêm mới
        </a>
    </div>
    <div class="table-responsive text-nowrap">
        <table class="table">
            <thead>
                <tr>
                    <th>Tiêu đề</th>
                    <th>Tỉnh thành</th>
                    <th>Công khai</th>
                    <th>Ngày tạo</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody class="table-border-bottom-0">
                @foreach($templates as $template)
                <tr>
                    <td><strong>{{ $template->title }}</strong></td>
                    <td>{{ $template->province?->name ?? 'N/A' }}</td>
                    <td>
                        @if($template->isPublic)
                            <span class="badge bg-label-success me-1">Có</span>
                        @else
                            <span class="badge bg-label-secondary me-1">Không</span>
                        @endif
                    </td>
                    <td>{{ $template->createdAt?->format('d/m/Y H:i') ?? 'N/A' }}</td>
                    <td>
                        <div class="d-flex align-items-center">
                            <a class="btn btn-sm btn-icon btn-label-info me-1" href="{{ route('trip-templates.show', $template->id) }}" title="Xem chi tiết">
                                <i class="bx bx-show"></i>
                            </a>
                            <a class="btn btn-sm btn-icon btn-label-primary me-1" href="{{ route('trip-templates.edit', $template->id) }}" title="Sửa">
                                <i class="bx bx-edit-alt"></i>
                            </a>
                            <form action="{{ route('trip-templates.destroy', $template->id) }}" method="POST" class="ajax-delete" style="display: inline;">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-sm btn-icon btn-label-danger" title="Xóa">
                                    <i class="bx bx-trash"></i>
                                </button>
                            </form>
                        </div>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    <div class="card-footer">
        {{ $templates->links('pagination::bootstrap-5') }}
    </div>
</div>
@endsection
