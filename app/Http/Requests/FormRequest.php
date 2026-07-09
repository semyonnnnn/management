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
            'name'          => ['required', 'string', 'max:255'],
            'indicators'    => ['required', 'integer', 'min:0'],
            'reports'       => ['required', 'integer', 'min:0'],
            'coeff'         => ['required', 'numeric'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'versions_id'   => ['required', 'exists:versions,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'          => 'Поле "Название" обязательно для заполнения.',
            'name.string'            => 'Название должно быть текстовым.',
            'name.max'               => 'Название не может превышать 255 символов.',

            'indicators.required'    => 'Поле "Показатели" обязательно.',
            'indicators.integer'     => 'Показатели должны быть целым числом.',

            'reports.required'       => 'Поле "Отчеты" обязательно.',
            'reports.integer'        => 'Отчеты должны быть целым числом.',

            'coeff.required'         => 'Поле "Коэффициент" обязательно.',
            'coeff.numeric'          => 'Коэффициент должен быть числом.',

            'department_id.exists'   => 'Выбранное ведомство не существует.',

            'versions_id.required'   => 'Версия не указана.',
            'versions_id.exists'     => 'Указанная версия не найдена.',
        ];
    }
}
