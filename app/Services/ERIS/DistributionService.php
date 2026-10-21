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

        $ekbDistr = Ekb_Distr::all();
        $krgDistr = Krg_Distr::all();

        $krgInEkbKodes = $this->departmentSyncService->getKrgInEkbKodes();

        // 1. Map Ekb records dynamically using a closure for the suffix
        $ekbRes = $this->getOkveds($ekbDistr, $formMap, function ($item) use ($krgInEkbKodes) {
            return in_array($item['Otdel_kod'], $krgInEkbKodes) ? 'ке' : '';
        }, $depMap);

        // 2. Map Krg records using a static string suffix
        $krgRes = $this->getOkveds($krgDistr, $formMap, 'к', $depMap);

        // 3. Concatenate and force strict uniqueness using keyBy()
        $res = $ekbRes->concat($krgRes)->keyBy(function ($item) {
            return $item['form_id'] . '_' . $item['department_id'];
        })->values();


        // 4. Use insertOrIgnore in safe chunks to silently bypass existing database duplicates
        $res->chunk(100)->each(function ($chunk) {
            $now = now();

            $payload = $chunk->map(function ($item) use ($now) {
                return array_merge($item, [
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            })->values()->toArray();

            DepartmentForm::insertOrIgnore($payload);
        });

        // 5. Deletion Part: Remove local records that no longer exist in the fresh remote snapshot
        $validKeys = $res->map(function ($item) {
            return $item['form_id'] . '-' . $item['department_id'];
        });

        DepartmentForm::all()->each(function ($departmentForm) use ($validKeys) {
            $currentKey = $departmentForm->form_id . '-' . $departmentForm->department_id;

            if (!$validKeys->contains($currentKey)) {
                $departmentForm->delete();
            }
        });

        return $res;
    }

    private function getOkveds($remoteCollection, $formMap, string|callable $suffixResolver, $depMap)
    {
        return $remoteCollection->map(function ($item) use ($suffixResolver, $formMap, $depMap) {
            $form_id = $formMap->get(trim($item['okud'] ?? ''));

            $suffix = is_callable($suffixResolver)
                ? $suffixResolver($item)
                : $suffixResolver;

            $dep_id = $depMap->get($item['Otdel_kod'] . $suffix);

            return [
                'form_id' => $form_id,
                'department_id' => $dep_id,
                'okveds' => $item['okved2list'] ?? null,
            ];
        })->filter(function ($item) {
            return !is_null($item['form_id'])
                && !is_null($item['department_id'])
                && $item['okveds'] !== '';
        });
    }
}