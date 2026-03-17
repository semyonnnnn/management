<?php

namespace App\Services;

use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx as XlsxReader;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class UploadService
{
    public function handle(Request $request)
    {
        $this->validateUpload($request);
        $this->validateSheets($request);
        dd($request->all());
    }

    public function validateUpload(Request $request): void
    {
        $messages = [
            'version.required' => 'Название версии обязательно',
            'version.string' => 'Название версии должно быть текстом',
            'matrix.required' => 'Файл матрицы обязателен',
            'matrix.file' => 'Файл матрицы должен быть корректным файлом',
            'matrix.mimes' => 'Файл матрицы должен быть формата .xlsx',
            'forms.required' => 'Файл справочника обязателен',
            'forms.file' => 'Файл справочника должен быть корректным файлом',
            'forms.mimes' => 'Файл справочника должен быть формата .xlsx',
        ];

        $validator = Validator::make(
            $request->all() + $request->allFiles(),
            [
                'version' => ['required', 'string'],
                'matrix' => ['required', 'file', 'mimes:xlsx'],
                'forms' => ['required', 'file', 'mimes:xlsx'],
            ],
            $messages
        );

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }
    }

    protected function validateSheets(Request $request): void
    {
        $files = [
            'matrix' => $request->file('matrix'),
            'forms' => $request->file('forms'),
        ];

        $requiredSheets = [
            'matrix' => ['КО', 'СО'],
            'forms' => ['Справочник'],
        ];

        $fileNames = [
            'matrix' => 'файле матрицы',
            'forms' => 'файле справочника',
        ];

        $errors = [];

        foreach ($requiredSheets as $key => $sheets) {
            /** @var \Illuminate\Http\UploadedFile $file */
            $file = $files[$key];

            try {
                $reader = new XlsxReader();
                $reader->setReadDataOnly(true);
                $spreadsheet = $reader->load($file->getPathname());
                $sheetNames = $spreadsheet->getSheetNames();

                foreach ($sheets as $sheet) {
                    if (!in_array($sheet, $sheetNames)) {
                        $errors[$key][] = "Лист «{$sheet}» не найден в {$fileNames[$key]}.";
                    }
                }

            } catch (\Throwable $e) {
                $errors[$key][] = "Не удалось прочитать {$fileNames[$key]}. Проверьте, что файл является корректным Excel-файлом.";
            }
        }

        if (!empty($errors)) {
            throw ValidationException::withMessages($errors);
        }
    }
}