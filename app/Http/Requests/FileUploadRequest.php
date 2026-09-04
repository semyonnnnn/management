<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FileUploadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv', 'max:10240'],
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'Файл обязателен для загрузки.',
            'file.file' => 'Загружаемый объект должен являться действительным файлом.',
            'file.mimes' => 'Допустимы исключительно файлы следующих форматов: xlsx, xls, csv.',
            'file.max' => 'Размер файла превышает допустимый лимит в 10 МБ.',
        ];
    }
}