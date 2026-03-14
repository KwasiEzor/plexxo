<?php

namespace App\Services\AI;

use EchoLabs\Prism\Enums\Provider;
use EchoLabs\Prism\Prism;

class PrismAIService implements AIServiceInterface
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

    public function generate(string $prompt, array $options = []): string
    {
        $response = Prism::text()
            ->using($this->provider, $options['model'] ?? $this->model)
            ->withPrompt($prompt)
            ->generate();

        return $response->text;
    }

    public function generateWithContext(string $prompt, string $context, array $options = []): string
    {
        $systemPrompt = "Tu es un assistant rédactionnel expert. Utilise UNIQUEMENT le contexte suivant pour répondre à la demande de l'utilisateur. Si l'information n'est pas dans le contexte, dis-le poliment.\n\nCONTEXTE:\n{$context}";

        $response = Prism::text()
            ->using($this->provider, $options['model'] ?? $this->model)
            ->withSystemPrompt($systemPrompt)
            ->withPrompt($prompt)
            ->generate();

        return $response->text;
    }

    public function generateOutline(string $topic, array $options = []): array
    {
        $systemPrompt = "Tu es un expert en édition d'ebooks. Génère un plan détaillé pour un ebook sur le sujet fourni. Retourne UNIQUEMENT un JSON valide au format: [{\"title\": \"...\", \"description\": \"...\"}]";

        $response = Prism::text()
            ->using($this->provider, $options['model'] ?? $this->model)
            ->withSystemPrompt($systemPrompt)
            ->withPrompt('Le sujet est: '.$topic)
            ->generate();

        $data = json_decode((string) $response->text, true);

        return $data['outline'] ?? $data;
    }
}
