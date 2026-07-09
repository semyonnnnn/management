<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    protected $fillable = ['name', 'indicators', 'reports', 'coeff', 'final', 'version_id'];

    public function departments()
    {
        return $this->belongsToMany(Department::class, 'department_form');
    }
}
