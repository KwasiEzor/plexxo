<?php

use App\Enums\TemplateStatus;
use App\Models\Template;
use App\Models\User;

it('can view the template library', function () {
    Template::factory()->count(3)->create();

    $this->actingAs(User::factory()->create())
        ->get(route('templates.index'))
        ->assertSuccessful();
});

it('can view my templates', function () {
    $user = User::factory()->create();
    Template::factory()->count(2)->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('my-templates.index'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('templates/my-templates')
            ->has('templates.data', 2)
        );
});

it('can favorite a template', function () {
    $user = User::factory()->create();
    $template = Template::factory()->create();

    $this->actingAs($user)
        ->post(route('templates.favorite', $template))
        ->assertRedirect();

    expect($user->favoriteTemplates()->where('template_id', $template->id)->exists())->toBeTrue();
});

it('can archive its own template', function () {
    $user = User::factory()->create();
    $template = Template::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->post(route('templates.archive', $template))
        ->assertRedirect();

    expect($template->fresh()->status)->toBe(TemplateStatus::Archived);
});

it('cannot archive others templates', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $template = Template::factory()->create(['user_id' => $otherUser->id]);

    $this->actingAs($user)
        ->post(route('templates.archive', $template))
        ->assertForbidden();
});

it('can delete its own template', function () {
    $user = User::factory()->create();
    $template = Template::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->delete(route('templates.destroy', $template))
        ->assertRedirect(route('my-templates.index'));

    expect(Template::find($template->id))->toBeNull();
});
