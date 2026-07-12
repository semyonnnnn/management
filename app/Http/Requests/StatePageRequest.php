<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StatePageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Set this to true to allow authenticated users to submit
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'code' => [
                'required',
                'string',
                'max:50',
            ],
            'okud' => [
                'nullable',
                'numeric', // Enforces only numbers (digits/decimals)
                'regex:/^\d+$/', // Strict fallback to ensure no dots/signs if you want pure digits
            ],
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'state' => [
                'required',
                'integer', // Enforces whole numbers
                'min:0',
            ],
            'territory' => [
                'required',
                'string',
                Rule::in(['ekb', 'krg']), // Validates against your exact allowed territory codes
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'okud.numeric' => 'Поле ОКУД должно содержать только числа.',
            'okud.regex' => 'Поле ОКУД должно состоять только из цифр.',
            'state.integer' => 'Количество штатных единиц должно быть целым числом.',
            'state.min' => 'Количество штатных единиц не может быть отрицательным.',
            'territory.in' => 'Выбрана некорректная территория.',
        ];
    }
}