@extends('layouts.app')

@section('title', 'Danh sách Mẫu chuyến đi')

@section('content')
<div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Danh sách Mẫu chuyến đi</h5>
        <a href="{{ route('trip-templates.create') }}" class="btn btn-primary">Thêm mới</a>
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
                    <td>{{ $template->provinceId ?? 'N/A' }}</td>
                    <td>
                        @if($template->isPublic)
                            <span class="badge bg-label-success me-1">Có</span>
                        @else
                            <span class="badge bg-label-secondary me-1">Không</span>
                        @endif
                    </td>
                    <td>{{ $template->createdAt }}</td>
                    <td>
                        <div class="dropdown">
                            <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                <i class="bx bx-dots-vertical-rounded"></i>
                            </button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="{{ route('trip-templates.edit', $template->id) }}">
                                    <i class="bx bx-edit-alt me-1"></i> Sửa
                                </a>
                                <form action="{{ route('trip-templates.destroy', $template->id) }}" method="POST" onsubmit="return confirm('Bạn có chắc chắn muốn xóa?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="dropdown-item text-danger">
                                        <i class="bx bx-trash me-1"></i> Xóa
                                    </button>
                                </form>
                            </div>
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
