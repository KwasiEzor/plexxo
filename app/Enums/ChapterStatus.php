<?php

namespace App\Enums;

enum ChapterStatus: string
{
    case Empty = 'empty';
    case Draft = 'draft';
    case Generating = 'generating';
    case Revising = 'revising';
    case Revised = 'revised';
    case Translating = 'translating';
    case Translated = 'translated';
    case Finalized = 'finalized';
    case Failed = 'failed';

    public function label(): string
    {
        return match ($this) {
            self::Empty => 'Vide',
            self::Draft => 'Brouillon',
            self::Generating => 'Génération...',
            self::Revising => 'Révision...',
            self::Revised => 'Révisé',
            self::Translating => 'Traduction...',
            self::Translated => 'Traduit',
            self::Finalized => 'Finalisé',
            self::Failed => 'Échec',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Empty => 'gray',
            self::Draft => 'amber',
            self::Generating, self::Revising, self::Translating => 'blue',
            self::Revised, self::Translated, self::Finalized => 'green',
            self::Failed => 'red',
        };
    }

    public function isProcessing(): bool
    {
        return in_array($this, [self::Generating, self::Revising, self::Translating]);
    }

    public function canBeEdited(): bool
    {
        return ! $this->isProcessing();
    }
}
