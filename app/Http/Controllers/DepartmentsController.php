<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
/////////////////////////////////////
use App\Services\UploadFilesService;
use App\Models\Form;
use App\Models\Department;
use App\Models\Schedule;
use App\Models\SyncLogs;

class DepartmentsController extends Controller
{
    protected UploadFilesService $uploadFilesService;

    public function __construct(UploadFilesService $uploadFilesService)
    {
        $this->uploadFilesService = $uploadFilesService;
    }

    public function index()
    {
        // with('forms') = one extra query for all departments (no N+1)
        $departments = Department::with('forms')->get();

        $payload = $departments->map(function ($dep) {
            // Each form is computed exactly once here. The result is reused
            // for the table rows AND for the department total below.
            $forms = $dep->forms->map(function ($form) {
                $coeff = $form->k1 * $form->k2 * $form->k3 * $form->k4 * $form->k5 * $form->k6;
                $coeffRounded = round($form->k1 * $form->k2 * $form->k3 * $form->k4 * $form->k5 * $form->k6, 3);
                $final = round($coeff * $form->indicators * $form->reports_count, 1);

                return [
                    'id' => $form->id,
                    'name' => $form->name,
                    'indicators' => $form->indicators,
                    'reports_count' => $form->reports_count,
                    'coeff' => $coeffRounded,
                    'final' => $final,
                ];
            });

            return [
                'id' => (string) $dep->id,
                'name' => $dep->name,
                'territory' => $dep->territory,
                'staff' => (int) $dep->staff,
                'state' => $dep->state,
                // Sum the values we already computed instead of calling
                // computeWorkload() a second time for every form
                'workload' => $forms->sum('final'),
                'forms' => $forms,
            ];
        });

        return Inertia::render('Dashboard/Index', [
            'departments' => $payload,
            'timestamp' => SyncLogs::value('synced_when') ?? 'пусто',
        ]);
    }
    public function delete(int $id)
    {
        $department = Department::find($id);
        $depName = $department->name;
        $department->delete();

        if (!Department::exists()) {
            Schedule::first()->delete();
        }

        return redirect()->back()->with('success', "Отдел '$depName' успешно удалён!");
    }
}