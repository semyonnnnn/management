<?php

namespace App\Http\Requests\DocCreate;

use Illuminate\Foundation\Http\FormRequest;


class DocCreateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'doc_name' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'min:5', 'max:32'],
            'description' => ['required', 'string', 'min:20', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'doc_name.required' => 'Укажите имя документа.',
            'title.required' => 'Укажите заголовок.',
            'title.min' => 'Заголовок должен быть не менее :min символов.',
            'title.max' => 'Заголовок должен быть не более :max символов.',
            'description.required' => 'Укажите описание.',
            'description.min' => 'Описание должно быть не менее :min символов.',
            'description.max' => 'Описание должно быть не более :max символов.',
        ];
    }

}