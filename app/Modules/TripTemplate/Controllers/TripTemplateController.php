<?php

namespace App\Modules\TripTemplate\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\TripTemplate\Models\TripTemplate;
use App\Modules\TripTemplate\Models\PublicUser;
use App\Modules\TripTemplate\Models\Province;
use App\Modules\TripTemplate\Requests\StoreTripTemplateRequest;
use App\Modules\TripTemplate\Requests\UpdateTripTemplateRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TripTemplateController extends Controller
{
    public function index()
    {
        $templates = TripTemplate::with('province')->orderBy('updatedAt', 'desc')->paginate(10);
        return view('triptemplate::index', compact('templates'));
    }

    public function show($id)
    {
        $template = TripTemplate::with(['days.activities', 'province', 'user'])->findOrFail($id);
        return view('triptemplate::show', compact('template'));
    }

    public function create()
    {
        $provinces = Province::orderBy('name', 'asc')->get();
        return view('triptemplate::create', compact('provinces'));
    }

    public function store(StoreTripTemplateRequest $request)
    {

        $user = PublicUser::first();
        if (!$user) {
            return back()->with('error', 'Không tìm thấy Public User để gán.');
        }

        $avatarUrl = null;
        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('trip-templates/avatars', 's3');
            $avatarUrl = Storage::disk('s3')->url($path);
        }

        TripTemplate::create([
            'title' => $request->title,
            'description' => $request->description,
            'provinceId' => $request->provinceId,
            'isPublic' => $request->has('isPublic'),
            'avatar' => $avatarUrl,
            'userId' => $user->id,
        ]);

        if ($request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Tạo mẫu chuyến đi thành công.',
                'redirect' => route('trip-templates.index')
            ]);
        }

        return redirect()->route('trip-templates.index')->with('success', 'Tạo mẫu chuyến đi thành công.');
    }

    public function edit($id)
    {
        $template = TripTemplate::findOrFail($id);
        $provinces = Province::orderBy('name', 'asc')->get();
        return view('triptemplate::edit', compact('template', 'provinces'));
    }

    public function update(UpdateTripTemplateRequest $request, $id)
    {
        $template = TripTemplate::findOrFail($id);
        
        $currentUserId = $template->userId;
         // Ensure we keep the user if it exists, or assign default if somehow missing (though constraints prevent this)
        if (!$currentUserId) {
             $user = PublicUser::first();
             $currentUserId = $user ? $user->id : null;
        }


        $avatarUrl = $template->avatar;
        if ($request->hasFile('avatar')) {
            // Optional: Delete old avatar from S3 if it exists
            if ($avatarUrl) {
                // Extract path from URL if possible, or store path in DB instead of URL.
                // For now, let's just upload the new one.
                // $oldPath = str_replace(Storage::disk('s3')->url(''), '', $avatarUrl);
                // Storage::disk('s3')->delete($oldPath);
            }
            $path = $request->file('avatar')->store('trip-templates/avatars', 's3');
            $avatarUrl = Storage::disk('s3')->url($path);
        }

        $template->update([
            'title' => $request->title,
            'description' => $request->description,
            'provinceId' => $request->provinceId,
            'isPublic' => $request->has('isPublic'),
            'avatar' => $avatarUrl,
            'userId' => $currentUserId 
        ]);

        if ($request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Cập nhật mẫu chuyến đi thành công.',
                'redirect' => route('trip-templates.index')
            ]);
        }

        return redirect()->route('trip-templates.index')->with('success', 'Cập nhật mẫu chuyến đi thành công.');
    }
    
    public function destroy($id)
    {
        $template = TripTemplate::findOrFail($id);
        $template->delete();

        if (request()->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Xóa mẫu chuyến đi thành công.'
            ]);
        }

        return redirect()->route('trip-templates.index')->with('success', 'Xóa mẫu chuyến đi thành công.');
    }
}
