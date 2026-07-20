<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
/////////////////////////////////
use App\Models\Department;
use App\Http\Requests\StateCreateRequest;
use App\Http\Requests\StateUpdateRequest;

class StatePageController extends Controller
{
    public function index()
    {
        $departments = Department::query()
            ->orderBy('id', 'asc')
            ->get(['id', 'territory', 'name', 'state', 'code']);

        return Inertia::render('State/Index', [
            'departments' => $departments->isNotEmpty() ? $departments : null,
        ]);
    }

    public function create(StateCreateRequest $r)
    {
        Department::create(array_merge($r->validated(), [
            'state_updated_at' => now(),
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
                $updatedData = $item;

                if ($item['state'] != $dept['state']) {
                    $updatedData['state_updated_at'] = now();
                }
                $dept->update($updatedData);
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
