<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest as FR;

class FormDistributionRequest extends FR
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id' => ['required', 'integer', 'exists:forms,id'],

            'departments' => ['nullable', 'array'],
            'departments.*.id' => ['required', 'integer', 'exists:departments,id'],
            'departments.*.value' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'id.required' => 'ID формы обязателен для обновления.',
            'id.integer' => 'ID формы должен быть целым числом.',
            'id.exists' => 'Указанная форма не существует в базе данных.',

            'departments.array' => 'Структура отделов должна представлять собой массив.',

            'departments.*.id.required' => 'ID ведомства обязателен.',
            'departments.*.id.integer' => 'ID ведомства должен быть целым числом.',
            'departments.*.id.exists' => 'Выбранное ведомство не существует в базе данных.',

            'departments.*.value.string' => 'Значение должно быть строкой.',
        ];
    }
}