<?php

namespace App\Services\AI;

class AIOrchestrator
{
    /**
     * Get the AI provider instance.
     */
    public static function provider(?string $provider = null): AIServiceInterface
    {
        $provider ??= config('ai.default');

        return match ($provider) {
            'openai' => new OpenAIService,
            'anthropic' => new OpenAIService, // Using OpenAIService as it currently handles both via HTTP if needed, or Prism
            'prism' => new PrismAIService,
            'mock' => new MockAIService,
            default => new PrismAIService, // Default to Prism for improved features
        };
    }
}
