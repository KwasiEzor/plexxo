<?php

namespace App\Models;

use App\Enums\SourceStatus;
use App\Enums\SourceType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

/**
 * @property SourceType $type
 * @property SourceStatus $status
 */
class Source extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'project_id',
        'title',
        'type',
        'content',
        'status',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    #[\Override]
    protected function casts(): array
    {
        return [
            'status' => SourceStatus::class,
            'type' => SourceType::class,
        ];
    }

    /**
     * Get the project that owns the source.
     *
     * @return BelongsTo<Project, $this>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
