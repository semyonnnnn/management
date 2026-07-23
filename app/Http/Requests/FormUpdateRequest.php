<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest as FR;

class FormUpdateRequest extends FR
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'forms' => ['nullable', 'array'],
            'forms.*.id' => 'required|digits_between:1,3',
            'forms.*.name' => 'required|string|max:255',
            'forms.*.okud' => 'required|digits_between:1,8',
            'forms.*.period' => 'required|string|min:3|max:255',
            'forms.*.indicators' => 'required|integer|min:1',
            'forms.*.is_consolidated' => 'required|boolean',

            'forms.*.k1' => 'required|numeric|gt:0',
            'forms.*.k2' => 'required|numeric|gt:0',
            'forms.*.k3' => 'required|numeric|gt:0',
            'forms.*.k4' => 'required|numeric|gt:0',
            'forms.*.k5' => 'required|numeric|gt:0',
            'forms.*.k6' => 'required|numeric|gt:0',
        ];
    }

    public function messages(): array
    {
        return [
            'forms.*.name.required' => 'Поле "Название" обязательно для заполнения.',
            'forms.*.name.string' => 'Поле "Название" должно быть строкой.',
            'forms.*.name.max' => 'Поле "Название" не должно превышать 255 символов.',

            'forms.*.okud.required' => 'Поле "ОКУД" обязательно для заполнения.',
            'forms.*.okud.digits_between' => 'Поле "ОКУД" должно содержать от 1 до 8 цифр.',

            'forms.*.period.required' => 'Поле "Период" обязательно для заполнения.',
            'forms.*.period.string' => 'Поле "Период" должно быть строкой.',
            'forms.*.period.min' => 'Поле "Период" должно содержать не менее 3 символов.',
            'forms.*.period.max' => 'Поле "Период" не должно превышать 255 символов.',

            'forms.*.indicators.required' => 'Поле "Показатели" обязательно для заполнения.',
            'forms.*.indicators.integer' => 'Поле "Показатели" должно быть целым числом.',
            'forms.*.indicators.min' => 'Поле "Показатели" должно быть не меньше 1.',

            'forms.*.is_consolidated.required' => 'Поле "Консолидированная" обязательно для заполнения.',
            'forms.*.is_consolidated.boolean' => 'Поле "Консолидированная" должно иметь логическое значение.',

            'forms.*.k1.required' => 'Коэффициент K1 обязателен для заполнения.',
            'forms.*.k1.numeric' => 'Коэффициент K1 должен быть числом.',
            'forms.*.k1.gt' => 'Коэффициент K1 не может быть равен 0.',

            'forms.*.k2.required' => 'Коэффициент K2 обязателен для заполнения.',
            'forms.*.k2.numeric' => 'Коэффициент K2 должен быть числом.',
            'forms.*.k2.gt' => 'Коэффициент K2 не может быть равен 0.',

            'forms.*.k3.required' => 'Коэффициент K3 обязателен для заполнения.',
            'forms.*.k3.numeric' => 'Коэффициент K3 должен быть числом.',
            'forms.*.k3.gt' => 'Коэффициент K3 не может быть равен 0.',

            'forms.*.k4.required' => 'Коэффициент K4 обязателен для заполнения.',
            'forms.*.k4.numeric' => 'Коэффициент K4 должен быть числом.',
            'forms.*.k4.gt' => 'Коэффициент K4 не может быть равен 0.',

            'forms.*.k5.required' => 'Коэффициент K5 обязателен для заполнения.',
            'forms.*.k5.numeric' => 'Коэффициент K5 должен быть числом.',
            'forms.*.k5.gt' => 'Коэффициент K5 не может быть равен 0.',

            'forms.*.k6.required' => 'Коэффициент K6 обязателен для заполнения.',
            'forms.*.k6.numeric' => 'Коэффициент K6 должен быть числом.',
            'forms.*.k6.gt' => 'Коэффициент K6 не может быть равен 0.',
        ];
    }
}