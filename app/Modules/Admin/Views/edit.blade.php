@extends('layouts.app')

@section('title', 'Sửa Admin')

@section('content')
<div class="row">
    <div class="col-xl">
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Sửa Admin: {{ $admin->name }}</h5>
            </div>
            <div class="card-body">
                <form action="{{ route('admins.update', $admin->id) }}" method="POST" class="ajax-form">
                    @csrf
                    @method('PUT')
                    <div class="mb-3">
                        <label class="form-label" for="name">Tên</label>
                        <input type="text" class="form-control" id="name" name="name" value="{{ old('name', $admin->name) }}" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="email">Email</label>
                        <input type="email" class="form-control" id="email" name="email" value="{{ old('email', $admin->email) }}" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="password">Mật khẩu (để trống nếu không đổi)</label>
                        <input type="password" class="form-control" id="password" name="password" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="password_confirmation">Xác nhận mật khẩu</label>
                        <input type="password" class="form-control" id="password_confirmation" name="password_confirmation" />
                    </div>
                    <button type="submit" class="btn btn-primary">Cập nhật</button>
                    <a href="{{ route('admins.index') }}" class="btn btn-secondary">Hủy</a>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection
