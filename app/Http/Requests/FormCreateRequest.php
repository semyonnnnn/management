<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest as FR;
use Illuminate\Contracts\Validation\Validator;

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
            'okud' => 'required|digits_between:1,8',
            'period' => 'required|string|min:3|max:255',
            'indicators' => 'required|integer|min:1',
            'is_consolidated' => 'required|boolean',

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

            'okud.required' => 'Поле "ОКУД" обязательно для заполнения.',
            'okud.digits_between' => 'Поле "ОКУД" должно содержать от 1 до 8 цифр.',

            'period.required' => 'Поле "Период" обязательно для заполнения.',
            'period.string' => 'Поле "Период" должно быть строкой.',
            'period.min' => 'Поле "Период" должно содержать не менее 3 символов.',
            'period.max' => 'Поле "Период" не должно превышать 255 символов.',

            'indicators.required' => 'Поле "Показатели" обязательно для заполнения.',
            'indicators.integer' => 'Поле "Показатели" должно быть целым числом.',
            'indicators.min' => 'Поле "Показатели" должно быть не меньше 1.',

            'is_consolidated.required' => 'Поле "Консолидированная" обязательно для заполнения.',
            'is_consolidated.boolean' => 'Поле "Консолидированная" должно иметь логическое значение.',

            'k1.required' => 'Коэффициент K1 обязателен для заполнения.',
            'k1.numeric' => 'Коэффициент K1 должен быть числом.',
            'k1.gt' => 'Коэффициент K1 не может быть равен 0.',

            'k2.required' => 'Коэффициент K2 обязателен для заполнения.',
            'k2.numeric' => 'Коэффициент K2 должен быть числом.',
            'k2.gt' => 'Коэффициент K2 не может быть равен 0.',

            'k3.required' => 'Коэффициент K3 обязателен для заполнения.',
            'k3.numeric' => 'Коэффициент K3 должен быть числом.',
            'k3.gt' => 'Коэффициент K3 не может быть равен 0.',

            'k4.required' => 'Коэффициент K4 обязателен для заполнения.',
            'k4.numeric' => 'Коэффициент K4 должен быть числом.',
            'k4.gt' => 'Коэффициент K4 не может быть равен 0.',

            'k5.required' => 'Коэффициент K5 обязателен для заполнения.',
            'k5.numeric' => 'Коэффициент K5 должен быть числом.',
            'k5.gt' => 'Коэффициент K5 не может быть равен 0.',

            'k6.required' => 'Коэффициент K6 обязателен для заполнения.',
            'k6.numeric' => 'Коэффициент K6 должен быть числом.',
            'k6.gt' => 'Коэффициент K6 не может быть равен 0.',
        ];
    }
}