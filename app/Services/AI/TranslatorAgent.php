<?php

namespace App\Services\AI;

use App\Models\Chapter;
use EchoLabs\Prism\Prism;
use EchoLabs\Prism\Enums\Provider;

class TranslatorAgent
{
    protected string $model;
    protected Provider $provider;

    public function __construct()
    {
        $defaultProvider = config('ai.default', 'openai');
        
        $this->provider = match ($defaultProvider) {
            'anthropic' => Provider::Anthropic,
            default => Provider::OpenAI,
        };

        $this->model = config("ai.providers.{$defaultProvider}.model");
    }

    /**
     * Translate the content of a chapter with cultural nuances.
     */
    public function translate(Chapter $chapter, string $targetLanguage): string
    {
        $systemPrompt = <<<PROMPT
Tu es un Traducteur Expert spécialisé dans l'édition d'ebooks. 
Ton objectif est de traduire le contenu suivant de manière "culturelle" et non littérale. 

RÈGLES:
1. Adapte le ton, le style et les idiomes à la langue cible: {$targetLanguage}.
2. Respecte le contexte du projet: {$chapter->project->title} ({$chapter->project->description}).
3. Assure une lecture fluide et naturelle.
4. Ne perds aucune information essentielle.

Réponds UNIQUEMENT avec le contenu traduit.
PROMPT;

        $response = Prism::text()
            ->using($this->provider, $this->model)
            ->withSystemPrompt($systemPrompt)
            ->withPrompt($chapter->content ?? '')
            ->generate();

        return $response->text;
    }
}
