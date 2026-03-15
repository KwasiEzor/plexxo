<?php

namespace Database\Factories;

use App\Enums\TemplateStatus;
use App\Models\Template;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Template>
 */
class TemplateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->sentence(3);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => $this->faker->paragraph,
            'image' => 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=400&h=600&fit=crop',
            'features' => [
                $this->faker->word,
                $this->faker->word,
                $this->faker->word,
            ],
            'category' => $this->faker->randomElement(['Fiction', 'Business', 'Non-Fiction', 'Fantasy', 'Thriller']),
            'is_premium' => $this->faker->boolean(20),
            'status' => TemplateStatus::Completed,
            'user_id' => null,
        ];
    }
}
