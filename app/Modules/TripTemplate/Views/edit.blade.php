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
                <form action="{{ route('trip-templates.update', $template->id) }}" method="POST">
                    @csrf
                    @method('PUT')
                    <div class="mb-3">
                        <label class="form-label" for="title">Tiêu đề</label>
                        <input type="text" class="form-control" id="title" name="title" value="{{ $template->title }}" required />
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="description">Mô tả</label>
                        <textarea class="form-control" id="description" name="description" rows="3">{{ $template->description }}</textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="provinceId">Tỉnh thành</label>
                         <select class="form-select" id="provinceId" name="provinceId">
                            <option value="">Chọn tỉnh thành</option>
                            @foreach($provinces as $province)
                                <option value="{{ $province->id }}" {{ $template->provinceId == $province->id ? 'selected' : '' }}>
                                    {{ $province->name }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                     <div class="mb-3">
                        <label class="form-label" for="avatar">Avatar URL</label>
                        <input type="text" class="form-control" id="avatar" name="avatar" value="{{ $template->avatar }}" />
                    </div>
                    <div class="mb-3">
                        <div class="form-check form-switch mb-2">
                            <input class="form-check-input" type="checkbox" id="isPublic" name="isPublic" {{ $template->isPublic ? 'checked' : '' }} />
                            <label class="form-check-label" for="isPublic">Công khai</label>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Cập nhật</button>
                    <a href="{{ route('trip-templates.index') }}" class="btn btn-secondary">Hủy</a>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection
