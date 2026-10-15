<?php

// app/Repositories/DepartmentRepository.php
namespace App\Repositories\ERIS;

use App\Models\Department;
use Illuminate\Support\Collection;

class FormRepository
{
    public function upsertMany(array $rows): int
    {
        Department::upsert(
            $rows,
            uniqueBy: ['code'],
            update: ['name', 'territory', 'state', 'staff']
        );

        return count($rows);
    }

    public function upsertBatch(Collection $departments): void
    {
        foreach ($departments as $departmentData) {
            Department::updateOrCreate(
                ['code' => $departmentData['code']], // The unique lookup constraint
                [
                    'name' => $departmentData['name'],
                    'territory' => $departmentData['territory'],
                    'state' => $departmentData['state'],
                    'staff' => $departmentData['state']
                ]
            );
        }
    }
}