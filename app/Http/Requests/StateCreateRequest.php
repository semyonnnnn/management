<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StateCreateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'regex:/^[0-9]{0,2}к?$/iu', 'min:1', 'max:3'],
            'name' => ['required', 'string', 'max:255', 'regex:/^(?![\s.])(?!.*\s\s)[а-яА-ЯёЁ0-9,.\(\)\s]+$/u'],
            'state' => ['required', 'integer', 'min:1', 'max:999'],
            'territory' => ['required', 'string', Rule::in(['ekb', 'krg'])],
        ];
    }

    public function messages(): array
    {
        return [
            'id.required'        => 'ID обязателен',
            'id.integer'         => 'ID должен быть числом.',

            // Code messages
            'code.required'      => 'Код обязателен для заполнения.',
            'code.string'        => 'Код должен быть текстовой строкой.',
            'code.regex'         => 'Код должен состоять из цифр и может заканчиваться на букву "к".',
            'code.min'           => 'Код слишком короткий (минимум 1 символ).',
            'code.max'           => 'Код слишком длинный (максимум 3 символа).',

            // Name messages
            'name.required'      => 'Название обязательно для заполнения.',
            'name.string'        => 'Название должно быть текстовой строкой.',
            'name.max'           => 'Название не может превышать 255 символов.',
            'name.regex'         => 'Название содержит недопустимые символы, двойные пробелы или начинается с неверного знака.',

            // State messages
            'state.required'     => 'Количество штатных единиц обязательно.',
            'state.integer'      => 'Количество должно быть целым числом.',
            'state.min'          => 'Количество не может быть меньше 1.',
            'state.max'          => 'Количество не может превышать 999.',

            // Territory messages
            'territory.required' => 'Необходимо выбрать территорию.',
            'territory.string'   => 'Территория должна быть строкой.',
            'territory.in'       => 'Выбрана некорректная территория (доступны только ЕКБ и КРГ).',
        ];
    }
}
