<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StateUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date' => ['nullable', 'date_format:Y-m-d'],
            'departments' => ['nullable', 'array'],
            'departments.*.id' => ['required', 'exists:departments,id'],
            'departments.*.code' => ['required', 'string', 'regex:/^[0-9]{0,2}к?$/iu', 'max:3'],
            'departments.*.name' => ['required', 'string', 'max:255'],
            'departments.*.state' => ['required', 'integer', 'min:0'],
            'departments.*.territory' => ['required', 'string', 'in:ekb,krg'],
        ];
    }

    public function messages(): array
    {
        return [
            'departments.*.state.required' => 'Поле не может быть пустым',
            'departments.*.state.integer' => 'Должно быть числом',
            'departments.*.code.required' => 'Код обязателен',
            'departments.*.name.required' => 'Название обязательно',
        ];
    }
}