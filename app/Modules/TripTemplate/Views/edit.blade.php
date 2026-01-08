@extends('layouts.app')

@section('title', 'Chỉnh sửa Mẫu chuyến đi')

@section('content')
<div class="row">
    <div class="col-xl">
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Chỉnh sửa Mẫu chuyến đi</h5>
            </div>
            <div class="card-body">
                <form action="{{ route('trip-templates.update', $template->id) }}" method="POST" class="ajax-form" enctype="multipart/form-data">
                    @csrf
                    @method('PUT')
                    <div class="mb-3">
                        <label class="form-label" for="title">Tiêu đề</label>
                        <input type="text" class="form-control" id="title" name="title" value="{{ $template->title }}" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="description">Mô tả</label>
                        <textarea class="form-control" id="description" name="description" rows="3">{{ $template->description }}</textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="provinceId">Tỉnh thành (Tìm kiếm)</label>
                         <select class="form-select" id="provinceId" name="provinceId" style="width: 100%;">
                            <option value="">Chọn tỉnh thành</option>
                            @foreach($provinces as $province)
                                <option value="{{ $province->id }}" {{ $template->provinceId == $province->id ? 'selected' : '' }}>
                                    {{ $province->name }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="cost">Số tiền (VNĐ / người)</label>
                        <input type="number" class="form-control" id="cost" name="cost" value="{{ $template->cost ?? '' }}" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="avatar">Avatar Image</label>
                        <input type="file" class="form-control" id="avatar" name="avatar" accept="image/*" />
                        @if($template->avatar)
                            <div class="mt-2">
                                <img src="{{ $template->avatar }}" alt="Avatar" class="img-thumbnail" style="max-height: 150px;">
                            </div>
                        @endif
                    </div>
                    <div class="mb-3">
                        <div class="form-check form-switch mb-2">
                            <input class="form-check-input" type="checkbox" id="isPublic" name="isPublic" {{ $template->isPublic ? 'checked' : '' }} />
                            <label class="form-check-label" for="isPublic">Công khai</label>
                        </div>
                    </div>
                    <div class="mt-4">
                        <button type="submit" class="btn btn-primary me-2">
                            <i class="bx bx-check me-1"></i> Cập nhật
                        </button>
                        <a href="{{ route('trip-templates.index') }}" class="btn btn-outline-secondary">
                            <i class="bx bx-x me-1"></i> Hủy
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection

@push('styles')
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.3.0/dist/select2-bootstrap-5-theme.min.css" />
@endpush

@push('scripts')
<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js"></script>
<script>
    $(document).ready(function() {
        if ($('#provinceId').length) {
            $('#provinceId').select2({
                theme: 'bootstrap-5',
                placeholder: 'Chọn tỉnh thành',
                allowClear: true,
                width: '100%'
            });
        }
    });
</script>
@endpush
