<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
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
    //StateUpdateRequest
    public function update(StateUpdateRequest $r)
    {
        // Step 1: Get raw validated data
        $data = $r->validated()['departments'];

        // Step 2: Extract IDs
        $ids = array_column($data, 'id');

        // Step 3: Query & Key by ID
        $departments = Department::whereIn('id', $ids)->get()->keyBy('id');

        // Step 4: Loop, Match, and Save
        foreach ($data as $item) {
            if ($dept = $departments->get($item['id'])) {
                $dept->update($item);
            }
        }

        return redirect()->back()->with('success', 'Данные успешно обновлены');
    }

    public function delete(int $id)
    {
        $department = Department::findOrFail($id);
        $department->delete();

        return redirect()->back();
    }
}
