<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

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
        'reports_count',
    ];

    public function departments()
    {
        return $this->belongsToMany(Department::class, 'department_form')
            ->withTimestamps();
    }

    public function scopeFilterTerritory(Builder $query, string $territory): void
    {
        if ($territory === 'all') {
            return;
        }

        $query->whereHas('departments', function ($q) use ($territory) {
            $q->where(DB::raw('LOWER(TRIM(territory))'), $territory);
        });
    }

    public function computeWorkload(): float
    {
        return $this->reports_count * $this->indicators
            * $this->k1 * $this->k2 * $this->k3
            * $this->k4 * $this->k5 * $this->k6;
    }

    public function scopeSearch(Builder $query, string $search): void
    {
        if ($search === '') {
            return;
        }

        $query->where(function ($q) use ($search) {
            $q->where('name', 'like', '%' . $search . '%')
                ->orWhereHas('departments', function ($subQuery) use ($search) {
                    $subQuery->where('name', 'like', '%' . $search . '%');
                })->orWhere('okud', 'like', '%' . $search . '%');
        });
    }
}