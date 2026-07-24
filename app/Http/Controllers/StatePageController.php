<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
/////////////////////////////////
use App\Models\Department;
use App\Models\Schedule;
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
            'date' => Schedule::first()->date ?? null,
        ]);
    }

    public function create(StateCreateRequest $r)
    {
        Department::create(array_merge($r->validated(), [
            'state_updated_at' => now(),
        ]));

        if (!Schedule::exists()) {
            Schedule::create(
                ['date' => now()]
            );
        }

        return to_route('state.index')
            ->with('message', 'Отдел успешно добавлен');
    }

    // ADDED: Handles the PUT state route updates from the inline inputs
    //StateUpdateRequest
    public function update(StateUpdateRequest $r)
    {
        // Step 1: Get raw validated data
        $validated = $r->validated();

        // Step 2: Extract IDs
        $ids = array_column($validated['departments'], 'id');

        // Step 3: Query & Key by ID
        $departments = Department::whereIn('id', $ids)->get()->keyBy('id');

        // Step 4: Loop, Match, and Save
        foreach ($validated['departments'] as $item) {
            if ($dept = $departments->get($item['id'])) {
                $updatedData = $item;

                if ($item['state'] != $dept['state']) {
                    $updatedData['state_updated_at'] = now();
                }
                $dept->update($updatedData);
            }
        }

        if ($validated['date']) {
            Schedule::first()->update([
                'date' => $validated['date']
            ]);
        }

        return redirect()->back()->with('success', 'Данные успешно обновлены');
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
