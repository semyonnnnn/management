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

            // Collect IDs and flatten OKVEDs directly
            $departmentIds = collect($data['departments'])->pluck('department_id')->toArray();
            $allOkvedCodes = collect($data['departments'])->pluck('okveds')->flatten()->unique()->toArray();

            // Sync departments without extra pivot data
            $form->departments()->sync($departmentIds);

            // Sync OKVEDs (assuming a similar relationship exists)
            $form->okveds()->sync($allOkvedCodes);

            // 3. Собираем и синхронизируем ОКВЭДы (form_okved)
            $syncOkveds = [];
            $allOkvedCodes = array_unique($allOkvedCodes);

            // Нам нужен метод связи okveds() в модели Form. 
            // Он должен быть объявлен как: return $this->belongsToMany(Okved::class, 'form_okved');
            $form->okveds()->sync($syncOkveds);
        });

        return redirect()->back();
    }
}