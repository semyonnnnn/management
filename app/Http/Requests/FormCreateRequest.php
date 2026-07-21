<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest as FR;

class FormCreateRequest extends FR
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'okud' => 'nullable|digits_between:1,8',
            'indicators' => 'required|integer|min:1',
            'reports' => 'required|integer|min:1',
            'total' => 'required|integer|min:1',

            // Ensure coefficients are strictly greater than zero (> 0)
            'k1' => 'required|numeric|gt:0',
            'k2' => 'required|numeric|gt:0',
            'k3' => 'required|numeric|gt:0',
            'k4' => 'required|numeric|gt:0',
            'k5' => 'required|numeric|gt:0',
            'k6' => 'required|numeric|gt:0',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Поле "Название" обязательно для заполнения.',
            'name.string' => 'Поле "Название" должно быть строкой.',
            'name.max' => 'Поле "Название" не должно превышать 255 символов.',

            'okud.digits_between' => 'Поле "ОКУД" должно содержать от 1 до 8 цифр.',

            'indicators.required' => 'Поле "Показатели" обязательно для заполнения.',
            'indicators.integer' => 'Поле "Показатели" должно быть целым числом.',
            'indicators.min' => 'Поле "Показатели" должно быть не меньше 1.',

            'reports.required' => 'Поле "Отчеты" обязательно для заполнения.',
            'reports.integer' => 'Поле "Отчеты" должно быть целым числом.',
            'reports.min' => 'Поле "Отчеты" должно быть не меньше 1.',

            'total.required' => 'Поле "Всего" обязательно для заполнения.',
            'total.integer' => 'Поле "Всего" должно быть целым числом.',
            'total.min' => 'Поле "Всего" должно быть не меньше 1.',

            'k1.required' => 'Коэффициент K1 обязателен для заполнения.',
            'k1.numeric' => 'Коэффициент K1 должен быть числом.',
            'k1.gt' => 'Коэффициент K1 должен быть больше 0.',

            'k2.required' => 'Коэффициент K2 обязателен для заполнения.',
            'k2.numeric' => 'Коэффициент K2 должен быть числом.',
            'k2.gt' => 'Коэффициент K2 должен быть больше 0.',

            'k3.required' => 'Коэффициент K3 обязателен для заполнения.',
            'k3.numeric' => 'Коэффициент K3 должен быть числом.',
            'k3.gt' => 'Коэффициент K3 должен быть больше 0.',

            'k4.required' => 'Коэффициент K4 обязателен для заполнения.',
            'k4.numeric' => 'Коэффициент K4 должен быть числом.',
            'k4.gt' => 'Коэффициент K4 должен быть больше 0.',

            'k5.required' => 'Коэффициент K5 обязателен для заполнения.',
            'k5.numeric' => 'Коэффициент K5 должен быть числом.',
            'k5.gt' => 'Коэффициент K5 должен быть больше 0.',

            'k6.required' => 'Коэффициент K6 обязателен для заполнения.',
            'k6.numeric' => 'Коэффициент K6 должен быть числом.',
            'k6.gt' => 'Коэффициент K6 должен быть больше 0.',

            'is_consolidated.boolean' => 'Поле "Консолидированная" должно иметь логическое значение.',
        ];
    }
}