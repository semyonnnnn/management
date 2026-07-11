<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Department;
////////////////////////////
use App\Models\Version;
use App\Http\Requests\DepartmentRequest;

class StatePageController extends Controller
{
    public function index()
    {
        $currentVersion = Version::query()->where('isCurrent', true)->first();
        $currentVersionId = $currentVersion?->id;
        $state = Department::query()->where('version_id', $currentVersionId)
            ->orderBy('id', 'asc')
            ->get(['id', 'territory', 'name', 'state', 'code']);

        return Inertia::render('State/Index', [
            'state' => $state->isNotEmpty() ? $state : null
        ]);
    }

    public function create(DepartmentRequest $r)
    {
        $version = Version::firstOrCreate(
            ['isCurrent' => true],
            ['id' => 1, 'name' => '1', 'isCurrent' => true]
        );

        Department::create(array_merge($r->validated(), [
            'version_id' => $version->id
        ]));

        return to_route('state.index')
            ->with('message', 'Отдел успешно добавлен');
    }

    public function delete($id)
    {
        $department = Department::findOrFail($id);
        $department->delete();

        return redirect()->back();
    }
}
