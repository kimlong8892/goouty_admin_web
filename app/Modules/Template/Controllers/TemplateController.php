<?php

namespace App\Modules\Template\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Template\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

use Illuminate\Validation\Rule;

class TemplateController extends Controller
{
    public function index()
    {
        $templates = Template::orderBy('updatedAt', 'desc')->paginate(10);
        return view('template::index', compact('templates'));
    }

    public function create()
    {
        return view('template::create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => ['required', Rule::unique(Template::class)],
            'title' => 'required',
        ]);

        Template::create($request->except('_token'));

        return redirect()->route('templates.index')->with('success', 'Tạo template thành công.');
    }

    public function edit($id)
    {
        $template = Template::findOrFail($id);
        return view('template::edit', compact('template'));
    }

    public function update(Request $request, $id)
    {
        $template = Template::findOrFail($id);
        $request->validate([
            'code' => ['required', Rule::unique(Template::class)->ignore($id)],
            'title' => 'required',
        ]);

        $template->update($request->except('_token', '_method'));

        return redirect()->route('templates.index')->with('success', 'Cập nhật template thành công.');
    }

    public function destroy($id)
    {
        Template::destroy($id);
        return redirect()->route('templates.index')->with('success', 'Xóa template thành công.');
    }

    public function preview(Request $request)
    {
        $subject = $request->input('emailSubject', '(No Subject)');
        $body = $request->input('emailBody', '');
        
        return view('template::preview', compact('subject', 'body'));
    }

    public function sendTest(Request $request) 
    {
        $request->validate([
            'email' => 'required|email',
            'emailSubject' => 'required',
            'emailBody' => 'required',
        ]);
        
        $toEmail = $request->input('email');
        $subject = $request->input('emailSubject');
        $body = $request->input('emailBody');

        try {
            // Using Mail::html which is available in newer Laravel versions
            Mail::html($body, function ($message) use ($toEmail, $subject) {
                $message->to($toEmail)
                        ->subject($subject);
            });
            
            return response()->json(['success' => true, 'message' => 'Đã gửi email test thành công!']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Lỗi gửi mail: ' . $e->getMessage()], 500);
        }
    }
}
