<?php

namespace App\Http\Controllers;

use App\Services\ERIS\DepartmentSyncService;
use App\Services\ERIS\FormSyncService;
use App\Services\ERIS\DistributionService;

class SyncController extends Controller
{
    public function index(
        DepartmentSyncService $depSyncService,
        FormSyncService $formSyncService,
        DistributionService $distributionService
    ) {

        // $distributionService->sync();
        $depSyncService->sync();
        $formSyncService->sync();

        return back()->with(
            'success',
            'Базы успешно синхронизированы.'
        );
    }
}