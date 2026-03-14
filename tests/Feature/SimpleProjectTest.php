<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can create a project', function () {
    $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson(route('projects.store'), [
        'title' => 'Test Project',
        'language' => 'fr',
        'description' => 'A test project description',
    ]);

    $response->assertSuccessful();
    $this->assertDatabaseHas('projects', [
        'title' => 'Test Project',
        'user_id' => $user->id,
    ]);
});
