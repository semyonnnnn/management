<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sensei extends User
{
    public function gakuseis(): HasMany
    {
        return $this->hasMany(Gakusei::class);
    }
}
