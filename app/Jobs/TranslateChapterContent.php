<?php

namespace App\Jobs;

use App\Events\ChapterUpdated;
use App\Models\Chapter;
use App\Services\AI\TranslatorAgent;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class TranslateChapterContent implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public Chapter $chapter, public string $targetLanguage)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(TranslatorAgent $agent): void
    {
        try {
            $this->chapter->update(['status' => 'translating']);
            event(new ChapterUpdated($this->chapter));

            $translatedContent = $agent->translate($this->chapter, $this->targetLanguage);

            $this->chapter->update([
                'content' => $translatedContent,
                'status' => 'translated',
            ]);

            event(new ChapterUpdated($this->chapter));
        } catch (Exception $e) {
            Log::error("Failed to translate content for chapter {$this->chapter->id}: ".$e->getMessage());
            $this->chapter->update(['status' => 'failed']);
            event(new ChapterUpdated($this->chapter));
        }
    }
}
