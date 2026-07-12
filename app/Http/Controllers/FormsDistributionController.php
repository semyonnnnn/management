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
use App\Models\Version;

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

        // Получаем ID текущей активной версии для пивот-таблицы
        $currentVersionId = Version::query()->where('isCurrent', true)->value('id');

        DB::transaction(function () use ($data, $currentVersionId) {
            // Создаем саму форму (без version_id)
            $form = Form::create([
                'name' => $data['name'],
            ]);

            // Формируем структуру для пивота department_form
            $syncData = [];
            foreach ($data['departments'] ?? [] as $dept) {
                if (!empty($dept['department_id'])) {
                    $syncData[$dept['department_id']] = ['version_id' => $currentVersionId];
                }
            }

            $form->departments()->sync($syncData);
        });

        return redirect()->back();
    }

    public function update(FormDistributionRequest $r)
    {
        $data = $r->validated();
        $form = Form::findOrFail($r->input('id'));

        // Получаем ID текущей активной версии
        $currentVersionId = Version::query()->where('isCurrent', true)->value('id');

        DB::transaction(function () use ($form, $data, $currentVersionId) {
            // 1. Обновляем базовые поля формы
            $form->update([
                'name' => $data['name'],
                'indicators' => $data['indicators'] ?? 0,
                'reports' => $data['reports'] ?? 0,
                'coeff' => $data['coeff'] ?? '1.0',
            ]);

            // 2. Собираем и синхронизируем Отделы (department_form)
            $syncDepartments = [];
            // Собираем все ОКВЭДы со всех отделов в один плоский список строк
            $allOkvedCodes = [];

            foreach ($data['departments'] ?? [] as $dept) {
                if (!empty($dept['department_id'])) {
                    $syncDepartments[$dept['department_id']] = ['version_id' => $currentVersionId];

                    if (!empty($dept['okveds']) && is_array($dept['okveds'])) {
                        $allOkvedCodes = array_merge($allOkvedCodes, $dept['okveds']);
                    }
                }
            }
            // Синхронизируем связь с отделами
            $form->departments()->sync($syncDepartments);

            // 3. Собираем и синхронизируем ОКВЭДы (form_okved)
            $syncOkveds = [];
            $allOkvedCodes = array_unique($allOkvedCodes);

            if (!empty($allOkvedCodes)) {
                // Ищем ID кодов ОКВЭД по их строковому значению (предполагаем, что колонка называется 'code')
                // Если ваша колонка называется иначе (например, 'name' или 'value'), замените 'code' ниже:
                $okvedIds = DB::table('okveds')
                    ->whereIn('code', $allOkvedCodes)
                    ->pluck('id')
                    ->toArray();

                foreach ($okvedIds as $okvedId) {
                    $syncOkveds[$okvedId] = ['version_id' => $currentVersionId];
                }
            }

            // Нам нужен метод связи okveds() в модели Form. 
            // Он должен быть объявлен как: return $this->belongsToMany(Okved::class, 'form_okved');
            $form->okveds()->sync($syncOkveds);
        });

        return redirect()->back();
    }
}