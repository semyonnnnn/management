<?php

namespace App\Http\Controllers;

use App\Services\DepartmentSyncService;

class SyncController extends Controller
{
    public function index(DepartmentSyncService $syncService)
    {
        $totalSynced = $syncService->sync();

        return response()->json([
            'status' => 'success',
            'message' => 'Departments synchronized successfully.',
            'total_synced' => $totalSynced,
        ]);
    }
}