<?php

namespace App\Services\AI;

use Exception;
use Illuminate\Support\Facades\Http;

class OpenAIService implements AIServiceInterface
{
    protected string $key;

    protected string $model;

    public function __construct()
    {
        $this->key = config('ai.providers.openai.key');
        $this->model = config('ai.providers.openai.model');
    }

    public function generate(string $prompt, array $options = []): string
    {
        $response = Http::withToken($this->key)
            ->post('https://api.openai.com/v1/chat/completions', [
                'model' => $options['model'] ?? $this->model,
                'messages' => [
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature' => $options['temperature'] ?? 0.7,
                'max_tokens' => $options['max_tokens'] ?? 2000,
            ]);

        if ($response->failed()) {
            throw new Exception('OpenAI API error: '.$response->body());
        }

        return $response->json('choices.0.message.content');
    }

    public function generateWithContext(string $prompt, string $context, array $options = []): string
    {
        $systemPrompt = "Tu es un assistant rédactionnel expert. Utilise UNIQUEMENT le contexte suivant pour répondre à la demande de l'utilisateur. Si l'information n'est pas dans le contexte, dis-le poliment.\n\nCONTEXTE:\n{$context}";

        $response = Http::withToken($this->key)
            ->post('https://api.openai.com/v1/chat/completions', [
                'model' => $options['model'] ?? $this->model,
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature' => $options['temperature'] ?? 0.7,
                'max_tokens' => $options['max_tokens'] ?? 2000,
            ]);

        if ($response->failed()) {
            throw new Exception('OpenAI API error: '.$response->body());
        }

        return $response->json('choices.0.message.content');
    }

    public function generateOutline(string $topic, array $options = []): array
    {
        $systemPrompt = "Tu es un expert en édition d'ebooks. Génère un plan détaillé pour un ebook sur le sujet fourni. Retourne UNIQUEMENT un JSON valide au format: [{\"title\": \"...\", \"description\": \"...\"}]";

        $response = Http::withToken($this->key)
            ->post('https://api.openai.com/v1/chat/completions', [
                'model' => $options['model'] ?? $this->model,
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => 'Le sujet est: '.$topic],
                ],
                'response_format' => ['type' => 'json_object'],
            ]);

        if ($response->failed()) {
            throw new Exception('OpenAI API error: '.$response->body());
        }

        $data = json_decode((string) $response->json('choices.0.message.content'), true);

        return $data['outline'] ?? $data;
    }
}
