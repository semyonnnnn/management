<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Department;
use App\Models\Version;
use App\Http\Requests\StatePageRequest; // Swapped to use your new request validator

class StatePageController extends Controller
{
    public function index()
    {
        $currentVersion = Version::query()->where('isCurrent', true)->first();
        $currentVersionId = $currentVersion?->id;

        // FIXED: Added 'okud' to the fetched columns list so the frontend table can read it
        $state = Department::query()->where('version_id', $currentVersionId)
            ->orderBy('id', 'asc')
            ->get(['id', 'territory', 'name', 'state', 'code', 'okud']);

        // MAGIC: Fetch the versions so the dropdown actually has data to map over!
        $versions = Version::query()->orderBy('name', 'asc')->get(['id', 'name']);

        return Inertia::render('State/Index', [
            'state' => $state->isNotEmpty() ? $state : null,
            'versions' => $versions // <--- Passing it to the frontend props
        ]);
    }

    public function create(StatePageRequest $r)
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

    // ADDED: Handles the PUT state route updates from the inline inputs
    public function update(StatePageRequest $r, int $id)
    {
        // dd($r->all());
        $department = Department::findOrFail($id);
        $department->update($r->validated());

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