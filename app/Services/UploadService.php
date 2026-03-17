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
        ];

        $validator = Validator::make(
            $request->all() + $request->allFiles(),
            [
                'version' => ['required', 'string'],
                'matrix' => ['required', 'file', 'mimes:xlsx'],
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
        ];

        $requiredSheets = [
            'matrix' => ['КО', 'СО'],
        ];

        $fileNames = [
            'matrix' => 'файле матрицы',
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