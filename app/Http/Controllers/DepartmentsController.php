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
        // with('forms') loads every department's forms in one extra query
        // instead of one query per department (the N+1 you had)
        $departments = Department::with('forms')->get();

        $payload = $departments->map(fn($dep) => [
            'id' => (string) $dep->id,
            'name' => $dep->name,
            'territory' => $dep->territory,
            'staff' => (int) $dep->staff,
            'state' => $dep->state,
            'workload' => $dep->forms->sum(fn($form) => $form->computeWorkload()),
            'forms' => $dep->forms, // ModalDetails reads this per department
        ]);

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