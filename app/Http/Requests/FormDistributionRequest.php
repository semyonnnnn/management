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
            'name' => ['required', 'string', 'max:255'],

            // Валидация для вложенной структуры отделов (без okveds)
            'departments' => ['nullable', 'array'],
            'departments.*.department_id' => ['nullable', 'exists:departments,id'],
        ];

        // Если это запрос на обновление, проверяем существование ID самой записи
        if ($this->isMethod('put') || $this->isMethod('patch') || $this->has('id')) {
            $rules['id'] = ['required', 'exists:forms,id'];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'id.required' => 'ID формы обязателен для обновления.',
            'id.exists' => 'Редактируемая форма не найдена.',

            'name.required' => 'Поле "Название" обязательно для заполнения.',
            'name.string' => 'Название должно быть текстовым.',
            'name.max' => 'Название не может превышать 255 символов.',

            'departments.array' => 'Структура отделов должна быть массивом.',
            'departments.*.department_id.exists' => 'Выбранное ведомство не существует в базе данных.',
        ];
    }
}