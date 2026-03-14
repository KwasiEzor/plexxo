<?php

namespace App\Services\AI;

class MockAIService implements AIServiceInterface
{
    public function generate(string $prompt, array $options = []): string
    {
        return "Ceci est un contenu généré par l'IA simulée pour le prompt : ".$prompt;
    }

    public function generateWithContext(string $prompt, string $context, array $options = []): string
    {
        return "Ceci est un contenu généré par l'IA simulée avec contexte : ".$prompt." (Context length: ".strlen($context).")";
    }

    public function generateOutline(string $topic, array $options = []): array
    {
        return [
            ['title' => 'Introduction', 'description' => 'Introduction au sujet : '.$topic],
            ['title' => 'Chapitre 1', 'description' => 'Développement principal'],
            ['title' => 'Conclusion', 'description' => 'Résumé et perspectives'],
        ];
    }
}
