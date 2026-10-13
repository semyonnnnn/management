<?php

namespace App\Services;

use App\Models\ERIS\Ekb_Users;
use App\Models\ERIS\Krg_Users;
use App\Repositories\DepartmentRepository;

class DepartmentSyncService
{
    private array $krg_in_ekb_kodes = [20, 7, 9];
    private DepartmentRepository $departmentRepository;

    public function __construct(DepartmentRepository $departmentRepository)
    {
        $this->departmentRepository = $departmentRepository;
    }

    public function sync(): int
    {
        // Gather and map genuine Ekb records
        $deps_Ekb = Ekb_Users::whereNotIn('Kod', $this->krg_in_ekb_kodes)->get()->map(function ($item) {
            return [
                'name' => $item->Otdel ?? '',
                'code' => $item->Kod,
                'territory' => 'ekb',
                'state' => $item->cnt_shtat ?? 0,
            ];
        });

        // Gather and map cross-over Ekb records belonging to Krg
        $krg_in_ekb = Ekb_Users::whereIn('Kod', $this->krg_in_ekb_kodes)->get()->map(function ($item) {
            return [
                'name' => $item->Otdel ?? '',
                'code' => $item->Kod,
                'territory' => 'krg',
                'state' => $item->cnt_shtat ?? 0,
            ];
        });

        // Gather and map genuine Krg records
        $deps_Krg = Krg_Users::all()->map(function ($item) {
            return [
                'name' => $item->Otdel ?? '',
                'code' => $item->Kod,
                'territory' => 'krg',
                'state' => $item->cnt_shtat ?? 0,
            ];
        });

        // Amalgamate all collections
        $allDepartments = $deps_Ekb->concat($deps_Krg)->concat($krg_in_ekb);

        // Delegate persistence to the repository
        $this->departmentRepository->upsertBatch($allDepartments);

        return $allDepartments->count();
    }
}