<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DepartmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'regex:/^[0-9]+$/', 'max: 10'],
            'name' => ['required', 'string', 'max:255'],
            'territory' => ['required', Rule::in(['ekb', 'krg'])],
            'state' => ['required', 'string', 'regex:/^[1-9][0-9]*$/'],
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'Поле "Код" обязательно для заполнения.',
            'code.max' => 'Код не должен превышать 10 цифр',
            'code.regex' => 'Код должен состоять только из цифр.',
            'name.required' => 'Поле "Название" обязательно для заполнения.',
            'name.string' => 'Название должно быть строкой.',
            'name.max' => 'Название не может превышать 255 символов.',
            'territory.required' => 'Выберите территорию.',
            'territory.in' => 'Выбранная территория недопустима.',
            'state.required' => 'Поле "Штатное" обязательно для заполнения.',
            'state.regex' => 'Штатное должно быть числом и не может начинаться с нуля.',
        ];
    }
}
