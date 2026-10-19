<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class DepartmentForm extends Pivot
{
    protected $table = 'department_form'; // Replace with your actual table name if different

    public $timestamps = false; // Set to true if your pivot tracks creation/update times

    protected $fillable = [
        'form_id',
        'department_id'
    ];
}