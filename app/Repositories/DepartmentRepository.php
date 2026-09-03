<?php

// app/Repositories/DepartmentRepository.php
namespace App\Repositories;

use App\Models\Department;

class DepartmentRepository
{
    public function upsertMany(array $rows): int
    {
        Department::upsert(
            $rows,
            uniqueBy: ['code'],
            update: ['name', 'territory', 'state']
        );

        return count($rows);
    }
}