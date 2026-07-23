<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'okud',
        'period',
        'indicators',
        'k1',
        'k2',
        'k3',
        'k4',
        'k5',
        'k6',
        'is_consolidated',
    ];

    protected $guarded = [];
    // Внутри модели Form.php
// App\Models\Form.php

    public function departments()
    {
        return $this->belongsToMany(Department::class, 'department_form')
            ->withTimestamps();
    }
}
