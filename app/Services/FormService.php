<?php

namespace App\Services;

use App\Models\Form;
// use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class FormService
{
    public function index(string $search, string $territory): array
    {

        $formsQuery = Form::query();

        if ($territory !== 'all') {
            $formsQuery->whereHas('departments', function ($query) use ($territory) {
                $query->where(DB::raw('LOWER(TRIM(territory))'), $territory);
            });
        }

        if ($search !== '') {
            $formsQuery->where(function ($query) use ($search) {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhereHas('departments', function ($subQuery) use ($search) {
                        $subQuery->where('name', 'like', '%' . $search . '%');
                    });
            });
        }

        $forms = $formsQuery->paginate(20)->withQueryString();

        $forms->through(fn($form) => [
            'id' => $form->id,
            'okud' => $form->okud,
            'name' => $form->name,
            'period' => $form->period,
            'indicators' => (int) $form->indicators,
            'k1' => (float) $form->k1,
            'k2' => (float) $form->k2,
            'k3' => (float) $form->k3,
            'k4' => (float) $form->k4,
            'k5' => (float) $form->k5,
            'k6' => (float) $form->k6,
            'is_consolidated' => (bool) $form->is_consolidated,
            'created_at' => $form->created_at,
            'updated_at' => $form->updated_at,
        ]);

        return [
            'forms' => $forms,
        ];
    }
}