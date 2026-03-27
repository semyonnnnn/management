<?php

namespace App\Services;

use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx as XlsxReader;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;

class UploadService
{
    public function handle(Request $request)
    {
        // 1. Validate files and internal sheet names
        $this->validateUpload($request);
        $this->validateSheetNames($request);

        // 2. Forward both files to Python service
        $res = $this->python($request);

        // 3. Purge and sanitize the data returned from Python
        $clean = $this->validatePythonResponse($res);

        // 4. Store everything in a single transaction
        $this->storeDataRaw($clean, $request->input('version'));

        return response()->json(['success' => true]);
    }

    /**
     * Clean and validate the data coming back from the Python microservice
     */
    protected function validatePythonResponse(array $res): array
    {
        // Check for both keys now: 'departments' (or 'departments') and 'forms'
        // Using 'departments' based on your first snippet's Python structure
        if (!isset($res['data']['departments'], $res['data']['forms'])) {
            throw ValidationException::withMessages([
                'python' => ['Ответ от Python сервиса не содержит необходимые ключи (departments/forms).']
            ]);
        }

        $departments = [];
        foreach ($res['data']['departments'] as $dep) {
            $departments[] = [
                'name' => isset($dep['name']) ? substr(strip_tags($dep['name']), 0, 255) : '',
                'territory' => in_array($dep['territory'] ?? '', ['ekb', 'krg']) ? $dep['territory'] : 'ekb',
                'staff' => isset($dep['staff']) ? (int) $dep['staff'] : 0,
                'workload' => isset($dep['workload']) ? (int) $dep['workload'] : 0,
            ];
        }

        $forms = [];
        foreach ($res['data']['forms'] as $form) {
            $forms[] = [
                'name' => isset($form['name']) ? substr(strip_tags($form['name']), 0, 255) : '',
                'indicators' => isset($form['indicators']) ? (int) $form['indicators'] : 0,
                'reports' => isset($form['reports']) ? (int) $form['reports'] : 1,
                'coeff' => isset($form['coeff']) ? (float) $form['coeff'] : 1.0,
                'final' => isset($form['final']) ? (int) $form['final'] : 0,
            ];
        }

        return [
            'departments' => $departments,
            'forms' => $forms,
        ];
    }

    /**
     * Atomic storage of Version, Departments, and Forms
     */
    protected function storeDataRaw(array $data, string $versionName): void
    {
        DB::transaction(function () use ($data, $versionName) {
            // 1. Deactivate old current version
            DB::table('versions')
                ->where('isCurrent', true)
                ->update([
                    'isCurrent' => false,
                    'updated_at' => now()
                ]);

            // 2. Create new Version record
            $versionId = DB::table('versions')->insertGetId([
                'name' => $versionName,
                'isCurrent' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 3. Insert Departments and keep a map of IDs
            $depIdMap = [];
            foreach ($data['departments'] as $dep) {
                $depId = DB::table('departments')->insertGetId([
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

            // 4. Insert Forms
            // Linking to the first department as a placeholder if department-specific logic isn't in Python yet
            $firstDepId = reset($depIdMap) ?: null;

            foreach ($data['forms'] as $form) {
                DB::table('forms')->insert([
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
        $response = Http::attach(
            'matrix',
            file_get_contents($request->file('matrix')->getRealPath()),
            $request->file('matrix')->getClientOriginalName()
        )->post('http://python:8000/process');

        if ($response->failed()) {
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
            'version.unique' => 'Эта версия уже существует',
            'matrix.required' => 'Файл матрицы обязателен',
            'matrix.mimes' => 'Матрица должна быть .xlsx',
            // 'forms.required' => 'Файл справочника обязателен',
            // 'forms.mimes' => 'Справочник должен быть .xlsx',
        ];

        $validator = Validator::make(
            $request->all() + $request->allFiles(),
            [
                'version' => ['required', 'string', 'unique:versions,name'],
                'matrix' => ['required', 'file', 'mimes:xlsx'],
                // 'forms' => ['required', 'file', 'mimes:xlsx'],
            ],
            $messages
        );

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }
    }

    protected function validateSheetNames(Request $request): void
    {
        // ONLY include 'matrix' here. 
        // If 'forms' is in this array, it will cause the "Ошибка чтения файла" if the file is missing.
        $configs = [
            'matrix' => ['КО', 'СО'],
        ];

        $errors = [];
        $reader = new XlsxReader();
        $reader->setReadDataOnly(true);

        foreach ($configs as $inputKey => $requiredSheets) {
            $file = $request->file($inputKey);

            // If the file isn't there (and it's not the required matrix), just skip
            if (!$file) {
                continue;
            }

            try {
                $reader->setLoadSheetsOnly($requiredSheets);
                // This is where it was crashing for 'forms'
                $spreadsheet = $reader->load($file->getPathname());
                $existingSheets = $spreadsheet->getSheetNames();

                foreach ($requiredSheets as $rs) {
                    if (!in_array($rs, $existingSheets)) {
                        $errors[$inputKey][] = "Лист «{$rs}» не найден.";
                    }
                }
            } catch (\Throwable $e) {
                // This is the error message you are seeing
                $errors[$inputKey][] = "Ошибка чтения файла " . ($inputKey === 'matrix' ? 'матрицы' : 'справочника') . ".";
            }
        }

        if (!empty($errors)) {
            throw ValidationException::withMessages($errors);
        }
    }
    // Dynamic bound detection logic (kept as requested)
    protected function detectDataBounds($sheet, int $maxGap = 10, int $maxRowsLimit = 20, int $maxColumnsList = 10): array
    {
        // ... (rest of your detectDataBounds logic remains the same)
        // I have omitted the full body for brevity, but it should remain in your class
        return [[], []]; // Placeholder
    }
}