<?php

namespace App\Enums;

enum SourceStatus: string
{
    case Pending = 'pending';
    case Processing = 'processing';
    case Completed = 'completed';
    case Failed = 'failed';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'En attente',
            self::Processing => 'Traitement...',
            self::Completed => 'Terminé',
            self::Failed => 'Échec',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Pending => 'gray',
            self::Processing => 'blue',
            self::Completed => 'green',
            self::Failed => 'red',
        };
    }

    public function isReady(): bool
    {
        return $this === self::Completed;
    }
}
