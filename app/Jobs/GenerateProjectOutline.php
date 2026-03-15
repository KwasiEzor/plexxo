<?php

namespace App\Jobs;

use App\Enums\ChapterStatus;
use App\Enums\ProjectStatus;
use App\Events\ProjectOutlineGenerated;
use App\Models\Project;
use App\Services\AI\AIOrchestrator;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GenerateProjectOutline implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public Project $project) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            if ($this->project->status !== ProjectStatus::Pending && $this->project->status !== ProjectStatus::Generating) {
                return;
            }

            if ($this->project->chapters()->exists()) {
                $this->project->update(['status' => ProjectStatus::Draft]);

                return;
            }

            $this->project->update(['status' => ProjectStatus::Generating]);

            $ai = AIOrchestrator::provider();
            $outline = $ai->generateOutline($this->project->title, [
                'language' => $this->project->language,
                'description' => $this->project->description,
            ]);

            DB::transaction(function () use ($outline): void {
                if ($this->project->chapters()->exists()) {
                    $this->project->update(['status' => ProjectStatus::Draft]);

                    return;
                }

                foreach ($outline as $index => $item) {
                    $this->project->chapters()->create([
                        'title' => $item['title'],
                        'order' => $index,
                        'status' => ChapterStatus::Empty,
                    ]);
                }

                $this->project->update(['status' => ProjectStatus::Draft]);
            });

            event(new ProjectOutlineGenerated($this->project));
        } catch (\Exception $e) {
            Log::error("Failed to generate outline for project {$this->project->id}: ".$e->getMessage());
            $this->project->update(['status' => ProjectStatus::Failed]);
        }
    }
}
