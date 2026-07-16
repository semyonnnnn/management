<?php

namespace App\Http\Requests;

class StateUpdateRequest extends StateCreateRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $parentRules = parent::rules();

        // Inject the ID validation rule since bulk items need an existing reference
        $parentRules['id'] = ['required', 'integer'];

        $rules = [
            'items' => ['required', 'array'],
        ];

        // Apply rules to the wildcard array syntax (e.g., items.*.id, items.*.name)
        foreach ($parentRules as $field => $rule) {
            $rules["items.*.$field"] = $rule;
        }

        return $rules;
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        $parentMessages = parent::messages();

        $messages = [
            'items.required'      => 'Список элементов обязателен.',
            'items.array'         => 'Неверный формат данных.',
            
            // Define custom messages for the newly injected ID field
            'items.*.id.required' => 'ID обязателен для каждого элемента.',
            'items.*.id.integer'  => 'ID каждого элемента должен быть целым числом.',
        ];

        // Map parent messages like 'code.required' to 'items.*.code.required'
        // This is crucial, otherwise Laravel won't match your custom translation keys to nested inputs
        foreach ($parentMessages as $key => $message) {
            $messages["items.*.$key"] = $message;
        }

        return $messages;
    }
}