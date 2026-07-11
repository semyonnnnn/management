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
            'indicators' => ['required', 'integer', 'min:0'],
            'reports' => ['required', 'integer', 'min:0'],
            'coeff' => ['required', 'numeric'],

            // For creation, version_id is determined automatically by the system,
            // but for update it's passed from the frontend. We make it required only if present.
            'version_id' => ['sometimes', 'required', 'exists:versions,id'],

            // Validation for the nested departments structure
            'departments' => ['nullable', 'array'],
            'departments.*.department_id' => ['nullable', 'exists:departments,id'],
            'departments.*.okveds' => [
                'array',
                function ($attribute, $value, $fail) {
                    preg_match('/departments\.(\d+)\.okveds/', $attribute, $matches);

                    if (isset($matches[1])) {
                        $index = $matches[1];
                        $deptId = $this->input("departments.{$index}.department_id");

                        if (blank($deptId) && !empty($value)) {
                            $fail('Коды ОКВЭД не могут быть указаны, если у отдела не выбрано ведомство.');
                        }
                    }
                }
            ],
            'departments.*.okveds.*' => ['string', 'max:50'],
        ];

        // If it's an update request, make sure the record ID itself exists
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

            'indicators.required' => 'Поле "Показатели" обязательно.',
            'indicators.integer' => 'Показатели должны быть целым числом.',

            'reports.required' => 'Поле "Отчеты" обязательно.',
            'reports.integer' => 'Отчеты должны быть целым числом.',

            'coeff.required' => 'Поле "Коэффициент" обязательно.',
            'coeff.numeric' => 'Коэффициент должен быть числом.',

            'version_id.required' => 'Версия не указана.',
            'version_id.exists' => 'Указанная версия не найдена.',

            'departments.array' => 'Структура отделов должна быть массивом.',
            'departments.*.department_id.exists' => 'Выбранное ведомство не существует в базе данных.',
            'departments.*.okveds.array' => 'Коды ОКВЭД должны передаваться списком.',
            'departments.*.okveds.*.string' => 'Код ОКВЭД должен быть строкой.',
        ];
    }
}