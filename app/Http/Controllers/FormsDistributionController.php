<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
//////////////////////////////
use App\Services\FormDistributionService;
use App\Http\Requests\FormDistributionRequest;
use App\Models\Form;
use App\Models\Department;

class FormsDistributionController extends Controller
{
    public function index(Request $request, FormDistributionService $formService): Response
    {
        $search = (string) $request->input('search', '');
        $territory = $request->input('territory') ? strtolower(trim((string) $request->input('territory'))) : 'all';

        $data = $formService->index($search, $territory);

        return Inertia::render('FormsDistribution/Index', array_merge($data, [
            'filters' => [
                'search' => $search,
                'territory' => $territory
            ]
        ]));
    }

    //FormDistributionRequest
    // public function create(FormDistributionRequest $r)
    // {
    //     $data = $r->validated();

    //     DB::transaction(function () use ($data) {
    //         $form = Form::create([
    //             'name' => $data['name'],
    //         ]);

    //         $form->departments()->sync($data['departments']);
    //     });

    //     return redirect()->back();
    // }


    //FormDistributionRequest
    public function update(FormDistributionRequest $r, int $id)
    {
        $validated = $r->validated();

        $form = Form::findOrFail($validated['id']);
        DB::transaction(function () use ($validated, $form) {
            // 1. Retrieve target Form instance

            $departmentsPayload = $validated['departments'] ?? [];

            // 2. Extract department IDs to sync pivot bindings
            $departmentIds = array_column($departmentsPayload, 'id');
            $form->departments()->sync($departmentIds);

            // 3. Update the 'okveds' attribute on each target Department model
            foreach ($departmentsPayload as $item) {
                // Convert empty strings explicitly to null
                $value = isset($item['value']) && $item['value'] !== '' ? $item['value'] : '';

                Department::where('id', $item['id'])->update([
                    'okveds' => $value,
                ]);
            }
        });

        return back()->with('success', "Данные в '$form->name' успешно обновлены");
    }

    public function delete(Request $r, int $id)
    {
        $r->validate([
            'department_id' => 'required|integer',
        ]);

        $form = Form::findOrFail($id);
        $formName = $form->name;

        $departmentId = $r->input('department_id');
        $department = Department::find($departmentId);
        $deptName = $department ? $department->name : 'Ведомство';

        // Detach department from the pivot table
        $form->departments()->detach($departmentId);

        return redirect()->back()->with('success', "Отдел \"{$deptName}\" успешно откреплён от формы \"{$formName}\"!");
    }
}