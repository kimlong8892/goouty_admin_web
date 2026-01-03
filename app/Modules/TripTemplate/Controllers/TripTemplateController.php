<?php

namespace App\Modules\TripTemplate\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\TripTemplate\Models\TripTemplate;
use App\Modules\TripTemplate\Models\PublicUser;
use App\Modules\TripTemplate\Models\Province;
use Illuminate\Http\Request;

class TripTemplateController extends Controller
{
    public function index()
    {
        $templates = TripTemplate::orderBy('updatedAt', 'desc')->paginate(10);
        return view('triptemplate::index', compact('templates'));
    }

    public function create()
    {
        $provinces = Province::orderBy('name', 'asc')->get();
        return view('triptemplate::create', compact('provinces'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'provinceId' => 'nullable|exists:public.Province,id',
        ]);

        $user = PublicUser::first();
        if (!$user) {
            return back()->with('error', 'Không tìm thấy Public User để gán.');
        }

        TripTemplate::create([
            'title' => $request->title,
            'description' => $request->description,
            'provinceId' => $request->provinceId,
            'isPublic' => $request->has('isPublic'),
            'avatar' => $request->avatar,
            'userId' => $user->id,
        ]);

        return redirect()->route('trip-templates.index')->with('success', 'Tạo mẫu chuyến đi thành công.');
    }

    public function edit($id)
    {
        $template = TripTemplate::findOrFail($id);
        $provinces = Province::orderBy('name', 'asc')->get();
        return view('triptemplate::edit', compact('template', 'provinces'));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required',
            'provinceId' => 'nullable|exists:public.Province,id',
        ]);

        $template = TripTemplate::findOrFail($id);
        
        $currentUserId = $template->userId;
         // Ensure we keep the user if it exists, or assign default if somehow missing (though constraints prevent this)
        if (!$currentUserId) {
             $user = PublicUser::first();
             $currentUserId = $user ? $user->id : null;
        }


        $template->update([
            'title' => $request->title,
            'description' => $request->description,
            'provinceId' => $request->provinceId,
            'isPublic' => $request->has('isPublic'),
            'avatar' => $request->avatar,
            'userId' => $currentUserId 
        ]);

        return redirect()->route('trip-templates.index')->with('success', 'Cập nhật mẫu chuyến đi thành công.');
    }
    
    public function destroy($id)
    {
        $template = TripTemplate::findOrFail($id);
        $template->delete();

        return redirect()->route('trip-templates.index')->with('success', 'Xóa mẫu chuyến đi thành công.');
    }
}
