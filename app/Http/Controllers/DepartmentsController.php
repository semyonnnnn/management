<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
/////////////////////////////////////
use App\Services\UploadFilesService;
use App\Models\Form;
use App\Models\Department;

class DepartmentsController extends Controller
{
    protected UploadFilesService $uploadFilesService;

    public function __construct(UploadFilesService $uploadFilesService)
    {
        $this->uploadFilesService = $uploadFilesService;
    }

    public function index()
    {
        $departments = Department::all();
        $forms = Form::all();


        if ($departments->isEmpty()) {
            return Inertia::render('Dashboard/Index', [
                'departments' => [],
                'forms' => [],
            ]);
        }

        // 3. Conditional Form Mapping
        // Since 'department_id' does not exist in 'forms', we cannot group by it.
        // If your forms are not linked to departments in the DB, this logic must be empty or different.

        // 4. Build response
        $departmentsWithForms = $departments->map(function ($dep) {
            // dd($dep->forms);
            return [
                'id' => (string) $dep->id,
                'name' => $dep->name,
                'territory' => $dep->territory,
                'staff' => (int) $dep->staff,
                'workload' => (int) $dep->workload,
                'forms' => $dep->forms,
                'state' => $dep->state
            ];
        })->values();

        return Inertia::render('Dashboard/Index', [
            'departments' => $departmentsWithForms,
            'forms' => $forms,
        ]);
    }
}