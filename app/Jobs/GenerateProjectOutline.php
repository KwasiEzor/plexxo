<?php

namespace App\Jobs;

use App\Events\ProjectOutlineGenerated;
use App\Models\Project;
use App\Services\AI\AIOrchestrator;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
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
            $this->project->update(['status' => 'generating']);

            $ai = AIOrchestrator::provider();
            $outline = $ai->generateOutline($this->project->title, [
                'language' => $this->project->language,
                'description' => $this->project->description,
            ]);

            foreach ($outline as $index => $item) {
                $this->project->chapters()->create([
                    'title' => $item['title'],
                    'order' => $index,
                    'status' => 'empty',
                ]);
            }

            $this->project->update(['status' => 'draft']);

            event(new ProjectOutlineGenerated($this->project));
        } catch (\Exception $e) {
            Log::error("Failed to generate outline for project {$this->project->id}: ".$e->getMessage());
            $this->project->update(['status' => 'failed']);
        }
    }
}
