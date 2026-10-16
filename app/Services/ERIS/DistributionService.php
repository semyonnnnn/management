<?php

namespace App\Services\ERIS;

use App\Models\ERIS\Ekb\Ekb_Distr;
use App\Models\ERIS\Krg\Krg_Distr;
use App\Models\Form;

class DistributionService
{
    public function sync()
    {
        $ekbRes = $this->getRes();
        $krgRes = $this->getRes('к');

        dd($ekbRes);
    }

    private function getRes(string $suffix = '')
    {
        $res = Krg_Distr::all()->map(function ($item) use ($suffix) {
            // Query properly by index/column, then retrieve the first model instance
            $form = Form::where('okud', $item['okud'])->first();

            return [
                // Safely grab the id property, or null if no form was found
                'form_id' => $form ? $form->id : null,
                'department_id' => $item['Otdel_kod'] + $suffix
            ];
        });

        return $res;
    }
}