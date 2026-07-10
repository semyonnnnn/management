<?php

namespace App\Services;

use App\Models\Form;
use App\Models\Version;
use App\Models\Department;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class FormService
{
    public function index(string $search, string $territory): array
    {
        $currentVersion = Version::query()->where('isCurrent', true)->first();

        if (!$currentVersion) {
            return [
                'departments' => [],
                'forms' => new LengthAwarePaginator([], 0, 12),
                'versionId' => 0,
            ];
        }

        $formsQuery = Form::query()->with('departments')->where('version_id', $currentVersion->id);

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
            'indicators' => (int)$form->indicators,
            'reports' => (int)$form->reports,
            'coeff' => $form->coeff,
            'final' => (int)$form->final,
            'resolvedDeptName' => $form->departments->first()?->name ?? 'Неизвестное ведомство',
            'resolvedTerritory' => strtolower(trim($form->departments->first()?->territory ?? 'all')),
            'department_ids' => $form->departments->pluck('id')->values(),
        ]);

        $departments = Department::query()->where('version_id', $currentVersion->id)
            ->orderBy('name', 'asc')
            ->get()
            ->map(fn($dep) => [
                'id' => (string)$dep->id,
                'name' => $dep->name,
                'territory' => $dep->territory,
                'staff' => (int)$dep->staff,
                'workload' => (int)$dep->workload,
                'state' => $dep->state
            ]);

        return [
            'departments' => $departments,
            'forms' => $forms,
            'versionId' => $currentVersion->id,
        ];
    }
}
