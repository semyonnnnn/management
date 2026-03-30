<?php

namespace App\Services;

use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx as XlsxReader;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class UploadService
{
    public function handle(Request $request)
    {
        $this->validateUpload($request);
        $this->validateSheetNames($request);

        $res = $this->python($request);

        $clean = $this->validatePythonResponse($res);

        $this->storeDataRaw($clean, $request->input('version'));

        return response()->json(['success' => true]);
    }

    protected function validatePythonResponse(array $res): array
    {
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
                'department' => isset($form['department']) ? substr(strip_tags($form['department']), 0, 255) : null,
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

    protected function storeDataRaw(array $data, string $versionName): void
    {
        DB::transaction(function () use ($data, $versionName) {

            // 1. Deactivate old current version
            DB::table('versions')
                ->where('isCurrent', true)
                ->update(['isCurrent' => false, 'updated_at' => now()]);

            // 2. Create new Version record
            $versionId = DB::table('versions')->insertGetId([
                'name' => $versionName,
                'isCurrent' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 3. Insert Departments and store ID map by name
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

            // 4. Insert Forms and link to actual department ID
            foreach ($data['forms'] as $form) {
                $depName = $form['department'] ?? null;
                $depId = $depName && isset($depIdMap[$depName]) ? $depIdMap[$depName] : null;

                DB::table('forms')->insert([
                    'name' => $form['name'],
                    'indicators' => $form['indicators'],
                    'reports' => $form['reports'],
                    'coeff' => $form['coeff'],
                    'final' => $form['final'],
                    'department_id' => $depId, // now linked correctly
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
            throw ValidationException::withMessages([
                'python' => ['Python service failed', $response->body()]
            ]);
        }

        return $response->json();
    }

    public function validateUpload(Request $request): void
    {
        $validator = Validator::make(
            $request->all() + $request->allFiles(),
            [
                'version' => ['required', 'string', 'unique:versions,name'],
                'matrix' => ['required', 'file', 'mimes:xlsx'],
            ],
            [
                'version.required' => 'Название версии обязательно',
                'version.unique' => 'Эта версия уже существует',
                'matrix.required' => 'Файл матрицы обязателен',
                'matrix.mimes' => 'Матрица должна быть .xlsx',
            ]
        );

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }
    }

    protected function validateSheetNames(Request $request): void
    {
        $configs = [
            'matrix' => ['КО', 'СО'],
        ];

        $errors = [];
        $reader = new XlsxReader();
        $reader->setReadDataOnly(true);

        foreach ($configs as $inputKey => $requiredSheets) {
            $file = $request->file($inputKey);
            if (!$file)
                continue;

            try {
                $reader->setLoadSheetsOnly($requiredSheets);
                $spreadsheet = $reader->load($file->getPathname());
                $existingSheets = $spreadsheet->getSheetNames();

                foreach ($requiredSheets as $rs) {
                    if (!in_array($rs, $existingSheets)) {
                        $errors[$inputKey][] = "Лист «{$rs}» не найден.";
                    }
                }
            } catch (\Throwable $e) {
                $errors[$inputKey][] = "Ошибка чтения файла матрицы.";
            }
        }

        if (!empty($errors)) {
            throw ValidationException::withMessages($errors);
        }
    }
}