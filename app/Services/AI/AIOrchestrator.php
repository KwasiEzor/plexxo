<?php

namespace App\Services\AI;

use Exception;

class AIOrchestrator
{
    /**
     * Get the configured AI provider.
     *
     * @throws Exception
     */
    public static function provider(?string $provider = null): AIServiceInterface
    {
        $provider = $provider ?? config('ai.default');

        return match ($provider) {
            'openai' => new OpenAIService,
            'mock' => new MockAIService,
            // 'anthropic' => new AnthropicService(), // To be implemented
            default => throw new Exception("AI provider '{$provider}' not supported."),
        };
    }
}
