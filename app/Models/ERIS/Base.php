<?php

namespace App\Models\ERIS;

use Illuminate\Database\Eloquent\Model;

abstract class Base extends Model
{
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        // Guard clause: if no envKey is defined, bail out early
        if (!property_exists($this, 'envKey')) {
            return;
        }

        $fallback = $this->envKey . '__do_not_exist';
        $prefix = env($this->envKey, $fallback);

        // Guard clause: if year is not defined or null, just assign the prefix
        if (!property_exists($this, 'year') || $this->year === null) {
            $this->table = $prefix;
            return;
        }

        // Otherwise, assign with the year suffix
        $this->table = "{$prefix}_{$this->year}";
    }
}