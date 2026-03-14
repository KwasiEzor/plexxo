<?php

namespace App\Jobs;

use App\Models\Source;
use App\Services\AI\DocumentExtractor;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessSourceDocument implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public Source $source)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(DocumentExtractor $extractor): void
    {
        $this->source->update(['status' => 'processing']);

        try {
            $media = $this->source->getFirstMedia('sources');
            
            if (!$media) {
                throw new Exception("Media not found for source #{$this->source->id}");
            }

            $content = $extractor->extract($media->getPath(), $this->source->type);

            $this->source->update([
                'content' => $content,
                'status' => 'completed',
            ]);
        } catch (Exception $e) {
            $this->source->update(['status' => 'failed']);
            throw $e;
        }
    }
}
