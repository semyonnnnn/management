<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // Ensure DB is imported
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
                'version_name' => 'No active version',
                'forms' => []
            ]);
        }

        // 2. Fetch all departments for this version
        $departments = DB::table('departments')
            ->where('versions_id', $currentVersion->id)
            ->select('id', 'name', 'territory', 'staff', 'workload')
            ->orderBy('name', 'asc')
            ->get()
            ->keyBy('id'); // for quick lookup

        // 3. Fetch all forms for this version
        $forms = DB::table('forms')
            ->where('versions_id', $currentVersion->id)
            ->select('id', 'name', 'indicators', 'reports', 'coeff', 'final', 'department_id')
            ->orderBy('name', 'asc')
            ->get();

        // 4. Map forms into departments
        $departmentsWithForms = $departments->map(function ($dep) use ($forms) {
            $depForms = $forms->filter(fn($f) => $f->department_id == $dep->id)->values();
            return [
                'id' => $dep->id,
                'name' => $dep->name,
                'territory' => $dep->territory,
                'staff' => $dep->staff,
                'workload' => $dep->workload,
                'forms' => $depForms
            ];
        })->values();

        return Inertia::render('Departments/Index', [
            'departments' => $departmentsWithForms,
            'version_name' => $currentVersion->name
        ]);
    }
}