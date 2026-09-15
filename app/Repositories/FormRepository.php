<?php

namespace App\Repositories;

use App\Models\Form;

class FormRepository
{
    public function upsertMany(array $rows): int
    {
        Form::upsert(
            $rows,
            uniqueBy: ['okud', 'period'],
            update: ['okud', 'name', 'period', 'indicators', 'k1', 'k2', 'k3', 'k4', 'k5', 'k6', 'reports_count', 'is_consolidated']
        );

        return count($rows);
    }
}