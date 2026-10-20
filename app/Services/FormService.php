<?php

namespace App\Services;

use App\Models\Form;
use App\Enum\PeriodEnum;
use App\Models\SyncLogs;

class FormService
{
    public function index(string $search, string $territory): array
    {

        $isEmpty = !Form::exists();
        $forms = Form::query()
            ->filterTerritory($territory)
            ->search($search)
            ->paginate(20)
            ->withQueryString();

        $forms->through(fn($form) => [
            'id' => $form->id,
            'okud' => $form->okud,
            'name' => $form->name,
            'period' => $form->period,
            'indicators' => (int) $form->indicators,
            'k1' => (float) $form->k1,
            'k2' => (float) $form->k2,
            'k3' => (float) $form->k3,
            'k4' => (float) $form->k4,
            'k5' => (float) $form->k5,
            'k6' => (float) $form->k6,
            'reports_count' => (int) $form->reports_count,
            'is_consolidated' => (bool) $form->is_consolidated,
            'departments' => $form->departments()->get()->map(function ($department) {
                return [
                    'name' => $department->name,
                    'code' => $department->code,
                    'territory' => $department->territory,
                ];
            }),
            'created_at' => $form->created_at,
            'updated_at' => $form->updated_at,
        ]);


        $data = [
            'forms' => $forms,
            'filters' => [
                'search' => $search,
                'territory' => $territory,
            ],
            'periods' => PeriodEnum::values(),
            'isEmpty' => $isEmpty,
            'timestamp' => SyncLogs::value('synced_when') ?? 'пусто'
        ];

        return $data;
    }
}