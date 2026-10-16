<?php

namespace App\Http\Controllers;

use App\Services\ERIS\DepartmentSyncService;
use App\Services\ERIS\FormSyncService;

class SyncController extends Controller
{
    public function index(DepartmentSyncService $depSyncService, FormSyncService $formSyncService)
    {

        $depSyncService->sync();
        $formSyncService->sync();

        return back()->with(
            'success',
            'Базы успешно синхронизированы.'
        );
    }
}