<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'indicators',
        'reports',
        'coeff',
        'final',
        'department_id',
        'versions_id',
    ];

    public function department()
    {
        return $this->hasMany(Department::class, 'department_id');
    }
}
