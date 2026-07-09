<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = ['code', 'name', 'territory', 'state', 'version_id'];

    public function form()
    {
        return $this->hasMany(Form::class, 'form_id');
    }
}
