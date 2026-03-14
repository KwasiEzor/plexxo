<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Chapter extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'project_id',
        'title',
        'order',
        'content',
        'status',
    ];

    /**
     * Get the project that owns the chapter.
     *
     * @return BelongsTo<Project, Chapter>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
