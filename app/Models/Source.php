<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

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
     * Get the project that owns the source.
     *
     * @return BelongsTo<Project, $this>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
