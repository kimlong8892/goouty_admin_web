@extends('layouts.app')

@section('title', 'Thêm mới Template')

@section('content')
<div class="row">
    <div class="col-xl">
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Thêm mới Template</h5>
            </div>
            <div class="card-body">
                <form action="{{ route('templates.store') }}" method="POST" class="ajax-form">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label" for="code">Mã (Code) <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="code" name="code" required />
                        <div class="form-text">Mã định danh duy nhất (ví dụ: VERIFY_EMAIL)</div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="title">Tiêu đề</label>
                        <input type="text" class="form-control" id="title" name="title" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="message">Message (Internal Note)</label>
                        <input type="text" class="form-control" id="message" name="message" />
                    </div>
                    
                    <div class="divider text-start">
                        <div class="divider-text">Email Content</div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label" for="emailSubject">Email Subject</label>
                        <input type="text" class="form-control" id="emailSubject" name="emailSubject" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="emailBody">Email Body (HTML)</label>
                        <textarea class="form-control" id="emailBody" name="emailBody" rows="10"></textarea>
                    </div>

                    <div class="divider text-start">
                         <div class="divider-text">Misc</div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                             <label class="form-label" for="icon">Icon</label>
                             <input type="text" class="form-control" id="icon" name="icon" />
                        </div>
                        <div class="col-md-6 mb-3">
                             <label class="form-label" for="color">Color</label>
                             <input type="text" class="form-control" id="color" name="color" />
                        </div>
                    </div>

                    <div class="mt-4">
                        <button type="submit" class="btn btn-primary me-2">
                            <i class="bx bx-save me-1"></i> Lưu
                        </button>
                        <button type="button" class="btn btn-warning me-2" onclick="previewTemplate()">
                            <i class="bx bx-show me-1"></i> Xem trước (Preview)
                        </button>
                        <a href="{{ route('templates.index') }}" class="btn btn-outline-secondary">
                            <i class="bx bx-x me-1"></i> Hủy
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
function previewTemplate() {
    const previewForm = document.createElement('form');
    previewForm.action = "{{ route('templates.preview') }}";
    previewForm.method = 'POST';
    previewForm.target = '_blank';
    previewForm.style.display = 'none';

    const csrf = document.createElement('input');
    csrf.type = 'hidden';
    csrf.name = '_token';
    csrf.value = "{{ csrf_token() }}";
    previewForm.appendChild(csrf);

    const subject = document.createElement('input');
    subject.type = 'hidden';
    subject.name = 'emailSubject';
    subject.value = document.getElementById('emailSubject').value;
    previewForm.appendChild(subject);

    const body = document.createElement('textarea');
    body.name = 'emailBody';
    body.value = document.getElementById('emailBody').value;
    previewForm.appendChild(body);

    document.body.appendChild(previewForm);
    previewForm.submit();
    document.body.removeChild(previewForm);
}
</script>
@endsection
