<?php

namespace App\Http\Requests\File;

use Illuminate\Foundation\Http\FormRequest;

class FileCreateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'files.*' => ['required', 'file', 'mimes:doc,docx', 'max:10240'],
            // files.* → each uploaded file
            // mimes:doc,docx → only Word documents allowed
            // max:10240 → max size 10 MB per file
        ];
    }

    public function messages(): array
    {
        return [
            'files.*.required' => 'Выберите файл для загрузки.',
            'files.*.file' => 'Выбранный файл должен быть корректным файлом.',
            'files.*.mimes' => 'Можно загружать только файлы Word (.doc, .docx).',
            'files.*.max' => 'Файл не должен превышать 10 МБ.',
        ];
    }
}
