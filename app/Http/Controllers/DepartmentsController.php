<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Services\UploadService;

class DepartmentsController extends Controller
{
    protected UploadService $uploadService;

    public function __construct(UploadService $uploadService)
    {
        $this->uploadService = $uploadService;
    }

    public function index(Request $request)
    {
        // 1. Get the current version
        $currentVersion = DB::table('versions')
            ->where('isCurrent', true)
            ->first();

        // Handle case where no version exists
        if (!$currentVersion) {
            return Inertia::render('Departments/Index', [
                'departments' => [],
                'forms' => [],
                'versionId' => 0,
            ]);
        }

        // 2. Fetch Data
        $departments = DB::table('old_departments')
            ->where('version_id', $currentVersion->id)
            ->select('id', 'name', 'territory', 'staff', 'workload', 'state')
            ->orderBy('name', 'asc')
            ->get();


        $forms = DB::table('old_forms')
            ->where('version_id', $currentVersion->id)
            ->select('id', 'name', 'indicators', 'reports', 'coeff', 'final', 'old_department_id')
            ->orderBy('name', 'asc')
            ->get();

        // Handle case where version exists but has no departments (Return early)
        if ($departments->isEmpty()) {
            return Inertia::render('Departments/Index', [
                'departments' => [],
                'forms' => [],
                'versionId' => $currentVersion->id,
            ]);
        }

        // 3. Conditional Form Mapping
        $formsGroupedByName = collect([]);

        if ($forms->isNotEmpty()) {
            // FIXED: Changed 'department_id' to 'old_department_id'
            $oldDepartmentIds = $forms->pluck('old_department_id')->unique()->toArray();
            $oldDepartmentsLookup = DB::table('old_departments')
                ->whereIn('id', $oldDepartmentIds)
                ->pluck('name', 'id')
                ->toArray();

            $formsGroupedByName = $forms->groupBy(function ($form) use ($oldDepartmentsLookup) {
                // FIXED: Changed 'department_id' to 'old_department_id'
                return $oldDepartmentsLookup[$form->old_department_id] ?? 'unknown';
            });
        }

        // 4. Build response
        $departmentsWithForms = $departments->map(function ($dep) use ($formsGroupedByName) {
            return [
                'id' => (string)$dep->id,
                'name' => $dep->name,
                'territory' => $dep->territory,
                'staff' => (int)$dep->staff,
                'workload' => (int)$dep->workload,
                'forms' => $formsGroupedByName->get($dep->name, collect([]))->values(),
                'state' => $dep->state
            ];
        })->values();

        return Inertia::render('Departments/Index', [
            'departments' => $departmentsWithForms,
            'forms' => $forms,
            'versionId' => $currentVersion->id
        ]);
    }
}
