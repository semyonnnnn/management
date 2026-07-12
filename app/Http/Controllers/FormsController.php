<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Services\FormService;
use App\Http\Requests\FormRequest;
use App\Models\Form;
use App\Models\Version;

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

    public function create(FormRequest $r)
    {
        $data = $r->validated();
        $currentVersionId = Version::query()->where('isCurrent', true)->firstOrFail()->id;

        $form = Form::create([
            'name' => $data['name'],
            'total' => $data['total'] ?? 0,
            'indicators' => $data['indicators'] ?? 0,
            'reports' => $data['reports'],
            'k1' => $data['k1'] ?? 1.0,
            'k2' => $data['k2'] ?? 1.0,
            'k3' => $data['k3'] ?? 1.0,
            'k4' => $data['k4'] ?? 1.0,
            'k5' => $data['k5'] ?? 1.0,
            'k6' => $data['k6'] ?? 1.0,
            'is_consolidated' => $data['is_consolidated'] ?? false,
            'version_id' => $currentVersionId,
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
        $data = $r->validated();
        $form = Form::findOrFail($r->input('id'));

        DB::transaction(function () use ($form, $data) {
            $form->update([
                'name' => $data['name'],
                'total' => $data['total'] ?? 0,
                'indicators' => $data['indicators'] ?? 0,
                'reports' => $data['reports'],
                'k1' => $data['k1'] ?? 1.0,
                'k2' => $data['k2'] ?? 1.0,
                'k3' => $data['k3'] ?? 1.0,
                'k4' => $data['k4'] ?? 1.0,
                'k5' => $data['k5'] ?? 1.0,
                'k6' => $data['k6'] ?? 1.0,
                'is_consolidated' => $data['is_consolidated'] ?? false,
                'version_id' => $data['version_id'],
            ]);

            $departmentIds = collect($data['departments'] ?? [])
                ->pluck('department_id')
                ->filter()
                ->toArray();

            $form->departments()->sync($departmentIds);
        });

        return redirect()->back();
    }
}