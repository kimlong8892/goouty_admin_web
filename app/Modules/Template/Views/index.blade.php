@extends('layouts.app')

@section('title', 'Danh sách Template Email')

@section('content')
<div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Danh sách Template Email</h5>
        <a href="{{ route('templates.create') }}" class="btn btn-primary">
            <i class="bx bx-plus me-1"></i> Thêm mới
        </a>
    </div>
    <div class="table-responsive text-nowrap">
        <table class="table">
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Tiêu đề</th>
                    <th>Subject Email</th>
                    <th>Ngày cập nhật</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody class="table-border-bottom-0">
                @foreach($templates as $template)
                <tr>
                    <td><code>{{ $template->code }}</code></td>
                    <td><strong>{{ $template->title }}</strong></td>
                    <td>{{ $template->emailSubject }}</td>
                    <td>{{ $template->updatedAt?->format('d/m/Y H:i') ?? 'N/A' }}</td>
                    <td>
                        <div class="d-flex align-items-center">
                            {{-- Preview Button --}}
                            <form action="{{ route('templates.preview') }}" method="POST" target="_blank" class="me-1">
                                @csrf
                                <input type="hidden" name="emailSubject" value="{{ $template->emailSubject }}">
                                <input type="hidden" name="emailBody" value="{{ $template->emailBody }}">
                                <button type="submit" class="btn btn-sm btn-icon btn-label-warning" title="Xem trước & Test">
                                    <i class="bx bx-show"></i>
                                </button>
                            </form>

                            <a class="btn btn-sm btn-icon btn-label-primary me-1" href="{{ route('templates.edit', $template->id) }}" title="Sửa">
                                <i class="bx bx-edit-alt"></i>
                            </a>
                            <form action="{{ route('templates.destroy', $template->id) }}" method="POST" class="ajax-delete" style="display: inline;">
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
