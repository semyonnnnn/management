<?php

namespace App\Services;

use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx as XlsxReader;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;

class UploadService
{
    public function handle(Request $request)
    {
        $this->validateUpload($request);
        $this->validateSheetNames($request);
        $data = $this->getData($request);

        dd($data);
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

    protected function validateSheetNames(Request $request): void
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
            $file = $files[$key];

            try {
                $reader = new XlsxReader();
                $reader->setReadDataOnly(true);
                $reader->setLoadSheetsOnly($sheets);

                $spreadsheet = $reader->load($file->getPathname());
                $sheetNames = $spreadsheet->getSheetNames();

                foreach ($sheets as $sheet) {
                    if (!in_array($sheet, $sheetNames)) {
                        $errors[$key][] = "Лист «{$sheet}» не найден в {$fileNames[$key]}.";
                    }
                }

            } catch (\Throwable $e) {
                $errors[$key][] = "Не удалось прочитать {$fileNames[$key]}. Проверьте файл.";
            }
        }

        if (!empty($errors)) {
            throw ValidationException::withMessages($errors);
        }
    }

    /**
     * Detect “real” data bounds dynamically
     * - Scans columns first, allows gaps up to $maxGap
     * - Then scans rows within detected columns, allows gaps
     */
    protected function detectDataBounds($sheet, int $maxGap = 10, int $maxRowsLimit = 20, int $maxColumnsList = 10): array
    {
        $activeColumns = [];
        $emptyStreak = 0;
        $col = 1;

        // --- Scan columns dynamically ---
        while (true) {
            $columnLetter = Coordinate::stringFromColumnIndex($col);
            $hasData = false;
            $row = 1;
            $rowEmptyStreak = 0;

            // Check column for any data (gap-tolerant)
            while (true) {
                $value = $sheet->getCell($columnLetter . $row)->getValue();
                if (!is_null($value) && trim((string) $value) !== '') {
                    $hasData = true;
                    $rowEmptyStreak = 0;
                } else {
                    $rowEmptyStreak++;
                    if ($rowEmptyStreak > $maxGap) {
                        break;
                    }
                }
                $row++;

                if ($row > $maxRowsLimit) {
                    throw ValidationException::withMessages([
                        'matrix' => ["Превышено максимальное количество строк ({$maxRowsLimit}) в колонке {$columnLetter}."],
                        'forms' => ["Превышено максимальное количество строк ({$maxRowsLimit}) в колонке {$columnLetter}."]
                    ]);
                }
            }

            if ($hasData) {
                $activeColumns[] = $col;
                $emptyStreak = 0;
            } else {
                $emptyStreak++;
                if ($emptyStreak > $maxGap) {
                    break;
                }
            }

            $col++;
            if ($row > $maxColumnsList) {
                throw ValidationException::withMessages([
                    'matrix' => ["Превышено максимальное количество столбцов ($maxColumnsList)."]
                ]);
            }
        }

        // --- Scan rows based on detected columns ---
        $activeRows = [];
        $emptyStreak = 0;
        $row = 1;

        while (true) {
            $hasData = false;

            foreach ($activeColumns as $col) {
                $columnLetter = Coordinate::stringFromColumnIndex($col);
                $value = $sheet->getCell($columnLetter . $row)->getValue();

                if (!is_null($value) && trim((string) $value) !== '') {
                    $hasData = true;
                    break;
                }
            }

            if ($hasData) {
                $activeRows[] = $row;
                $emptyStreak = 0;
            } else {
                $emptyStreak++;
                if ($emptyStreak > $maxGap) {
                    break;
                }
            }

            $row++;

            // Hard stop for extremely long sheets
            if ($row > 100000) {
                throw new \RuntimeException("Excel file has more than 100,000 rows. Aborting scan.");
            }
        }

        return [$activeColumns, $activeRows];
    }

    protected function getData(Request $request)
    {
        $file = $request->file('matrix');

        $reader = new XlsxReader();
        $reader->setReadDataOnly(true);

        $spreadsheet = $reader->load($file->getPathname());
        $sheet = $spreadsheet->getActiveSheet();

        [$columns, $rows] = $this->detectDataBounds($sheet);

        return ([
            'columns' => $columns,
            'rows' => $rows,
        ]);
    }
}