<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
/////////////////////////////////
use App\Models\Department;
use App\Models\Version;
use App\Http\Requests\StateCreateRequest;
use App\Http\Requests\StateUpdateRequest;

class StatePageController extends Controller
{
    public function index()
    {
        $currentVersionId = Version::query()->where('isCurrent', true)->first()?->id;

        $departments = Department::query()->where('version_id', $currentVersionId)
            ->orderBy('id', 'asc')
            ->get(['id', 'territory', 'name', 'state', 'code']);

        // MAGIC: Fetch the versions so the dropdown actually has data to map over!
        $versions = Version::query()->orderBy('name', 'asc')->get(['id', 'name']);

        return Inertia::render('State/Index', [
            'departments' => $departments->isNotEmpty() ? $departments : null,
            'versions' => $versions
        ]);
    }

    public function create(StateCreateRequest $r)
    {
        $currentVersionId = Version::query()->where('isCurrent', true)->first()?->id;

        Department::create(array_merge($r->validated(), [
            'version_id' => $currentVersionId
        ]));

        return to_route('state.index')
            ->with('message', 'Отдел успешно добавлен');
    }

    // ADDED: Handles the PUT state route updates from the inline inputs
    public function update(StateUpdateRequest $r)
    {
        $r_ids = array_column($r->validated()['items'], 'id');

        // dd($r->all());
        // $department = Department::findOrFail($id);
        // $department->update($r->validated());

        $departments = Department::whereIn('id', $r_ids)->get();
        dd($departments);

        return redirect()->back()
            ->with('message', 'Данные успешно обновлены');
    }

    public function delete(int $id)
    {
        $department = Department::findOrFail($id);
        $department->delete();

        return redirect()->back();
    }
}
