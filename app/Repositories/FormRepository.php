<?php

namespace App\Repositories;

use App\Models\Form;

class FormRepository
{
    public function upsertMany(array $rows): int
    {
        Form::upsert(
            $rows,
            uniqueBy: ['id'],
            update: ['okud', 'name', 'period', 'indicators', 'k1', 'k2', 'k3', 'k4', 'k5', 'k6', 'is_consolidated']
        );

        return count($rows);
    }
}