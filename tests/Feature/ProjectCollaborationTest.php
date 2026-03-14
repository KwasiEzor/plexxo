<?php

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
});

it('allows a project owner to invite another user', function () {
    $owner = User::factory()->create();
    $invited = User::factory()->create();
    $project = Project::factory()->create(['user_id' => $owner->id]);

    $this->actingAs($owner);

    $response = $this->post(route('projects.invite', $project), [
        'email' => $invited->email,
        'role' => 'editor',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('project_user', [
        'project_id' => $project->id,
        'user_id' => $invited->id,
        'role' => 'editor',
    ]);
});

it('prevents non-owners from inviting users', function () {
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $invited = User::factory()->create();
    $project = Project::factory()->create(['user_id' => $owner->id]);

    $this->actingAs($stranger);

    $response = $this->post(route('projects.invite', $project), [
        'email' => $invited->email,
        'role' => 'editor',
    ]);

    $response->assertForbidden();
});

it('allows an editor to update a project', function () {
    $owner = User::factory()->create();
    $editor = User::factory()->create();
    $project = Project::factory()->create(['user_id' => $owner->id]);
    $project->collaborators()->attach($editor->id, ['role' => 'editor']);

    $this->actingAs($editor);

    $response = $this->put(route('chapters.update', $project->chapters()->create(['title' => 'Test'])), [
        'content' => 'New content',
    ]);

    $response->assertRedirect();
});

it('prevents a viewer from updating a project', function () {
    $owner = User::factory()->create();
    $viewer = User::factory()->create();
    $project = Project::factory()->create(['user_id' => $owner->id]);
    $project->collaborators()->attach($viewer->id, ['role' => 'viewer']);

    $this->actingAs($viewer);

    $response = $this->put(route('chapters.update', $project->chapters()->create(['title' => 'Test'])), [
        'content' => 'New content',
    ]);

    $response->assertForbidden();
});
