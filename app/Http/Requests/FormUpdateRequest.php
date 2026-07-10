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
            'name'                        => ['required', 'string', 'max:255'],
            'indicators'                  => ['required', 'integer', 'min:0'],
            'reports'                     => ['required', 'integer', 'min:0'],
            'coeff'                       => ['required', 'numeric'],
            'version_id'                  => ['required', 'exists:versions,id'], // Исправлено с versions_id

            // Валидация вложенной структуры ведомств
            'departments'                 => ['nullable', 'array'],
            'departments.*.department_id' => ['nullable', 'exists:departments,id'],
            'departments.*.okveds'        => [
                'array',
                function ($attribute, $value, $fail) {
                    // Извлекаем текущий индекс элемента в массиве (например, "0" из "departments.0.okveds")
                    preg_match('/departments\.(\d+)\.okveds/', $attribute, $matches);

                    if (isset($matches[1])) {
                        $index = $matches[1];
                        $deptId = $this->input("departments.{$index}.department_id");

                        // Если ID ведомства не заполнен/null, но массив оквэдов не пустой
                        if (blank($deptId) && !empty($value)) {
                            $fail('Коды ОКВЭД не могут быть указаны, если у отдела не выбрано ведомство.');
                        }
                    }
                }
            ],
            'departments.*.okveds.*'      => ['string', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'                      => 'Поле "Название" обязательно для заполнения.',
            'name.string'                        => 'Название должно быть текстовым.',
            'name.max'                           => 'Название не может превышать 255 символов.',

            'indicators.required'                => 'Поле "Показатели" обязательно.',
            'indicators.integer'                 => 'Показатели должны быть целым числом.',

            'reports.required'                   => 'Поле "Отчеты" обязательно.',
            'reports.integer'                    => 'Отчеты должны быть целым числом.',

            'coeff.required'                     => 'Поле "Коэффициент" обязательно.',
            'coeff.numeric'                      => 'Коэффициент должен быть числом.',

            'version_id.required'                => 'Версия не указана.',
            'version_id.exists'                  => 'Указанная версия не найдена.',

            // Сообщения для вложенных массивов отделов
            'departments.array'                  => 'Структура отделов должна быть массивом.',
            'departments.*.department_id.exists' => 'Выбранное ведомство не существует в базе данных.',
            'departments.*.okveds.array'         => 'Коды ОКВЭД должны передаваться списком.',
            'departments.*.okveds.*.string'      => 'Код ОКВЭД должен быть строкой.',
        ];
    }
}
