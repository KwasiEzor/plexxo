<?php

namespace App\Models;

use App\Enums\TemplateStatus;
use Database\Factories\TemplateFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Template extends Model
{
    /** @use HasFactory<TemplateFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'description',
        'image',
        'features',
        'category',
        'is_premium',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'is_premium' => 'boolean',
            'status' => TemplateStatus::class,
        ];
    }

    /**
     * Get the user that owns the template.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the users who have favorited this template.
     */
    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'template_user')
            ->withTimestamps();
    }
}
