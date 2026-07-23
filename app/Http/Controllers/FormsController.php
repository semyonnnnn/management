<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
/////////////////////////////////////////
use App\Http\Requests\FormCreateRequest;
use App\Http\Requests\FormUpdateRequest;
use App\Models\Form;
use App\Enum\PeriodEnum;
use App\Services\FormService;

class FormsController extends Controller
{
    public function index(Request $request, FormService $formService): Response
    {
        $search = (string) $request->input('search', '');
        $territory = $request->input('territory') ? strtolower(trim((string) $request->input('territory'))) : 'all';

        $data = $formService->index($search, $territory);

        return Inertia::render('Forms/Index', array_merge($data, [
            'filters' => [
                'search' => $search,
                'territory' => $territory
            ],
            'periods' => PeriodEnum::values()
        ]));
    }

    public function create(FormCreateRequest $r)
    {
        $data = $r->validated();

        $form = Form::create([
            'okud' => (int) $data['okud'],
            'name' => (string) $data['name'],
            'period' => (string) $data['period'],
            'indicators' => (int) $data['indicators'],
            'k1' => (float) $data['k1'],
            'k2' => (float) $data['k2'],
            'k3' => (float) $data['k3'],
            'k4' => (float) $data['k4'],
            'k5' => (float) $data['k5'],
            'k6' => (float) $data['k6'],
            'is_consolidated' => (bool) ($data['is_consolidated'] ?? false),
        ]);

        $departmentIds = collect($data['departments'] ?? [])
            ->pluck('department_id')
            ->filter()
            ->toArray();

        $form->departments()->sync($departmentIds);

        return redirect()->back();
    }

    //FormUpdateRequest
    public function update(FormUpdateRequest $r)
    {
        // 1. Get the validated nested data structure
        $validated = $r->validated();

        // 2. Wrap everything in a single transaction to update all forms together safely
        DB::transaction(function () use ($validated) {
            // Loop through each individual form array in the request
            foreach ($validated['forms'] as $formData) {

                // Find the specific form using the ID inside the current loop element
                $form = Form::findOrFail($formData['id']);

                $form->update([
                    'okud' => (int) $formData['okud'],
                    'name' => (string) $formData['name'],
                    'period' => (string) $formData['period'],
                    'indicators' => (int) $formData['indicators'],
                    'k1' => (float) $formData['k1'],
                    'k2' => (float) $formData['k2'],
                    'k3' => (float) $formData['k3'],
                    'k4' => (float) $formData['k4'],
                    'k5' => (float) $formData['k5'],
                    'k6' => (float) $formData['k6'],
                    'is_consolidated' => (bool) ($data['is_consolidated'] ?? false),
                ]);

                // Clean up and sync department relationships for this specific form
                $departmentIds = collect($formData['departments'] ?? [])
                    ->pluck('department_id')
                    ->filter()
                    ->toArray();

                $form->departments()->sync($departmentIds);
            }
        });

        return redirect()->back()->with('success', 'Данные успешно обновлены!');
    }
}
