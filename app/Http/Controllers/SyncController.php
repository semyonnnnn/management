<?php

namespace App\Http\Controllers;

use App\Services\ERIS\DepartmentSyncService;
use App\Models\ERIS\Ekb\Ekb_Forms;
use App\Models\ERIS\Krg\Krg_Forms;

class SyncController extends Controller
{
    public function index(DepartmentSyncService $depSyncService)
    {
        $anchorEkb = Ekb_Forms::latest('DateStampUpd')->value('DateStampUpd');
        $anchorKrg = Krg_Forms::latest('DateStampUpd')->value('DateStampUpd');

        // Find the latest (maximum) date between the two
        $anchor = collect([$anchorEkb, $anchorKrg])->filter()->max();
        dd($anchor);

        $depSyncService->sync();

        return back()->with(
            'success',
            'Базы успешно синхронизированы.'
        );
    }
}