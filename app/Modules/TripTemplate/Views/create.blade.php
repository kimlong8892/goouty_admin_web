@extends('layouts.app')

@section('title', 'Thêm mới Mẫu chuyến đi')

@section('content')
<div class="row">
    <div class="col-xl">
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Thêm mới Mẫu chuyến đi</h5>
            </div>
            <div class="card-body">
                <form action="{{ route('trip-templates.store') }}" method="POST">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label" for="title">Tiêu đề</label>
                        <input type="text" class="form-control" id="title" name="title" required />
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="description">Mô tả</label>
                        <textarea class="form-control" id="description" name="description" rows="3"></textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="provinceId">Tỉnh thành (Province ID)</label>
                         {{-- Using text input for now as Province relationship is simple model --}}
                         <select class="form-select" id="provinceId" name="provinceId">
                            <option value="">Chọn tỉnh thành</option>
                            @foreach($provinces as $province)
                                <option value="{{ $province->id }}">{{ $province->name }}</option>
                            @endforeach
                        </select>
                    </div>
                     <div class="mb-3">
                        <label class="form-label" for="avatar">Avatar URL</label>
                        <input type="text" class="form-control" id="avatar" name="avatar" />
                    </div>
                    <div class="mb-3">
                        <div class="form-check form-switch mb-2">
                            <input class="form-check-input" type="checkbox" id="isPublic" name="isPublic" />
                            <label class="form-check-label" for="isPublic">Công khai</label>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Lưu</button>
                    <a href="{{ route('trip-templates.index') }}" class="btn btn-secondary">Hủy</a>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection
