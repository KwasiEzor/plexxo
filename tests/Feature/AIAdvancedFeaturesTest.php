<?php

use App\Jobs\ProcessSourceDocument;
use App\Jobs\ReviseChapterContent;
use App\Jobs\TranslateChapterContent;
use App\Models\Chapter;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Testing\RefreshDatabase;

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

    Bus::assertDispatched(TranslateChapterContent::class, function ($job) use ($chapter) {
        return $job->chapter->id === $chapter->id && $job->targetLanguage === 'English';
    });
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
