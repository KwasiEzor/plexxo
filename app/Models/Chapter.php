<?php

namespace App\Models;

use App\Enums\ChapterStatus;
use Database\Factories\ChapterFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * @property ChapterStatus $status
 */
class Chapter extends Model
{
    /** @use HasFactory<ChapterFactory> */
    use HasFactory, LogsActivity;

    /**
     * Get the activity log options.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['title', 'status'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

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
        'status', // empty, draft, generating, revising, revised, translating, translated, finalized, failed
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
            'status' => ChapterStatus::class,
        ];
    }

    /**
     * Get the project that owns the chapter.
     *
     * @return BelongsTo<Project, $this>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get the comments for the chapter.
     *
     * @return HasMany<Comment, $this>
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Get the historical versions for the chapter.
     *
     * @return HasMany<ChapterVersion, $this>
     */
    public function versions(): HasMany
    {
        return $this->hasMany(ChapterVersion::class)->latest();
    }
}
