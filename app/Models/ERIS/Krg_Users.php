<?php

namespace App\Models\ERIS;

use Illuminate\Database\Eloquent\Model;

class Krg_Users extends Model
{
    // Points to your connection array in database.php
    protected $connection = 'smart_ecco_kurgan';

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->table = env('DB_ERIS_DEP', 'DB_ERIS_DEP__do_not_exist');
    }
}