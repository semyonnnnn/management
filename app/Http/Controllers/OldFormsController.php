<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class OldFormsController extends Controller
{
    public function index(Request $request)
    {
        $currentVersion = DB::table('versions')
            ->where('isCurrent', true)
            ->first();

        if (!$currentVersion) {
            return Inertia::render('OldForms/Index', [
                'departments' => [],
                'forms' => [
                    'data' => [],
                    'links' => [],
                    'total' => 0,
                    'current_page' => 1
                ],
                'versionId' => 0,
                'filters' => ['search' => '', 'territory' => 'all']
            ]);
        }

        // Fetch departments for reference mapping
        $departments = DB::table('old_departments')
            ->where('version_id', $currentVersion->id)
            ->select('id', 'name', 'territory', 'staff', 'workload', 'state')
            ->orderBy('name', 'asc')
            ->get();

        // Fetch raw forms matching version baseline
        $forms = DB::table('old_forms')
            ->where('version_id', $currentVersion->id)
            ->select('id', 'name', 'indicators', 'reports', 'coeff', 'final', 'old_department_id')
            ->get();

        // Legacy cross-reference mappings - FIXED to use old_department_id
        $oldDepartmentIds = $forms->pluck('old_department_id')->unique()->toArray();
        $oldDepartmentsLookup = DB::table('old_departments')
            ->whereIn('id', $oldDepartmentIds)
            ->pluck('name', 'id')
            ->toArray();

        // Pre-build structural data matrix properties for absolute consistency
        $mappedForms = $forms->map(function ($form) use ($oldDepartmentsLookup, $departments) {
            // FIXED to use old_department_id
            $resolvedName = $oldDepartmentsLookup[$form->old_department_id] ?? 'unknown';
            $activeDept = $departments->firstWhere('name', $resolvedName);

            $form->resolvedDeptName = $activeDept ? $activeDept->name : 'Неизвестное ведомство';
            $form->resolvedTerritory = $activeDept ? strtolower(trim($activeDept->territory)) : 'all';
            return $form;
        });

        // Capture clean parameters
        $search = $request->input('search');
        $territory = $request->input('territory') ? strtolower(trim($request->input('territory'))) : 'all';

        // Filter matrix execution collection
        $filteredForms = $mappedForms->filter(function ($form) use ($search, $territory) {
            // 1. Territory evaluation pass
            if ($territory !== 'all' && $form->resolvedTerritory !== $territory) {
                return false;
            }

            // 2. Search criteria text processing
            if ($search) {
                $cleanSearch = mb_strtolower(trim($search), 'UTF-8');
                $matchFormName = mb_strpos(mb_strtolower($form->name, 'UTF-8'), $cleanSearch) !== false;
                $matchDeptName = mb_strpos(mb_strtolower($form->resolvedDeptName, 'UTF-8'), $cleanSearch) !== false;

                if (!$matchFormName && !$matchDeptName) {
                    return false;
                }
            }

            return true;
        })->values();

        // Build native custom LengthAwarePaginator
        $currentPage = LengthAwarePaginator::resolveCurrentPage();
        $perPage = 12;
        $currentItems = $filteredForms->slice(($currentPage - 1) * $perPage, $perPage)->values()->all();

        $paginatedForms = new LengthAwarePaginator(
            $currentItems,
            $filteredForms->count(),
            $perPage,
            $currentPage,
            [
                'path' => LengthAwarePaginator::resolveCurrentPath(),
                'query' => $request->query()
            ]
        );

        $departmentsDataProps = $departments->map(function ($dep) {
            return [
                'id' => (string)$dep->id,
                'name' => $dep->name,
                'territory' => $dep->territory,
                'staff' => (int)$dep->staff,
                'workload' => (int)$dep->workload,
                'state' => $dep->state
            ];
        })->values();

        return Inertia::render('OldForms/Index', [
            'departments' => $departmentsDataProps,
            'forms' => $paginatedForms,
            'versionId' => $currentVersion->id,
            'filters' => [
                'search' => $search ?? '',
                'territory' => $territory
            ]
        ]);
    }
}
