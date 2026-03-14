<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case Editor = 'editor';
    case Viewer = 'viewer';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Administrateur',
            self::Editor => 'Éditeur',
            self::Viewer => 'Lecteur',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Admin => 'red',
            self::Editor => 'blue',
            self::Viewer => 'gray',
        };
    }

    public function canUpdate(): bool
    {
        return in_array($this, [self::Admin, self::Editor]);
    }

    public function isAdmin(): bool
    {
        return $this === self::Admin;
    }
}
