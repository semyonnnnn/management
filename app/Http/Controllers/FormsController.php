<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Form;
use App\Models\Version;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class FormsController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function index(Request $request): Response
    {
        /** @var Version|null $currentVersion */
        $currentVersion = Version::query()->where('isCurrent', true)->first();

        // If no version exists, safely return empty states matching the expected types
        if (!$currentVersion) {
            return Inertia::render('Forms/Index', [
                'departments' => [],
                'forms' => new LengthAwarePaginator([], 0, 12), // Guarantees identical payload structure for frontend
                'versionId' => 0,
                'filters' => [
                    'search' => '',
                    'territory' => 'all'
                ]
            ]);
        }

        $search = (string)$request->input('search', '');
        $territory = $request->input('territory') ? strtolower(trim((string)$request->input('territory'))) : 'all';

        /** @var Builder|\Illuminate\Contracts\Database\Eloquent\Builder $formsQuery */
        $formsQuery = Form::query()->with('department')->where('version_id', $currentVersion->id);

        if ($territory !== 'all') {
            $formsQuery->whereHas('department', function ($query) use ($territory) {
                /** @var Builder $query */
                $query->where(DB::raw('LOWER(TRIM(territory))'), $territory);
            });
        }

        if ($search !== '') {
            $formsQuery->where(function ($query) use ($search) {
                /** @var Builder $query */
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhereHas('department', function ($subQuery) use ($search) {
                        /** @var Builder $subQuery */
                        $subQuery->where('name', 'like', '%' . $search . '%');
                    });
            });
        }

        /** @var LengthAwarePaginator $paginatedForms */
        $paginatedForms = $formsQuery->paginate(12)->withQueryString();

        // If forms table is empty, this closure simply won't run, which is perfectly safe
        $paginatedForms->through(function (Form $form): array {
            return [
                'id' => $form->id,
                'name' => $form->name,
                'indicators' => (int)$form->indicators,
                'reports' => (int)$form->reports,
                'coeff' => $form->coeff,
                'final' => (int)$form->final,
                'department_id' => $form->department_id,
                'resolvedDeptName' => $form->department ? $form->department->name : 'Неизвестное ведомство',
                'resolvedTerritory' => $form->department ? strtolower(trim($form->department->territory)) : 'all',
            ];
        });

        $departmentsDataProps = Department::query()->where('version_id', $currentVersion->id)
            ->orderBy('name', 'asc')
            ->get(['id', 'code', 'name', 'territory', 'state'])
            ->map(function (Department $dep): array {
                return [
                    'id' => (string)$dep->id,
                    'name' => $dep->name,
                    'territory' => $dep->territory,
                    'staff' => (int)$dep->staff,
                    'workload' => (int)$dep->workload,
                    'state' => $dep->state
                ];
            });

        return Inertia::render('Forms/Index', [
            'departments' => $departmentsDataProps,
            'forms' => $paginatedForms,
            'versionId' => $currentVersion->id,
            'filters' => [
                'search' => $search,
                'territory' => $territory
            ]
        ]);
    }
}
