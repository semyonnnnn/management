<?php

namespace App\Http\Controllers;

use App\Services\ERIS\DepartmentSyncService;
use App\Services\ERIS\FormSyncService;
use App\Services\ERIS\DistributionService;

class SyncController extends Controller
{
    public function index(
        FormSyncService $formSyncService,
        DepartmentSyncService $depSyncService,
        DistributionService $distributionService
    ) {
        //todo! move distr to bottom

        $distributionService->sync();
        $depSyncService->sync();
        $formSyncService->sync();

        return back()->with(
            'success',
            'Базы успешно синхронизированы.'
        );
    }
}