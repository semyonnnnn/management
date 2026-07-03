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
        $state = Department::whereHas('version', fn($q) => $q->where('isCurrent', true))
            ->orderBy('name')
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
            'versions_id' => $version->id
        ]));

        return to_route('state.index')
            ->with('message', 'Отдел успешно добавлен');
    }

    public function destroy($id)
    {
        $department = Department::findOrFail($id);
        $department->delete();

        return redirect()->back();
    }
}
