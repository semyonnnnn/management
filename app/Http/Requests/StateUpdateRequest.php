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
            // 1. Ensure 'departments' is passed and is indeed an array of items
            'departments' => ['required', 'array'],

            // 2. Validate every single item inside that array using wildcards (*)
            'departments.*.id' => ['required', 'exists:departments,id'],
            'departments.*.code' => ['required', 'string', 'regex:/^[0-9]{0,2}к?$/iu', 'max:3'],
            'departments.*.name' => ['required', 'string', 'max:255'],

            // This rules that EVERY sent department MUST have a state value
            'departments.*.state' => ['required', 'integer', 'min:0'],
            'departments.*.territory' => ['required', 'string', 'in:ekb,krg'],
        ];
    }

    public function messages(): array
    {
        return [
            // The wildcard translates to precise feedback on the frontend
            'departments.*.state.required' => 'Поле не может быть пустым',
            'departments.*.state.integer' => 'Должно быть числом',
            'departments.*.code.required' => 'Код обязателен',
            'departments.*.name.required' => 'Название обязательно',
        ];
    }
}