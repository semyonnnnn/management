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
        // 1️⃣ Validate the uploaded Excel files
        $this->validateUpload($request);
        $this->validateSheetNames($request);

        // 2️⃣ Call Python service
        $res = $this->python($request);

        // 3️⃣ Validate and sanitize Python response
        $clean = $this->validatePythonResponse($res);

        // 4️⃣ Store into DB directly
        $this->storeDataRaw($clean, $request->input('version'));

        return response()->json(['success' => true]);
    }

    /**
     * Validate Python response and purge untrusted input
     */
    protected function validatePythonResponse(array $res): array
    {
        if (!isset($res['data']['deps'], $res['data']['forms'])) {
            throw ValidationException::withMessages([
                'python' => ['Python response is missing required keys.']
            ]);
        }

        $deps = [];
        foreach ($res['data']['deps'] as $dep) {
            $deps[] = [
                'name' => isset($dep['name']) ? substr(strip_tags($dep['name']), 0, 255) : '',
                'territory' => in_array($dep['territory'] ?? '', ['ekb', 'krg']) ? $dep['territory'] : 'ekb',
                'staff' => isset($dep['staff']) ? (int) $dep['staff'] : 0,
                'workload' => isset($dep['workload']) ? (int) $dep['workload'] : 0,
            ];
        }

        $forms = [];
        foreach ($res['data']['forms'] as $form) {
            $forms[] = [
                'name' => isset($form['name']) ? substr(strip_tags($form['name']), 0, 60) : '',
                'indicators' => isset($form['indicators']) ? (int) $form['indicators'] : 0,
                'reports' => isset($form['reports']) ? (int) $form['reports'] : 1,
                'coeff' => isset($form['coeff']) ? (float) $form['coeff'] : 1.0,
                'final' => isset($form['final']) ? (int) $form['final'] : 0,
            ];
        }

        return [
            'deps' => $deps,
            'forms' => $forms,
        ];
    }

    /**
     * Store data directly into the database using DB facade
     */
    protected function storeDataRaw(array $data, string $versionName): void
    {
        \DB::transaction(function () use ($data, $versionName) {
            // Insert version
            $versionId = \DB::table('versions')->insertGetId([
                'name' => $versionName,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Insert departments
            $depIdMap = [];
            foreach ($data['deps'] as $dep) {
                $depId = \DB::table('departments')->insertGetId([
                    'name' => $dep['name'],
                    'territory' => $dep['territory'],
                    'staff' => $dep['staff'],
                    'workload' => $dep['workload'],
                    'versions_id' => $versionId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $depIdMap[$dep['name']] = $depId;
            }

            // Insert forms, assign to first department as placeholder
            $firstDepId = reset($depIdMap);
            foreach ($data['forms'] as $form) {
                \DB::table('forms')->insert([
                    'name' => $form['name'],
                    'indicators' => $form['indicators'],
                    'reports' => $form['reports'],
                    'coeff' => $form['coeff'],
                    'final' => $form['final'],
                    'department_id' => $firstDepId,
                    'versions_id' => $versionId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        });
    }

    public function python(Request $request)
    {
        $response = \Illuminate\Support\Facades\Http::attach(
            'matrix',
            file_get_contents($request->file('matrix')->getRealPath()),
            $request->file('matrix')->getClientOriginalName()
        )->attach(
                'forms',
                file_get_contents($request->file('forms')->getRealPath()),
                $request->file('forms')->getClientOriginalName()
            )->post('http://python:8000/process');

        if ($response->failed()) {
            // This will tell you if Python crashed (500) or wasn't found (404)
            return response()->json([
                'error' => 'Python service failed',
                'details' => $response->body()
            ], $response->status());
        }

        return $response->json();
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