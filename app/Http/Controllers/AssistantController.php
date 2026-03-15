<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class AssistantController extends Controller
{
    /**
     * Display the AI Assistant page.
     */
    public function index(): Response
    {
        return Inertia::render('assistant', [
            'messages' => [
                [
                    'role' => 'assistant',
                    'content' => 'Bonjour ! Je suis votre assistant Plexxo. Comment puis-je vous aider aujourd\'hui ?',
                    'timestamp' => now()->toISOString(),
                ],
            ],
            'ai_stats' => [
                'tokens_available' => 50000,
                'tokens_used' => 12500,
            ],
        ]);
    }
}
