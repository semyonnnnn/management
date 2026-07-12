<?php

namespace App\Services;

use App\Models\Form;
use App\Models\Version;
use App\Models\Department;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class FormDistributionService
{
    public function index(string $search, string $territory): array
    {
        $departments = Department::all();
        $currentVersion = Version::query()->where('isCurrent', true)->first();

        if (!$currentVersion) {
            return [
                'forms' => new LengthAwarePaginator([], 0, 12),
                'departments' => $departments,
            ];
        }

        $formsQuery = Form::query()
            ->with(['departments', 'okveds'])
            ->where('version_id', $currentVersion->id);

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

        $forms = $formsQuery->paginate(12)->withQueryString();

        $forms->through(fn($form) => [
            'id' => $form->id,
            'name' => $form->name,
            'indicators' => (int) $form->indicators,
            'reports' => (int) $form->reports,
            'coeff' => $form->coeff,
            'version_id' => $form->version_id,
            'resolvedTerritory' => $form->departments->first()?->territory ?? 'all',
            'departments' => $form->departments->map(fn($d) => ['id' => $d->id, 'name' => $d->name]),
            'okveds' => $form->okveds->map(fn($o) => ['id' => $o->id, 'code' => $o->code]),
        ]);

        return ['forms' => $forms, 'departments' => $departments];
    }
}