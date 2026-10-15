<?php

namespace App\Http\Controllers;

use App\Services\DepartmentSyncService;
use App\Models\ERIS\Ekb\Ekb_Forms;
use App\Models\Form;

class SyncController extends Controller
{
    public function index(DepartmentSyncService $depSyncService)
    {
        $ekb_form_array = Ekb_Forms::distinct()->pluck('okud')->toArray();
        $local_forms = Form::distinct()->pluck('okud')->toArray();

        // 1. Values present in $ekb_form_array but MISSING in $local_forms
        $only_in_ekb = array_diff($ekb_form_array, $local_forms);

        // 2. Values present in $local_forms but MISSING in $ekb_form_array
        $only_in_local = array_diff($local_forms, $ekb_form_array);

        // 3. Values common to both arrays
        $common_values = array_intersect($ekb_form_array, $local_forms);

        dd([
            'Only in EKB' => $only_in_ekb,
            'Only in Local' => $only_in_local,
            'Common' => $common_values,
        ]);

        $depSyncService->sync();

        return back()->with(
            'success',
            'Базы успешно синхронизированы.'
        );
    }
}