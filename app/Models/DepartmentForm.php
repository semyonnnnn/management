<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class DepartmentForm extends Pivot
{
    protected $table = 'department_form'; // Replace with your actual table name if different


    protected $fillable = [
        'form_id',
        'department_id',
        'okveds',
    ];
}