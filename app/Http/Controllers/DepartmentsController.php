<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
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

        // FIXED: Removed 'department_id', 'coeff', and 'final' as they do not exist in your table.
        $forms = DB::table('forms')
            ->where('version_id', $currentVersion->id)
            ->select('id', 'name', 'indicators', 'reports')
            ->orderBy('name', 'asc')
            ->get();

        if ($departments->isEmpty()) {
            return Inertia::render('Departments/Index', [
                'departments' => [],
                'forms' => [],
                'versionId' => $currentVersion->id,
            ]);
        }

        // 3. Conditional Form Mapping
        // Since 'department_id' does not exist in 'forms', we cannot group by it.
        // If your forms are not linked to departments in the DB, this logic must be empty or different.
        $formsGroupedByName = collect([]);

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