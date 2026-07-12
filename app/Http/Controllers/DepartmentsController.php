<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
/////////////////////////////////////
use App\Services\UploadFilesService;
use App\Models\Version;

class DepartmentsController extends Controller
{
    protected UploadFilesService $uploadFilesService;

    public function __construct(UploadFilesService $uploadFilesService)
    {
        $this->uploadFilesService = $uploadFilesService;
    }

    public function index()
    {
        $currentVersion = Version::query()->where('isCurrent', true)->first();

        // Handle case where no version exists
        if (!$currentVersion) {
            return Inertia::render('Departments/Index', [
                'departments' => [],
                'forms' => [],
                'versionId' => 0,
            ]);
        }

        // 2. Fetch Data
        $departments = DB::table('departments')
            ->where('version_id', $currentVersion->id)
            ->select('id', 'name', 'territory', 'staff', 'workload', 'state')
            ->orderBy('name', 'asc')
            ->get();


        $forms = DB::table('forms')
            ->where('version_id', $currentVersion->id)
            ->select('id', 'name', 'indicators', 'reports', 'coeff', 'final', 'department_id')
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
            // FIXED: Changed 'department_id' to 'department_id'
            $DepartmentIds = $forms->pluck('department_id')->unique()->toArray();
            $DepartmentsLookup = DB::table('departments')
                ->whereIn('id', $DepartmentIds)
                ->pluck('name', 'id')
                ->toArray();

            $formsGroupedByName = $forms->groupBy(function ($form) use ($DepartmentsLookup) {
                // FIXED: Changed 'department_id' to 'department_id'
                return $DepartmentsLookup[$form->department_id] ?? 'unknown';
            });
        }

        // 4. Build response
        $departmentsWithForms = $departments->map(function ($dep) use ($formsGroupedByName) {
            return [
                'id' => (string) $dep->id,
                'name' => $dep->name,
                'territory' => $dep->territory,
                'staff' => (int) $dep->staff,
                'workload' => (int) $dep->workload,
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
