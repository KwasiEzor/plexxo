<?php

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->withoutMiddleware(ValidateCsrfToken::class);
});

it('allows a project owner to invite another user', function (): void {
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

it('prevents non-owners from inviting users', function (): void {
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

it('allows an editor to update a project', function (): void {
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

it('prevents a viewer from updating a project', function (): void {
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

it('allows a project admin to invite another user', function (): void {
    $owner = User::factory()->create();
    $admin = User::factory()->create();
    $invited = User::factory()->create();
    $project = Project::factory()->create(['user_id' => $owner->id]);
    $project->collaborators()->attach($admin->id, ['role' => 'admin']);

    $this->actingAs($admin);

    $response = $this->post(route('projects.invite', $project), [
        'email' => $invited->email,
        'role' => 'editor',
    ]);

    $response->assertRedirect();
});

it('prevents a project editor from inviting users', function (): void {
    $owner = User::factory()->create();
    $editor = User::factory()->create();
    $invited = User::factory()->create();
    $project = Project::factory()->create(['user_id' => $owner->id]);
    $project->collaborators()->attach($editor->id, ['role' => 'editor']);

    $this->actingAs($editor);

    $response = $this->post(route('projects.invite', $project), [
        'email' => $invited->email,
        'role' => 'editor',
    ]);

    $response->assertForbidden();
});

it('prevents a project admin from deleting the project', function (): void {
    $owner = User::factory()->create();
    $admin = User::factory()->create();
    $project = Project::factory()->create(['user_id' => $owner->id]);
    $project->collaborators()->attach($admin->id, ['role' => 'admin']);

    $this->actingAs($admin);

    $response = $this->delete(route('projects.destroy', $project));

    $response->assertForbidden();
});

it('allows the owner to delete the project', function (): void {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['user_id' => $owner->id]);

    $this->actingAs($owner);

    $response = $this->delete(route('projects.destroy', $project));

    $response->assertRedirect(route('dashboard'));
    $this->assertDatabaseMissing('projects', ['id' => $project->id]);
});

it('allows a project admin to remove a collaborator', function (): void {
    $owner = User::factory()->create();
    $admin = User::factory()->create();
    $editor = User::factory()->create();
    $project = Project::factory()->create(['user_id' => $owner->id]);
    $project->collaborators()->attach($admin->id, ['role' => 'admin']);
    $project->collaborators()->attach($editor->id, ['role' => 'editor']);

    $this->actingAs($admin);

    $response = $this->delete(route('projects.collaborators.remove', [$project, $editor]));

    $response->assertRedirect();
    $this->assertDatabaseMissing('project_user', [
        'project_id' => $project->id,
        'user_id' => $editor->id,
    ]);
});

it('prevents a project admin from removing the owner', function (): void {
    $owner = User::factory()->create();
    $admin = User::factory()->create();
    $project = Project::factory()->create(['user_id' => $owner->id]);
    $project->collaborators()->attach($admin->id, ['role' => 'admin']);

    $this->actingAs($admin);

    $response = $this->delete(route('projects.collaborators.remove', [$project, $owner]));

    $response->assertForbidden();
});

it('prevents a project editor from removing collaborators', function (): void {
    $owner = User::factory()->create();
    $editor = User::factory()->create();
    $viewer = User::factory()->create();
    $project = Project::factory()->create(['user_id' => $owner->id]);
    $project->collaborators()->attach($editor->id, ['role' => 'editor']);
    $project->collaborators()->attach($viewer->id, ['role' => 'viewer']);

    $this->actingAs($editor);

    $response = $this->delete(route('projects.collaborators.remove', [$project, $viewer]));

    $response->assertForbidden();
});
