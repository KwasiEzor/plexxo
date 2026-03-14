<?php

namespace App\Enums;

enum SourceType: string
{
    case Pdf = 'pdf';
    case Docx = 'docx';

    public function icon(): string
    {
        return match ($this) {
            self::Pdf => 'file-text',
            self::Docx => 'file-code',
        };
    }

    public function mimeType(): string
    {
        return match ($this) {
            self::Pdf => 'application/pdf',
            self::Docx => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        };
    }
}
