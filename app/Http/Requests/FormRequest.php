<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest as FR;

class FormRequest extends FR
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'total' => 'nullable|integer|min:0',
            'indicators' => 'nullable|integer|min:0',
            'reports' => 'required|integer|min:0',
            'k1' => 'nullable|numeric',
            'k2' => 'nullable|numeric',
            'k3' => 'nullable|numeric',
            'k4' => 'nullable|numeric',
            'k5' => 'nullable|numeric',
            'k6' => 'nullable|numeric',
            'is_consolidated' => 'nullable|boolean',
            'departments' => 'nullable|array',
            'departments.*.department_id' => 'nullable|integer',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Поле Название обязательно для заполнения.',
            'name.string' => 'Поле Название должно быть строкой.',
            'name.max' => 'Поле Название не должно превышать 255 символов.',
            'total.integer' => 'Поле Итого должно быть целым числом.',
            'total.min' => 'Поле Итого не может быть меньше 0.',
            'indicators.integer' => 'Поле Показатели должно быть целым числом.',
            'indicators.min' => 'Поле Показатели не может быть меньше 0.',
            'reports.required' => 'Поле Отчеты обязательно для заполнения.',
            'reports.integer' => 'Поле Отчеты должно быть целым числом.',
            'reports.min' => 'Поле Отчеты не может быть меньше 0.',
            'k1.numeric' => 'Коэффициент K1 должен быть числом.',
            'k2.numeric' => 'Коэффициент K2 должен быть числом.',
            'k3.numeric' => 'Коэффициент K3 должен быть числом.',
            'k4.numeric' => 'Коэффициент K4 должен быть числом.',
            'k5.numeric' => 'Коэффициент K5 должен быть числом.',
            'k6.numeric' => 'Коэффициент K6 должен быть числом.',
            'is_consolidated.boolean' => 'Поле Консолидированная должно иметь логическое значение.',
            'departments.array' => 'Поле Департаменты должно быть массивом.',
            'departments.*.department_id.integer' => 'Идентификатор департамента должен быть целым числом.',
        ];
    }
}