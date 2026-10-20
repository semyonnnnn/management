<?php

namespace App\Services;

use App\Models\Form;
use App\Models\Department;
use Illuminate\Support\Facades\DB;
use App\Models\SyncLogs;

class FormDistributionService
{
    public function index(string $search, string $territory): array
    {
        $departments = Department::all();

        $formsQuery = Form::query()
            ->with(['departments']);

        if ($territory !== 'all') {
            $formsQuery->whereHas('departments', function ($query) use ($territory) {
                $query->where(DB::raw('LOWER(TRIM(territory))'), $territory);
            });
        }

        if ($search !== '') {
            $formsQuery->where(function ($query) use ($search) {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhereHas('departments', function ($subQuery) use ($search) {
                        $subQuery->where('name', 'like', '%' . $search . '%');
                    });
            });
        }

        $forms = $formsQuery->paginate(15)->withQueryString();
        $links = $forms->linkCollection()->toArray();

        $forms->through(fn($form) => [
            'id' => $form->id,
            'okud' => $form->okud,
            'name' => $form->name,
            'departments' => $form->departments->map(fn($d) => ['id' => $d->id, 'name' => $d->name, 'code' => $d->code, 'territory' => $d->territory, 'okveds' => $d->okveds,]),
        ]);

        $isEmpty = Form::doesntExist();

        return [
            'forms' => $forms,
            'departments' => $departments,
            'links' => $links,
            'isEmpty' => $isEmpty,
            'filters' => [
                'search' => $search,
                'territory' => $territory
            ],
            'timestamp' => SyncLogs::value('synced_when') ?? 'пусто'
        ];
    }
}