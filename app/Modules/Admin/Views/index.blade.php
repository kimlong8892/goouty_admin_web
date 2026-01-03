@extends('layouts.app')

@section('title', 'Quản lý Admin')

@section('content')
<div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Danh sách Admin</h5>
        <a href="{{ route('admins.create') }}" class="btn btn-primary">Thêm mới</a>
    </div>
    <div class="table-responsive text-nowrap">
        <table class="table">
            <thead>
                <tr>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Ngày tạo</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody class="table-border-bottom-0">
                @foreach($admins as $admin)
                <tr>
                    <td><strong>{{ $admin->name }}</strong></td>
                    <td>{{ $admin->email }}</td>
                    <td>{{ $admin->created_at->format('d/m/Y H:i') }}</td>
                    <td>
                        <div class="d-flex align-items-center">
                            <a class="btn btn-sm btn-icon btn-label-primary me-1" href="{{ route('admins.edit', $admin->id) }}" title="Sửa">
                                <i class="bx bx-edit-alt"></i>
                            </a>
                            @if(auth()->id() != $admin->id)
                            <form action="{{ route('admins.destroy', $admin->id) }}" method="POST" class="ajax-delete" style="display: inline;">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-sm btn-icon btn-label-danger" title="Xóa">
                                    <i class="bx bx-trash"></i>
                                </button>
                            </form>
                            @endif
                        </div>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    <div class="card-footer">
        {{ $admins->links('pagination::bootstrap-5') }}
    </div>
</div>
@endsection
