<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'code',
        'okud',
        'name',
        'territory',
        'state',
        'version_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'state' => 'integer', // Ensures 1/0 from DB becomes true/false in PHP
            'version_id' => 'integer',
        ];
    }

    /**
     * Get the forms associated with the department.
     */
    public function forms(): HasMany
    {
        // Changed to plural 'forms' to match standard Laravel naming for collections
        // Changed foreign key to 'department_id' assuming it lives on the forms table
        return $this->hasMany(Form::class, 'department_id');
    }
}