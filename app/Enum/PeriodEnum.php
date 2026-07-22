<?php

namespace App\Enum;

enum PeriodEnum: string
{
    case Annual = 'годовая';
    case SemiAnnual = 'полугодовая';
    case Quarterly = 'квартальная';
    case Monthly = 'месячная';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}