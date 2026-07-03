<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = ['code', 'name', 'territory', 'state', 'versions_id'];

    // app/Models/Department.php
    public function version()
    {
        return $this->belongsTo(Version::class, 'versions_id');
    }
}
