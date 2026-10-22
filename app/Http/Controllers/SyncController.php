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

        $depSyncService->sync();
        $formSyncService->sync();
        $distributionService->sync();

        return back()->with(
            'success',
            'Базы успешно синхронизированы.'
        );
    }
}