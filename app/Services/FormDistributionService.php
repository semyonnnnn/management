<?php

namespace App\Services;

use App\Models\Form;
use App\Models\Department;
use App\Models\DepartmentForm;
use App\Models\SyncLogs;
use Illuminate\Support\Facades\DB;

class FormDistributionService
{
    public function index(string $search, string $territory): array
    {
        $departments = Department::all();

        $formsQuery = Form::query()
            ->with(['departments' => fn($q) => $q->withPivot('okveds')])
            ->whereHas('departments', function ($q) use ($territory) {
                $q->whereNotNull('department_form.okveds')
                    ->where('department_form.okveds', '!=', '');

                if ($territory !== 'all') {
                    $q->where(DB::raw('LOWER(TRIM(territory))'), $territory);
                }
            });

        if ($search !== '') {
            $formsQuery->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhereHas('departments', fn($subQ) => $subQ->where('name', 'like', "%{$search}%"));
            });
        }

        $forms = $formsQuery->paginate(15)->withQueryString();
        $links = $forms->linkCollection()->toArray();

        $forms->through(fn($form) => [
            'id' => $form->id,
            'okud' => $form->okud,
            'name' => $form->name,
            'departments' => $form->departments->map(fn($d) => [
                'id' => $d->id,
                'name' => $d->name,
                'code' => $d->code,
                'territory' => $d->territory,
                'okveds' => $d->pivot->okveds ?? null,
            ]),
            'okveds' => $form->departments->pluck('pivot.okveds')->filter()->implode(', '),
        ]);

        return [
            'forms' => $forms,
            'departments' => $departments,
            'links' => $links,
            'isEmpty' => DepartmentForm::doesntExist(),
            'filters' => [
                'search' => $search,
                'territory' => $territory,
            ],
            'timestamp' => SyncLogs::value('synced_when') ?? 'пусто',
        ];
    }
}