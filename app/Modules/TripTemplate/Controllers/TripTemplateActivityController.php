<?php

namespace App\Modules\TripTemplate\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\TripTemplate\Models\TripTemplateDay;
use App\Modules\TripTemplate\Models\TripTemplateActivity;
use App\Modules\TripTemplate\Requests\StoreTripTemplateActivityRequest;
use App\Modules\TripTemplate\Requests\UpdateTripTemplateActivityRequest;
use Illuminate\Http\Request;

class TripTemplateActivityController extends Controller
{
    public function store(StoreTripTemplateActivityRequest $request, $dayId)
    {

        TripTemplateActivity::create([
            'dayId' => $dayId,
            'title' => $request->title,
            'startTime' => $request->startTime,
            'durationMin' => $request->durationMin,
            'location' => $request->location,
            'notes' => $request->notes,
            'important' => $request->has('important'),
            'activityOrder' => $request->activityOrder,
        ]);

        if ($request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Thêm hoạt động thành công.',
                'redirect' => back()->getTargetUrl()
            ]);
        }

        return back()->with('success', 'Thêm hoạt động thành công.');
    }

    public function update(UpdateTripTemplateActivityRequest $request, $id)
    {

        $activity = TripTemplateActivity::findOrFail($id);
        $data = $request->all();
        $data['important'] = $request->has('important');
        
        $activity->update($data);

        if ($request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Cập nhật hoạt động thành công.',
                'redirect' => back()->getTargetUrl()
            ]);
        }

        return back()->with('success', 'Cập nhật hoạt động thành công.');
    }

    public function destroy($id)
    {
        $activity = TripTemplateActivity::findOrFail($id);
        $activity->delete();

        if (request()->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Xóa hoạt động thành công.'
            ]);
        }

        return back()->with('success', 'Xóa hoạt động thành công.');
    }
}
