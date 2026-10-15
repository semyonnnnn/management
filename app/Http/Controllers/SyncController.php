<?php

namespace App\Http\Controllers;

use App\Services\DepartmentSyncService;
use App\Models\ERIS\Ekb_Forms;

class SyncController extends Controller
{
    public function index(DepartmentSyncService $depSyncService)
    {
        $depSyncService->sync();

        return back()->with(
            'success',
            'Базы успешно синхронизированы.'
        );
    }
}