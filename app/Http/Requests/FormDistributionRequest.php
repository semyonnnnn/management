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
        $rules = [
            'id' => ['required', 'integer', 'exists:forms,id'],
            'name' => ['required', 'string', 'max:255'],

            'departments' => ['nullable', 'array'],
            'departments.*.department_id' => ['required', 'integer', 'exists:departments,id'],
            'departments.*.okveds' => ['nullable', 'string'],
        ];

        if ($this->isMethod('put') || $this->isMethod('patch') || $this->has('id')) {
            $rules['id'] = ['required', 'integer', 'exists:forms,id'];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'id.required' => 'ID формы обязателен для обновления.',
            'id.integer' => 'ID формы должен быть целым числом.',
            'id.exists' => 'Редактируемая форма не найдена в базе данных.',

            'name.required' => 'Поле "Название формы" обязательно для заполнения.',
            'name.string' => 'Название формы должно быть строкой.',
            'name.max' => 'Название формы не может превышать 255 символов.',

            'departments.array' => 'Структура отделов должна представлять собой массив.',

            'departments.*.department_id.required' => 'ID ведомства обязателен.',
            'departments.*.department_id.integer' => 'ID ведомства должен быть целым числом.',
            'departments.*.department_id.exists' => 'Выбранное ведомство не существует в базе данных.',

            'departments.*.okveds.string' => 'ОКВЭДы должны быть строкой.',
        ];
    }
}