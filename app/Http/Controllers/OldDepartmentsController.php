<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
/////////////////////////////////////
use App\Services\UploadFilesService;

class OldDepartmentsController extends Controller
{
    protected UploadFilesService $uploadFilesService;

    public function __construct(UploadFilesService $uploadFilesService)
    {
        $this->uploadFilesService = $uploadFilesService;
    }

    public function index()
    {

        // 2. Fetch Data
        $departments = DB::table('old_departments')
            ->select('id', 'name', 'territory', 'staff', 'workload', 'state')
            ->orderBy('name', 'asc')
            ->get();


        $forms = DB::table('old_forms')
            ->select('id', 'name', 'indicators', 'reports', 'coeff', 'final', 'old_department_id')
            ->orderBy('name', 'asc')
            ->get();

        if ($departments->isEmpty()) {
            return Inertia::render('OldDepartments/Index', [
                'departments' => [],
                'forms' => [],
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
                'id' => (string) $dep->id,
                'name' => $dep->name,
                'territory' => $dep->territory,
                'staff' => (int) $dep->staff,
                'workload' => (int) $dep->workload,
                'forms' => $formsGroupedByName->get($dep->name, collect([]))->values(),
                'state' => $dep->state
            ];
        })->values();

        return Inertia::render('OldDepartments/Index', [
            'departments' => $departmentsWithForms,
            'forms' => $forms,
        ]);
    }
}
