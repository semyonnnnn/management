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

        // 3. Concatenate and force strict uniqueness using keyBy()
        $res = $ekbRes->concat($krgRes)->keyBy(function ($item) {
            return $item['form_id'] . '_' . $item['department_id'];
        })->values();

        // 4. Use insertOrIgnore in safe chunks to silently bypass existing database duplicates
        $res->chunk(100)->each(function ($chunk) {
            DepartmentForm::insertOrIgnore($chunk->values()->toArray());
        });

        // 5. Deletion Part: Remove local records that no longer exist in the fresh remote snapshot
        // We extract all valid composite keys present in the current sync payload
        $validKeys = $res->map(function ($item) {
            return $item['form_id'] . '-' . $item['department_id'];
        });

        // Fetch all current local relations and prune any that aren't in the valid payload
        DepartmentForm::all()->each(function ($departmentForm) use ($validKeys) {
            $currentKey = $departmentForm->form_id . '-' . $departmentForm->department_id;

            if (!$validKeys->contains($currentKey)) {
                $departmentForm->delete();
            }
        });

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