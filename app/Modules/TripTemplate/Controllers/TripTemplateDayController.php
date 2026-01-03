<?php

namespace App\Modules\TripTemplate\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\TripTemplate\Models\TripTemplate;
use App\Modules\TripTemplate\Models\TripTemplateDay;
use App\Modules\TripTemplate\Requests\StoreTripTemplateDayRequest;
use App\Modules\TripTemplate\Requests\UpdateTripTemplateDayRequest;
use Illuminate\Http\Request;

class TripTemplateDayController extends Controller
{
    public function store(StoreTripTemplateDayRequest $request, $templateId)
    {

        TripTemplateDay::create([
            'tripTemplateId' => $templateId,
            'title' => $request->title,
            'description' => $request->description,
            'dayOrder' => $request->dayOrder,
        ]);

        if ($request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Thêm ngày thành công.',
                'redirect' => back()->getTargetUrl()
            ]);
        }

        return back()->with('success', 'Thêm ngày thành công.');
    }

    public function update(UpdateTripTemplateDayRequest $request, $id)
    {

        $day = TripTemplateDay::findOrFail($id);
        $day->update($request->only(['title', 'description', 'dayOrder']));

        if ($request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Cập nhật ngày thành công.',
                'redirect' => back()->getTargetUrl()
            ]);
        }

        return back()->with('success', 'Cập nhật ngày thành công.');
    }

    public function destroy($id)
    {
        $day = TripTemplateDay::findOrFail($id);
        $day->delete();

        if (request()->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Xóa ngày thành công.'
            ]);
        }

        return back()->with('success', 'Xóa ngày thành công.');
    }
}
