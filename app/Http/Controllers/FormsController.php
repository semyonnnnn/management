<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Services\FormService;
use App\Http\Requests\FormCreateRequest;
use App\Models\Form;

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
            ]
        ]));
    }

    public function create(FormCreateRequest $r)
    {
        $data = $r->validated();

        $form = Form::create([
            'name' => (string) $data['name'],
            'okud' => (int) $data['okud'],
            'total' => (int) $data['total'],
            'indicators' => (int) $data['indicators'],
            'reports' => (int) $data['reports'],
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

    public function update(FormRequest $r)
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
                    'name' => $formData['name'],
                    'total' => $formData['total'] ?? 0,
                    'indicators' => $formData['indicators'] ?? 0,
                    'reports' => $formData['reports'],
                    'k1' => $formData['k1'],
                    'k2' => $formData['k2'],
                    'k3' => $formData['k3'],
                    'k4' => $formData['k4'],
                    'k5' => $formData['k5'],
                    'k6' => $formData['k6'],
                    'is_consolidated' => $formData['is_consolidated'] ?? false,
                ]);

                // Clean up and sync department relationships for this specific form
                $departmentIds = collect($formData['departments'] ?? [])
                    ->pluck('department_id')
                    ->filter()
                    ->toArray();

                $form->departments()->sync($departmentIds);
            }
        });

        return redirect()->back();
    }
}
