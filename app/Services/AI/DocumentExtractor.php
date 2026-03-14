<?php

namespace App\Services\AI;

use Exception;
use PhpOffice\PhpWord\IOFactory;
use Smalot\PdfParser\Parser;

class DocumentExtractor
{
    /**
     * Extract text from a file.
     */
    public function extract(string $path, string $type): string
    {
        return match ($type) {
            'pdf' => $this->extractFromPdf($path),
            'docx' => $this->extractFromDocx($path),
            default => throw new Exception("Unsupported file type: {$type}"),
        };
    }

    /**
     * Extract text from a PDF file.
     */
    protected function extractFromPdf(string $path): string
    {
        $parser = new Parser;
        $pdf = $parser->parseFile($path);

        return $pdf->getText();
    }

    /**
     * Extract text from a Docx file.
     */
    protected function extractFromDocx(string $path): string
    {
        $phpWord = IOFactory::load($path);
        $content = '';

        foreach ($phpWord->getSections() as $section) {
            foreach ($section->getElements() as $element) {
                if (method_exists($element, 'getText')) {
                    $content .= $element->getText() . "\n";
                } elseif (method_exists($element, 'getElements')) {
                    foreach ($element->getElements() as $childElement) {
                        if (method_exists($childElement, 'getText')) {
                            $content .= $childElement->getText() . "\n";
                        }
                    }
                }
            }
        }

        return $content;
    }
}
