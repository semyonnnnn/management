<?php

namespace App\Services\ERIS;

use App\Models\Department;
use App\Models\ERIS\Ekb\Ekb_Distr;
use App\Models\ERIS\Krg\Krg_Distr;
use App\Models\Form;
use App\Models\DepartmentForm;

class DistributionService
{
    private DepartmentSyncService $departmentSyncService;

    public function __construct(DepartmentSyncService $departmentSyncService)
    {
        $this->departmentSyncService = $departmentSyncService;
    }

    public function sync()
    {
        $formMap = Form::pluck('id', 'okud');
        $depMap = Department::pluck('id', 'code');

        $krgInEkbKodes = $this->departmentSyncService->getKrgInEkbKodes();

        // 1. Map Ekb records dynamically using a closure for the suffix
        $ekbRes = $this->getRes(Ekb_Distr::all(), $formMap, function ($item) use ($krgInEkbKodes) {
            return in_array($item['Otdel_kod'], $krgInEkbKodes) ? 'ке' : '';
        }, $depMap);

        // 2. Map Krg records using a static string suffix
        $krgRes = $this->getRes(Krg_Distr::all(), $formMap, 'к', $depMap);

        $res = $ekbRes->concat($krgRes);

        DepartmentForm::upsert(
            $res->toArray(),
            ['form_id', 'department_id'],
            []
        );

        return $res;
    }

    private function getRes($remoteCollection, $formMap, string|callable $suffixResolver, $depMap)
    {
        return $remoteCollection->map(function ($item) use ($suffixResolver, $formMap, $depMap) {
            $form_id = $formMap->get(trim($item['okud'] ?? ''));

            // Resolve whether the suffix is a static string or requires dynamic evaluation
            $suffix = is_callable($suffixResolver)
                ? $suffixResolver($item)
                : $suffixResolver;

            $dep_id = $depMap->get($item['Otdel_kod'] . $suffix);

            return [
                'form_id' => $form_id,
                'department_id' => $dep_id
            ];
        })->filter(function ($item) {
            // Drop any rows lacking essential foreign key relationships
            return !is_null($item['form_id']) && !is_null($item['department_id']);
        });
    }
}