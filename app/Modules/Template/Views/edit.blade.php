@extends('layouts.app')

@section('title', 'Chỉnh sửa Template')

@section('content')
<div class="row">
    {{-- Left Column: Form --}}
    <div class="col-lg-6">
        <div class="card mb-4 h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Chỉnh sửa Template</h5>
            </div>
            <div class="card-body">
                <form action="{{ route('templates.update', $template->id) }}" method="POST" id="templateForm" class="ajax-form">
                    @csrf
                    @method('PUT')
                    
                    {{-- Hidden inputs for live updating --}}
                    <input type="hidden" id="currentSubject" value="{{ $template->emailSubject }}">
                    
                    <div class="mb-3">
                        <label class="form-label" for="code">Mã (Code) <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="code" name="code" value="{{ $template->code }}" required />
                        <div class="form-text">Mã định danh duy nhất (ví dụ: VERIFY_EMAIL)</div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="title">Tiêu đề</label>
                        <input type="text" class="form-control" id="title" name="title" value="{{ $template->title }}" />
                    </div>
                    
                    <div class="divider text-start">
                        <div class="divider-text">Email Content</div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label" for="emailSubject">Email Subject</label>
                        <input type="text" class="form-control" id="emailSubject" name="emailSubject" value="{{ $template->emailSubject }}" oninput="updatePreview()" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="emailBody">Email Body (HTML)</label>
                        {{-- Use a larger textarea --}}
                        <textarea class="form-control font-monospace" id="emailBody" name="emailBody" rows="15" style="font-size: 0.85rem;" oninput="updatePreview()">{{ $template->emailBody }}</textarea>
                    </div>

                    <div class="divider text-start">
                         <div class="divider-text">Misc</div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                             <label class="form-label" for="icon">Icon</label>
                             <input type="text" class="form-control" id="icon" name="icon" value="{{ $template->icon }}" />
                        </div>
                        <div class="col-md-6 mb-3">
                             <label class="form-label" for="color">Color</label>
                             <input type="text" class="form-control" id="color" name="color" value="{{ $template->color }}" />
                        </div>
                    </div>

                    <div class="mt-4">
                        <button type="submit" class="btn btn-primary me-2">
                            <i class="bx bx-save me-1"></i> Lưu thay đổi
                        </button>
                        <a href="{{ route('templates.index') }}" class="btn btn-outline-secondary">
                            <i class="bx bx-x me-1"></i> Hủy
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </div>

    {{-- Right Column: Preview & Test --}}
    <div class="col-lg-6">
        <div class="card mb-4 h-100">
            <div class="card-header border-bottom">
                <h5 class="mb-1">Xem trước (Live Preview)</h5>
                <div class="text-muted small">Subject: <strong id="previewSubject">{{ $template->emailSubject }}</strong></div>
            </div>
            
            <div class="card-body p-0 d-flex flex-column" style="height: 500px;">
                <iframe id="previewFrame" class="w-100 flex-grow-1 border-0" sandbox="allow-same-origin"></iframe>
            </div>
            
            <div class="card-footer border-top bg-light">
                <h6 class="mb-2">Gửi thử Email này</h6>
                <form id="testSendForm" onsubmit="return sendTestEmail(event)">
                     <div class="input-group">
                        <input type="email" class="form-control" id="testEmail" placeholder="Nhập email người nhận..." required />
                        <button class="btn btn-primary" type="submit" id="btnTestSend">
                            <i class="bx bx-send me-1"></i> Gửi
                        </button>
                    </div>
                    <div id="testResult" class="mt-2 text-danger small"></div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    updatePreview();
});

function updatePreview() {
    const subjectInput = document.getElementById('emailSubject');
    const bodyInput = document.getElementById('emailBody');
    const previewSubject = document.getElementById('previewSubject');
    const previewFrame = document.getElementById('previewFrame');

    // Update Subject
    previewSubject.textContent = subjectInput.value || '(No Subject)';

    // Update Body (Iframe)
    const htmlContent = bodyInput.value || '';
    
    // We write to the iframe document
    const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    doc.open();
    doc.write(htmlContent);
    doc.close();
}

function sendTestEmail(e) {
    e.preventDefault();
    const email = document.getElementById('testEmail').value;
    const subject = document.getElementById('emailSubject').value; // Get LIVE value
    const body = document.getElementById('emailBody').value;       // Get LIVE value
    
    const btn = document.getElementById('btnTestSend');
    const resultDiv = document.getElementById('testResult');
    const originalBtnHtml = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
    resultDiv.innerHTML = '';
    resultDiv.className = 'mt-2 small'; // Reset classes

    fetch("{{ route('templates.send-test') }}", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': "{{ csrf_token() }}"
        },
        body: JSON.stringify({
            email: email,
            emailSubject: subject,
            emailBody: body
        })
    })
    .then(response => response.json())
    .then(data => {
        btn.disabled = false;
        btn.innerHTML = originalBtnHtml;
        
        if (data.success) {
            resultDiv.className = 'mt-2 text-success small fw-bold';
            resultDiv.textContent = data.message;
        } else {
            resultDiv.className = 'mt-2 text-danger small fw-bold';
            resultDiv.textContent = 'Lỗi: ' + data.message;
        }
    })
    .catch(error => {
        btn.disabled = false;
        btn.innerHTML = originalBtnHtml;
        resultDiv.className = 'mt-2 text-danger small fw-bold';
        resultDiv.textContent = 'Lỗi kết nối server!';
        console.error('Error:', error);
    });
}
</script>
@endsection
