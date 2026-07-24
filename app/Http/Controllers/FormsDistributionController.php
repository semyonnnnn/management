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

    public function create(FormDistributionRequest $r)
    {
        $data = $r->validated();

        DB::transaction(function () use ($data) {
            $form = Form::create([
                'name' => $data['name'],
            ]);

            $form->departments()->sync($data['departments']);
        });

        return redirect()->back();
    }


    //FormDistributionRequest
    public function update(FormDistributionRequest $r)
    {
        $data = $r->validated();
        $form = Form::findOrFail($r->input('id'));

        DB::transaction(function () use ($form, $data) {
            // 1. Обновляем базовые поля формы
            $form->update([
                'name' => $data['name'],
                'indicators' => $data['indicators'] ?? 0,
                'reports' => $data['reports'] ?? 0,
                'coeff' => $data['coeff'] ?? '1.0',
            ]);

            // 2. Обрабатываем каждое ведомство и обновляем поле okveds в таблице departments напрямую
            foreach ($data['departments'] ?? [] as $departmentItem) {
                $departmentId = $departmentItem['department_id'];
                $okveds = $departmentItem['okveds'] ?? '';

                \App\Models\Department::where('id', $departmentId)->update([
                    'okveds' => $okveds,
                ]);
            }

            // 3. Синхронизируем только чистые ID ведомств для связи с формой
            $departmentIds = collect($data['departments'] ?? [])->pluck('department_id')->toArray();
            $form->departments()->sync($departmentIds);
        });

        return redirect()->back();
    }
}