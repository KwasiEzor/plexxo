<?php

namespace App\Enums;

enum TemplateStatus: string
{
    case Draft = 'draft';
    case Completed = 'completed';
    case Archived = 'archived';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Completed => 'Completed',
            self::Archived => 'Archived',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Draft => 'yellow',
            self::Completed => 'green',
            self::Archived => 'gray',
        };
    }
}
