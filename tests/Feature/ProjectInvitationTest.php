<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Project;
use App\Models\ProjectInvitation;
use App\Models\User;
use App\Notifications\ProjectInvitationNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Session;

uses(RefreshDatabase::class);

test('project owner can invite an existing user', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['user_id' => $owner->id]);
    $existingUser = User::factory()->create();

    $response = $this->actingAs($owner)
        ->post(route('projects.invite', $project), [
            'email' => $existingUser->email,
            'role' => UserRole::Editor->value,
        ]);

    $response->assertStatus(302);
    $this->assertTrue($project->collaborators->contains($existingUser));
    $this->assertEquals(UserRole::Editor, $project->collaborators()->where('user_id', $existingUser->id)->first()->pivot->role);
});

test('project owner can invite a non-existing user', function () {
    Notification::fake();

    $owner = User::factory()->create();
    $project = Project::factory()->create(['user_id' => $owner->id]);
    $email = 'newuser@example.com';

    $response = $this->actingAs($owner)
        ->post(route('projects.invite', $project), [
            'email' => $email,
            'role' => UserRole::Editor->value,
        ]);

    $response->assertStatus(302);
    $this->assertDatabaseHas('project_invitations', [
        'project_id' => $project->id,
        'email' => $email,
        'role' => UserRole::Editor->value,
    ]);

    Notification::assertSentOnDemand(ProjectInvitationNotification::class, function ($notification, $channels, $notifiable) use ($email) {
        return $notifiable->routes['mail'] === $email;
    });
});

test('logged in user can accept an invitation', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['user_id' => $owner->id]);
    $invitee = User::factory()->create();

    $invitation = ProjectInvitation::create([
        'project_id' => $project->id,
        'email' => $invitee->email,
        'role' => UserRole::Editor,
        'token' => 'test-token',
        'expires_at' => now()->addDays(7),
    ]);

    $response = $this->actingAs($invitee)
        ->get(route('invitations.accept', 'test-token'));

    $response->assertRedirect(route('projects.show', $project->slug));
    $this->assertTrue($project->collaborators->contains($invitee));
    $this->assertDatabaseMissing('project_invitations', ['id' => $invitation->id]);
});

test('guest is redirected to registration when accepting an invitation', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['user_id' => $owner->id]);
    $email = 'guest@example.com';

    $invitation = ProjectInvitation::create([
        'project_id' => $project->id,
        'email' => $email,
        'role' => UserRole::Editor,
        'token' => 'test-token',
        'expires_at' => now()->addDays(7),
    ]);

    $response = $this->get(route('invitations.accept', 'test-token'));

    $response->assertRedirect(route('register', ['email' => $email]));
    $this->assertEquals('test-token', session('project_invitation_token'));
});

test('newly registered user automatically joins the project if they have a token in session', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['user_id' => $owner->id]);
    $email = 'newuser@example.com';

    ProjectInvitation::create([
        'project_id' => $project->id,
        'email' => $email,
        'role' => UserRole::Editor,
        'token' => 'test-token',
        'expires_at' => now()->addDays(7),
    ]);

    // Simulate session
    Session::put('project_invitation_token', 'test-token');

    $response = $this->post(route('register.store'), [
        'name' => 'New User',
        'email' => $email,
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertRedirect(route('dashboard'));

    $newUser = User::where('email', $email)->first();
    $this->assertAuthenticatedAs($newUser);
    $this->assertTrue($project->collaborators->contains($newUser));
    $this->assertDatabaseMissing('project_invitations', ['token' => 'test-token']);
});
