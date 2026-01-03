@extends('layouts.app')

@section('title', 'Xem trước Template')

@section('content')
<div class="row">
    <div class="col-md-8">
        <div class="card mb-4 h-100">
             <div class="card-header border-bottom">
                <h5 class="mb-1">Nội dung Email</h5>
                <div class="text-muted">Subject: <strong>{{ $subject }}</strong></div>
            </div>
            <div class="card-body p-0">
                <div class="p-4" style="min-height: 500px; background: #fff;">
                    {!! $body !!}
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card mb-4">
            <div class="card-header border-bottom">
                <h5 class="mb-0">Test Gửi Email</h5>
            </div>
             <div class="card-body pt-4">
                <form id="testSendForm" onsubmit="return sendTestEmail(event)">
                     <div class="mb-3">
                        <label class="form-label" for="testEmail">Gửi đến (Email)</label>
                        <input type="email" class="form-control" id="testEmail" placeholder="name@example.com" required />
                    </div>
                     <button type="submit" class="btn btn-primary d-grid w-100">
                        <span id="btnText"><i class="bx bx-send me-1"></i> Gửi thử ngay</span>
                        <span id="btnLoading" class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span>
                    </button>
                    <div id="testResult" class="mt-3"></div>
                </form>
            </div>
        </div>
        
        <div class="card">
            <div class="card-body">
                <a href="javascript:window.close();" class="btn btn-outline-secondary w-100">Đóng Preview</a>
            </div>
        </div>
    </div>
</div>

{{-- Hidden inputs to carry over content for sending --}}
<input type="hidden" id="rawSubject" value="{{ $subject }}">
<textarea id="rawBody" class="d-none">{{ $body }}</textarea>

<script>
function sendTestEmail(e) {
    e.preventDefault();
    const email = document.getElementById('testEmail').value;
    const subject = document.getElementById('rawSubject').value;
    const body = document.getElementById('rawBody').value;
    const btnText = document.getElementById('btnText');
    const btnLoading = document.getElementById('btnLoading');
    const resultDiv = document.getElementById('testResult');

    btnText.classList.add('d-none');
    btnLoading.classList.remove('d-none');
    resultDiv.innerHTML = '';

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
        btnText.classList.remove('d-none');
        btnLoading.classList.add('d-none');
        if (data.success) {
            resultDiv.innerHTML = '<div class="alert alert-success">' + data.message + '</div>';
        } else {
            resultDiv.innerHTML = '<div class="alert alert-danger">' + data.message + '</div>';
        }
    })
    .catch(error => {
        btnText.classList.remove('d-none');
        btnLoading.classList.add('d-none');
        resultDiv.innerHTML = '<div class="alert alert-danger">Lỗi kết nối!</div>';
        console.error('Error:', error);
    });
}
</script>
@endsection
