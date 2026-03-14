<?php

namespace App\Services;

use App\Models\Project;
use Exception;
use Illuminate\Support\Facades\Http;

class GumroadService
{
    protected string $token;

    public function __construct()
    {
        $this->token = config('services.gumroad.token', '');
    }

    /**
     * Create a product on Gumroad from a project.
     */
    public function createProduct(Project $project): array
    {
        if ($this->token === '' || $this->token === '0') {
            throw new Exception('Gumroad API token not configured.');
        }

        $response = Http::withToken($this->token)
            ->post('https://api.gumroad.com/v2/products', [
                'name' => $project->title,
                'description' => $project->description,
                'price' => 1000, // 10.00 EUR in cents
                'currency' => 'eur',
                // In a real app, we would upload the PDF here
            ]);

        if ($response->failed()) {
            throw new Exception('Gumroad API error: '.$response->body());
        }

        return $response->json('product');
    }
}
