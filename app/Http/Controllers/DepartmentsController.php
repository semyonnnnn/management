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

    if (!$currentVersion) {
        return Inertia::render('Departments/Index', [
            'departments' => [],
            'forms' => [],
            'versionId' => 0,
        ]);
    }

    // 2. Fetch all departments for this version
    $departments = DB::table('departments')
        ->where('versions_id', $currentVersion->id)
        ->select('id', 'name', 'territory', 'staff', 'workload', 'state')
        ->orderBy('name', 'asc')
        ->get();

    // 3. Fetch all forms for this version
    $forms = DB::table('forms')
        ->where('versions_id', $currentVersion->id)
        ->select('id', 'name', 'indicators', 'reports', 'coeff', 'final', 'department_id')
        ->orderBy('name', 'asc')
        ->get();

    /* 
    |--------------------------------------------------------------------------
    | BACKUP WORKAROUND: Map by Name if IDs are mismatched
    |--------------------------------------------------------------------------
    | Because the forms table contains stale department_ids, we map them by 
    | department name so that your data binds perfectly on the frontend.
    */
    
    // Create an array mapping: ['Old Dept ID' => 'Dept Name'] 
    // We get this by finding what departments those old IDs belonged to
    $oldDepartmentIds = $forms->pluck('department_id')->unique()->toArray();
    $oldDepartmentsLookup = DB::table('departments')
        ->whereIn('id', $oldDepartmentIds)
        ->pluck('name', 'id')
        ->toArray();

    // Group forms by department name for an O(1) lightning-fast lookup map
    $formsGroupedByName = $forms->groupBy(function ($form) use ($oldDepartmentsLookup) {
        return $oldDepartmentsLookup[$form->department_id] ?? 'unknown';
    });

    // 4. Build your response array
    $departmentsWithForms = $departments->map(function ($dep) use ($formsGroupedByName) {
        // Find matching forms using the department's name
        $depForms = $formsGroupedByName->get($dep->name, collect([]))->values();

        return [
            'id' => (string)$dep->id, // Cast to string to match your React component expectations
            'name' => $dep->name,
            'territory' => $dep->territory,
            'staff' => (int)$dep->staff,
            'workload' => (int)$dep->workload,
            'forms' => $depForms,
            'state' => $dep->state
        ];
    })->values();

    return Inertia::render('Departments/Index', [
        'departments' => $departmentsWithForms,
        'forms' => $forms, // Kept to satisfy your prop types if needed
        'versionId' => $currentVersion->id // Matches your React Index component expectations
    ]);
}
}