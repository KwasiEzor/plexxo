<?php

namespace App\Jobs;

use App\Enums\ChapterStatus;
use App\Events\ChapterUpdated;
use App\Models\Chapter;
use App\Services\AI\ReviewerAgent;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ReviseChapterContent implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public Chapter $chapter)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(ReviewerAgent $agent): void
    {
        try {
            $this->chapter->update(['status' => ChapterStatus::Revising]);
            event(new ChapterUpdated($this->chapter));

            $review = $agent->review($this->chapter);

            // In a more complex app, we'd store the tone/suggestions in a separate table/meta
            $this->chapter->update([
                'content' => $review['revised_content'],
                'status' => ChapterStatus::Revised,
            ]);

            event(new ChapterUpdated($this->chapter));
        } catch (Exception $e) {
            Log::error("Failed to revise content for chapter {$this->chapter->id}: ".$e->getMessage());
            $this->chapter->update(['status' => ChapterStatus::Failed]);
            event(new ChapterUpdated($this->chapter));
        }
    }
}
