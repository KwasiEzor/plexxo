<?php

namespace App\Services\AI;

interface AIServiceInterface
{
    /**
     * Generate content based on a prompt.
     *
     * @param  array<string, mixed>  $options
     */
    public function generate(string $prompt, array $options = []): string;

    /**
     * Generate a structured outline for an ebook.
     *
     * @param  array<string, mixed>  $options
     * @return array<int, array{title: string, description: string}>
     */
    public function generateOutline(string $topic, array $options = []): array;
}
