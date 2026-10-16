<?php

namespace App\Models\ERIS;

use Illuminate\Database\Eloquent\Model;

abstract class Base extends Model
{
    protected ?string $startTable = null;
    protected ?string $endTable = null;

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        if (!property_exists($this, 'envKey')) {
            return;
        }

        $fallback = $this->envKey . '__do_not_exist';
        $prefix = env($this->envKey, $fallback);

        // 1. Handle year_start if it exists
        if (property_exists($this, 'year_start') && $this->year_start !== null) {
            $this->startTable = "{$prefix}_{$this->year_start}";
        }

        // 2. Handle year_end if it exists
        if (property_exists($this, 'year_end') && $this->year_end !== null) {
            $this->endTable = "{$prefix}_{$this->year_end}";
        }

        // 3. Safe default $table fallback just in case neither year property is used
        // (Points strictly to the env prefix instead of cross-wiring start/end tables)
        $this->table = $this->endTable ?? $this->startTable ?? $prefix;
    }

    /**
     * Query against the year_start table
     */
    public static function startFormTable()
    {
        $instance = new static();
        if (!$instance->startTable) {
            throw new \Exception("The 'year_start' property is not defined for " . static::class);
        }
        return static::from($instance->startTable);
    }

    /**
     * Query against the year_end table
     */
    public static function endFormTable()
    {
        $instance = new static();
        if (!$instance->endTable) {
            throw new \Exception("The 'year_end' property is not defined for " . static::class);
        }
        return static::from($instance->endTable);
    }
}