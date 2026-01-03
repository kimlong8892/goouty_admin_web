<?php

namespace App\Modules\TripTemplate\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTripTemplateActivityRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'activityOrder' => 'required|integer',
            'startTime' => 'nullable|string',
            'durationMin' => 'nullable|integer',
            'location' => 'nullable|string',
            'notes' => 'nullable|string',
        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'Vui lòng nhập tiêu đề hoạt động.',
            'activityOrder.required' => 'Vui lòng nhập thứ tự hoạt động.',
        ];
    }
}
