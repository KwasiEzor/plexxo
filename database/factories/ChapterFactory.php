<?php

namespace Database\Factories;

use App\Models\Chapter;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Chapter>
 */
class ChapterFactory extends Factory
{
    protected $model = Chapter::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'title' => $this->faker->sentence(),
            'order' => 0,
            'content' => $this->faker->paragraphs(3, true),
            'status' => 'draft',
        ];
    }
}
