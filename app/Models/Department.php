<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'code',
        'name',
        'territory',
        'state',
        'okveds',
    ];

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
