<?php

namespace App\Modules\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Modules\Admin\Requests\StoreAdminRequest;
use App\Modules\Admin\Requests\UpdateAdminRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function index()
    {
        $admins = User::orderBy('id', 'desc')->paginate(10);
        return view('admin::index', compact('admins'));
    }

    public function create()
    {
        return view('admin::create');
    }

    public function store(StoreAdminRequest $request)
    {
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        if ($request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Tạo tài khoản admin thành công.',
                'redirect' => route('admins.index')
            ]);
        }

        return redirect()->route('admins.index')->with('success', 'Tạo tài khoản admin thành công.');
    }

    public function edit($id)
    {
        $admin = User::findOrFail($id);
        return view('admin::edit', compact('admin'));
    }

    public function update(UpdateAdminRequest $request, $id)
    {
        $admin = User::findOrFail($id);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $admin->update($data);

        if ($request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Cập nhật tài khoản admin thành công.',
                'redirect' => route('admins.index')
            ]);
        }

        return redirect()->route('admins.index')->with('success', 'Cập nhật tài khoản admin thành công.');
    }

    public function destroy($id)
    {
        if (auth()->id() == $id) {
            return back()->with('error', 'Bạn không thể tự xóa chính mình.');
        }

        $admin = User::findOrFail($id);
        $admin->delete();

        if (request()->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Xóa tài khoản admin thành công.'
            ]);
        }

        return redirect()->route('admins.index')->with('success', 'Xóa tài khoản admin thành công.');
    }
}
