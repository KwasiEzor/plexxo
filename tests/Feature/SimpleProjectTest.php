<?php

use App\Jobs\GenerateProjectOutline;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    //
});

it('can create a project', function (): void {
    $user = User::factory()->create();

    Queue::fake();

    $response = $this->actingAs($user)->postJson(route('projects.store'), [
        'title' => 'Test Project',
        'language' => 'fr',
        'description' => 'A test project description',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('projects', [
        'title' => 'Test Project',
        'user_id' => $user->id,
    ]);

    Queue::assertPushed(GenerateProjectOutline::class);
});
