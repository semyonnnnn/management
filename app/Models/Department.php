<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
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
    public function forms()
    {
        return $this->belongsToMany(Form::class, 'department_form')
            ->withTimestamps();
    }
}
