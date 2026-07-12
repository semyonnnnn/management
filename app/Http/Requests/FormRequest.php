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
            // Define the outer forms wrapper
            'forms' => 'required|array',
            'forms.*.id' => 'required|integer', // Optional, but good practice since you pass it

            // Map all field validations inside the nested array
            'forms.*.name' => 'required|string|max:255',
            'forms.*.total' => 'nullable|integer|min:0',
            'forms.*.indicators' => 'nullable|integer|min:0',
            'forms.*.reports' => 'required|integer|min:0',
            'forms.*.k1' => 'nullable|numeric',
            'forms.*.k2' => 'nullable|numeric',
            'forms.*.k3' => 'nullable|numeric',
            'forms.*.k4' => 'nullable|numeric',
            'forms.*.k5' => 'nullable|numeric',
            'forms.*.k6' => 'nullable|numeric',
            'forms.*.is_consolidated' => 'nullable|boolean',
            'forms.*.departments' => 'nullable|array',
            'forms.*.departments.*.department_id' => 'nullable|integer',
        ];
    }

    public function messages(): array
    {
        return [
            'forms.required' => 'Массив форм обязателен.',
            'forms.array' => 'Данные должны быть переданы в виде массива.',

            // Custom messages for nested elements using the same wildcard approach
            'forms.*.name.required' => 'Поле Название обязательно для заполнения.',
            'forms.*.name.string' => 'Поле Название должно быть строкой.',
            'forms.*.name.max' => 'Поле Название не должно превышать 255 символов.',
            'forms.*.total.integer' => 'Поле Итого должно быть целым числом.',
            'forms.*.total.min' => 'Поле Итого не может быть меньше 0.',
            'forms.*.indicators.integer' => 'Поле Показатели должно быть целым числом.',
            'forms.*.indicators.min' => 'Поле Показатели не может быть меньше 0.',
            'forms.*.reports.required' => 'Поле Отчеты обязательно для заполнения.',
            'forms.*.reports.integer' => 'Поле Отчеты должно быть целым числом.',
            'forms.*.reports.min' => 'Поле Отчеты не может быть меньше 0.',
            'forms.*.k1.numeric' => 'Коэффициент K1 должен быть числом.',
            'forms.*.k2.numeric' => 'Коэффициент K2 должен быть числом.',
            'forms.*.k3.numeric' => 'Коэффициент K3 должен быть числом.',
            'forms.*.k4.numeric' => 'Коэффициент K4 должен быть числом.',
            'forms.*.k5.numeric' => 'Коэффициент K5 должен быть числом.',
            'forms.*.k6.numeric' => 'Коэффициент K6 должен быть числом.',
            'forms.*.is_consolidated.boolean' => 'Поле Консолидированная должно иметь логическое значение.',
            'forms.*.departments.array' => 'Поле Департаменты должно быть массивом.',
            'forms.*.departments.*.department_id.integer' => 'Идентификатор департамента должен быть целым числом.',
        ];
    }
}