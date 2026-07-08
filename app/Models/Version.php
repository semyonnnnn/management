<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Version extends Model
{
    protected $fillable = [
        'name',
        'isCurrent'
    ];

    protected $casts = [
        'isCurrent' => 'boolean',
        'created_at' => 'datetime',
    ];
}
