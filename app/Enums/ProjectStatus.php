<?php

namespace App\Enums;

enum ProjectStatus: string
{
    case Pending = 'pending';
    case Generating = 'generating';
    case Draft = 'draft';
    case Finalized = 'finalized';
    case Failed = 'failed';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'En attente',
            self::Generating => 'Génération en cours',
            self::Draft => 'Brouillon',
            self::Finalized => 'Terminé',
            self::Failed => 'Échec',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Pending => 'gray',
            self::Generating => 'blue',
            self::Draft => 'amber',
            self::Finalized => 'green',
            self::Failed => 'red',
        };
    }

    public function isWorkInProgress(): bool
    {
        return in_array($this, [self::Generating, self::Pending]);
    }
}
