<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Gakusei extends User
{
    public function senseis(): HasOne
    {
        return $this->hasOne(Sensei::class);
    }
}
