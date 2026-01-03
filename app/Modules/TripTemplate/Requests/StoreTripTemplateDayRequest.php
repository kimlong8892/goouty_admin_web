<?php

namespace App\Modules\TripTemplate\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTripTemplateDayRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'dayOrder' => 'required|integer',
            'description' => 'nullable|string',
        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'Vui lòng nhập tiêu đề ngày.',
            'dayOrder.required' => 'Vui lòng nhập thứ tự ngày.',
        ];
    }
}
