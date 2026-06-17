<?php

namespace App\Enum;

enum RolesEnum: string
{
    case Root = 'Root';
    case Admin = 'admin';
    case Sensei = 'sensei';
    case Gakusei = 'gakusei';

    public static function labels(): array
    {
        return [
            self::Root->value => 'root',
            self::Admin->value => 'Администратор',
            self::Sensei->value => 'Наставник',
            self::Gakusei->value => 'Ученик',
        ];
    }

    public function label()
    {
        return match ($this) {
            self::Root => 'Root',
            self::Admin => 'Admin',
            self::Sensei => 'Sensei',
            self::Gakusei => 'Gakusei',
        };
    }
}
