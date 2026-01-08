<?php

namespace App\Modules\TripTemplate\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTripTemplateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'provinceId' => 'nullable|exists:public.Province,id',
            'avatar' => 'nullable|image|max:5120',
            'description' => 'nullable|string',
        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'Vui lòng nhập tiêu đề mẫu chuyến đi.',
            'provinceId.exists' => 'Tỉnh/Thành phố không hợp lệ.',
        ];
    }
}
