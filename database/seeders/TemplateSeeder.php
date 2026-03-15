<?php

namespace Database\Seeders;

use App\Models\Template;
use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $initialTemplates = [
            [
                'slug' => 'romance',
                'name' => 'Roman d\'Amour',
                'description' => 'Structure optimisée pour les intrigues romantiques modernes.',
                'image' => 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=400&h=600&fit=crop',
                'features' => ['3 Actes', 'Arcs émotionnels', 'Guide de style doux'],
                'category' => 'Fiction',
                'is_premium' => false,
            ],
            [
                'slug' => 'thriller',
                'name' => 'Thriller Haletant',
                'description' => 'Conçu pour maintenir le suspense et gérer les rebondissements.',
                'image' => 'https://images.unsplash.com/photo-1531928351158-2f7360749509?q=80&w=400&h=600&fit=crop',
                'features' => ['Structure en 5 points', 'Gestion des indices', 'Style direct'],
                'category' => 'Thriller',
                'is_premium' => true,
            ],
            [
                'slug' => 'non-fiction',
                'name' => 'Guide Pratique',
                'description' => 'Parfait pour les livres de business, développement personnel ou tutoriels.',
                'image' => 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=400&h=600&fit=crop',
                'features' => ['Index thématique', 'Format structuré', 'En-têtes hiérarchiques'],
                'category' => 'Business',
                'is_premium' => false,
            ],
            [
                'slug' => 'fantasy',
                'name' => 'Épopée Fantasy',
                'description' => 'Un cadre pour construire des mondes riches et des systèmes de magie.',
                'image' => 'https://images.unsplash.com/photo-1514897575457-c4db467cf78e?q=80&w=400&h=600&fit=crop',
                'features' => ['World-building guide', 'Lexique intégré', 'Généalogie'],
                'category' => 'Fantasy',
                'is_premium' => true,
            ],
        ];

        foreach ($initialTemplates as $template) {
            Template::create($template);
        }

        Template::factory()->count(20)->create();
    }
}
