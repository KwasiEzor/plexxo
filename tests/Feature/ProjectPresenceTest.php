<?php

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    config(['broadcasting.default' => 'reverb']);
});

it('authorizes a collaborator to join the project presence channel', function (): void {
    $user = User::factory()->create();
    $project = Project::factory()->create();
    $project->collaborators()->attach($user->id, ['role' => 'editor']);

    $this->actingAs($user);

    $response = $this->postJson('/broadcasting/auth', [
        'channel_name' => 'presence-project.'.$project->id,
        'socket_id' => '1234.5678',
    ]);

    $response->assertSuccessful();

    $data = json_decode((string) $response->json('channel_data'), true);
    expect($data['user_info']['id'])->toBe($user->id);
    expect($data['user_info']['name'])->toBe($user->name);
});

it('authorizes the owner to join the project presence channel', function (): void {
    $user = User::factory()->create();
    $project = Project::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user);

    $response = $this->postJson('/broadcasting/auth', [
        'channel_name' => 'presence-project.'.$project->id,
        'socket_id' => '1234.5678',
    ]);

    $response->assertSuccessful();

    $data = json_decode((string) $response->json('channel_data'), true);
    expect($data['user_info']['id'])->toBe($user->id);
    expect($data['user_info']['name'])->toBe($user->name);
});

it('denies a non-collaborator from joining the project presence channel', function (): void {
    $user = User::factory()->create();
    $project = Project::factory()->create();

    $this->actingAs($user);

    $response = $this->postJson('/broadcasting/auth', [
        'channel_name' => 'presence-project.'.$project->id,
        'socket_id' => '1234.5678',
    ]);

    $response->assertForbidden();
});
