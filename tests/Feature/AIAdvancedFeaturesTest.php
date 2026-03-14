<?php

use App\Jobs\ProcessSourceDocument;
use App\Jobs\ReviseChapterContent;
use App\Jobs\TranslateChapterContent;
use App\Models\Chapter;
use App\Models\Project;
use App\Models\User;
use App\Services\AI\ImageGenerator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    Storage::fake('local');
    Bus::fake();
});

it('allows a project owner to upload a source document for RAG', function (): void {
    $user = User::factory()->create();
    $project = Project::factory()->create(['user_id' => $user->id]);

    $file = UploadedFile::fake()->create('knowledge.pdf', 100);

    $this->actingAs($user)
        ->post(route('sources.store', ['project' => $project->slug]), [
            'file' => $file,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('sources', [
        'project_id' => $project->id,
        'title' => 'knowledge.pdf',
        'type' => 'pdf',
        'status' => 'pending',
    ]);

    Bus::assertDispatched(ProcessSourceDocument::class);
});

it('allows a project owner to trigger a chapter revision', function (): void {
    $user = User::factory()->create();
    $project = Project::factory()->create(['user_id' => $user->id]);
    $chapter = Chapter::factory()->create([
        'project_id' => $project->id,
        'content' => 'This is the original content that needs revision.',
        'status' => 'draft',
    ]);

    $this->actingAs($user)
        ->post(route('chapters.revise', ['chapter' => $chapter->id]))
        ->assertRedirect();

    Bus::assertDispatched(ReviseChapterContent::class);
});

it('allows a project owner to trigger a chapter translation', function (): void {
    $user = User::factory()->create();
    $project = Project::factory()->create(['user_id' => $user->id]);
    $chapter = Chapter::factory()->create([
        'project_id' => $project->id,
        'content' => 'This content will be translated.',
        'status' => 'draft',
    ]);

    $this->actingAs($user)
        ->post(route('chapters.translate', ['chapter' => $chapter->id]), [
            'language' => 'English',
        ])
        ->assertRedirect();

    Bus::assertDispatched(TranslateChapterContent::class, fn ($job): bool => $job->chapter->id === $chapter->id && $job->targetLanguage === 'English');
});

it('allows a project owner to generate an AI cover', function (): void {
    $user = User::factory()->create();
    $project = Project::factory()->create(['user_id' => $user->id]);

    $mock = $this->mock(ImageGenerator::class, function ($mock) use ($project): void {
        $mock->shouldReceive('generateCover')
            ->once()
            ->with(Mockery::on(fn ($p): bool => $p->id === $project->id))
            ->andReturn('https://example.com/fake-image.jpg');
    });

    // We also need to mock the MediaLibrary download part if we don't want it to actually hit the network
    // But since we use Storage::fake('local'), it might try to download and fail if URL is invalid.
    // For this test, let's just assert redirect and check if it was called.

    $this->actingAs($user)
        ->post(route('projects.generate-cover', ['project' => $project->slug]))
        ->assertRedirect();
});

it('allows a collaborator to post a comment on a chapter', function (): void {
    $user = User::factory()->create();
    $project = Project::factory()->create();
    $project->collaborators()->attach($user->id, ['role' => 'viewer']);
    $chapter = Chapter::factory()->create(['project_id' => $project->id]);

    $this->actingAs($user)
        ->post(route('comments.store', ['chapter' => $chapter->id]), [
            'content' => 'Great chapter, but needs more detail.',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('comments', [
        'chapter_id' => $chapter->id,
        'user_id' => $user->id,
        'content' => 'Great chapter, but needs more detail.',
    ]);
});

it('denies a non-collaborator from uploading sources', function (): void {
    $user = User::factory()->create();
    $project = Project::factory()->create(); // Owned by someone else

    $file = UploadedFile::fake()->create('stolen_knowledge.pdf', 100);

    $this->actingAs($user)
        ->post(route('sources.store', ['project' => $project->slug]), [
            'file' => $file,
        ])
        ->assertForbidden();

    Bus::assertNotDispatched(ProcessSourceDocument::class);
});
