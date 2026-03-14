<?php

namespace App\Services\AI;

use App\Models\Project;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ImageGenerator
{
    protected string $key;

    public function __construct()
    {
        $this->key = config('ai.providers.openai.key', '');
    }

    /**
     * Generate a cover image for a project using DALL-E 3.
     */
    public function generateCover(Project $project): string
    {
        if ($this->key === '' || $this->key === '0') {
            throw new Exception('OpenAI API key not configured for image generation.');
        }

        $prompt = "A professional, high-quality book cover for an ebook titled '{$project->title}'. ".
                  "Topic: {$project->description}. ".
                  'Style: Modern, artistic, minimalist, without any text or titles. '.
                  'The image should be vertical aspect ratio suitable for a book cover.';

        $response = Http::withToken($this->key)
            ->post('https://api.openai.com/v1/images/generations', [
                'model' => 'dall-e-3',
                'prompt' => $prompt,
                'n' => 1,
                'size' => '1024x1792', // Portrait size for DALL-E 3
                'quality' => 'standard',
            ]);

        if ($response->failed()) {
            Log::error('DALL-E API Error: '.$response->body());
            throw new Exception('Failed to generate image via DALL-E.');
        }

        return $response->json('data.0.url');
    }
}
