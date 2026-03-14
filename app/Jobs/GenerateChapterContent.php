<?php

namespace App\Jobs;

use App\Events\ChapterUpdated;
use App\Models\Chapter;
use App\Services\AI\AIOrchestrator;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateChapterContent implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public Chapter $chapter) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $this->chapter->update(['status' => 'generating']);

            // Broadcast the status change
            event(new ChapterUpdated($this->chapter));

            // Gather context from sources
            $sources = $this->chapter->project->sources()
                ->where('status', 'completed')
                ->get();

            $context = $sources->map(fn($source) => "SOURCE: {$source->title}\nCONTENU: {$source->content}")->join("\n---\n");

            $ai = AIOrchestrator::provider();

            $prompt = "Rédige le contenu détaillé pour le chapitre suivant d'un ebook.\n".
                      "Titre du livre: {$this->chapter->project->title}\n".
                      "Titre du chapitre: {$this->chapter->title}\n".
                      "Contexte du projet: {$this->chapter->project->description}\n".
                      "Langue: {$this->chapter->project->language}\n\n".
                      "Le contenu doit être structuré, professionnel et prêt à l'emploi.";

            if ($context) {
                $content = $ai->generateWithContext($prompt, $context, [
                    'max_tokens' => 4000,
                ]);
            } else {
                $content = $ai->generate($prompt, [
                    'max_tokens' => 4000,
                ]);
            }

            $this->chapter->update([
                'content' => $content,
                'status' => 'draft',
            ]);

            event(new ChapterUpdated($this->chapter));
        } catch (\Exception $e) {
            Log::error("Failed to generate content for chapter {$this->chapter->id}: ".$e->getMessage());
            $this->chapter->update(['status' => 'failed']);
            event(new ChapterUpdated($this->chapter));
        }
    }
}
