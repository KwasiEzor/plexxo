<?php

use App\Models\User;
use Laravel\Socialite\Facades\Socialite;

test('users can redirect to provider', function () {
    $response = $this->get('/auth/github/redirect');

    $response->assertRedirect();
    expect($response->headers->get('Location'))->toContain('github.com');
});

test('users can authenticate using social provider', function () {
    $socialUser = Mockery::mock(Laravel\Socialite\Two\User::class);
    $socialUser->shouldReceive('getId')->andReturn('123456');
    $socialUser->shouldReceive('getName')->andReturn('Test User');
    $socialUser->shouldReceive('getEmail')->andReturn('test@example.com');
    $socialUser->shouldReceive('getNickname')->andReturn('testuser');
    $socialUser->token = 'test-token';

    Socialite::shouldReceive('driver')->with('github')->andReturnSelf();
    Socialite::shouldReceive('user')->andReturn($socialUser);

    $response = $this->get('/auth/github/callback');

    $this->assertAuthenticated();
    $response->assertRedirect('/dashboard');

    $user = User::where('email', 'test@example.com')->first();
    expect($user)->not->toBeNull();
    expect($user->provider)->toBe('github');
    expect($user->provider_id)->toBe('123456');
});
