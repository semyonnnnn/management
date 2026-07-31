<?php

namespace App\Services;

use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx as XlsxReader;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
////////////////////////////////////////////
use App\Http\Requests\OldUploadRequest;

class UploadFilesService
{
    //OldUploadRequest
    public function store(OldUploadRequest $request)
    {
        // 1. Custom validation for Excel sheets
        $this->validateSheetNames($request);

        // 2. Process via Python script
        $res = $this->python($request);

        // 3. Validate Python response structure
        $clean = $this->validatePythonResponse($res);

        // 4. Store using the default hardcoded version name (Will truncate/override existing data)
        $this->storeDataRaw($clean, 'start');

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
        DB::transaction(function () use ($data) {

            // 1. Wipe existing table data to perform a full overwrite
            // Delete dependent forms first to prevent Foreign Key Constraint errors
            DB::table('old_forms')->delete();
            DB::table('old_departments')->delete();

            // 2. Insert fresh Departments and store ID map by name
            $depIdMap = [];
            foreach ($data['departments'] as $dep) {
                $depId = DB::table('old_departments')->insertGetId([
                    'name' => $dep['name'],
                    'territory' => $dep['territory'],
                    'staff' => $dep['staff'],
                    'state' => $dep['staff'], // ← state gets the same initial value as staff
                    'workload' => $dep['workload'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $depIdMap[$dep['name']] = $depId;
            }

            // 3. Insert fresh Forms and link to actual department ID
            foreach ($data['forms'] as $form) {
                $depName = $form['department'] ?? null;
                $depId = $depName && isset($depIdMap[$depName]) ? $depIdMap[$depName] : null;

                DB::table('old_forms')->insert([
                    'name' => $form['name'],
                    'indicators' => $form['indicators'],
                    'reports' => $form['reports'],
                    'coeff' => $form['coeff'],
                    'final' => $form['final'],
                    'old_department_id' => $depId,
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

    public function update(Request $request)
    {
        \Log::info('Manual edit request', $request->all());

        $validated = $request->validate([
            'departments' => 'required|array',
            'departments.*.id' => 'required|integer|exists:old_departments,id',
            'departments.*.staff' => 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['departments'] as $deptUpdate) {
                $originalDept = DB::table('old_departments')
                    ->where('id', $deptUpdate['id'])
                    ->first();

                \Log::info('Original department', [
                    'id' => $deptUpdate['id'],
                    'old_staff' => $originalDept->staff,
                    'old_state' => $originalDept->state,
                ]);

                DB::table('old_departments')
                    ->where('id', $deptUpdate['id'])
                    ->update([
                        'staff' => $deptUpdate['staff'],
                        'state' => $originalDept->state, // Use exact original value
                        'updated_at' => now()
                    ]);

                $updatedDept = DB::table('old_departments')
                    ->where('id', $deptUpdate['id'])
                    ->first();

                \Log::info('Updated department', [
                    'id' => $deptUpdate['id'],
                    'new_staff' => $updatedDept->staff,
                    'state_after_update' => $updatedDept->state
                ]);
            }
        });

        return response()->json(['success' => true, 'message' => 'Staff updated successfully']);
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