<?php

namespace App\Services\AI;

use App\Models\Chapter;
use EchoLabs\Prism\Prism;
use EchoLabs\Prism\Enums\Provider;

class ReviewerAgent
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
     * Review the content of a chapter.
     * 
     * @return array{tone: string, style: string, grammar: string, suggestions: string[], revised_content: string}
     */
    public function review(Chapter $chapter): array
    {
        $systemPrompt = <<<PROMPT
Tu es un Agent Réviseur (Critic Agent) expert en édition d'ebooks. 
Ton rôle est d'analyser le contenu d'un chapitre et de fournir une critique constructive ainsi qu'une version améliorée.

PROJET: {$chapter->project->title}
DESCRIPTION DU PROJET: {$chapter->project->description}
LANGUE: {$chapter->project->language}

Analyse sur les points suivants :
1. TON: Est-il approprié au projet ?
2. STYLE: La fluidité et la clarté.
3. GRAMMAIRE: Les fautes d'orthographe et de syntaxe.
4. SUGGESTIONS: Liste de points précis à améliorer.
5. RÉVISION: Une version complète et améliorée du contenu original.

Retourne ta réponse UNIQUEMENT sous forme de JSON valide.
PROMPT;

        $response = Prism::text()
            ->using($this->provider, $this->model)
            ->withSystemPrompt($systemPrompt)
            ->withPrompt($chapter->content ?? '')
            ->generate();

        // Using a simple JSON decode as a placeholder for structured output
        // In a real scenario, we could use Prism's structured response features
        $data = json_decode($response->text, true);

        if (!$data || !isset($data['revised_content'])) {
            // Fallback if the AI didn't return perfect JSON
            return [
                'tone' => 'Analyse indisponible',
                'style' => 'Analyse indisponible',
                'grammar' => 'Analyse indisponible',
                'suggestions' => [],
                'revised_content' => $response->text,
            ];
        }

        return $data;
    }
}
