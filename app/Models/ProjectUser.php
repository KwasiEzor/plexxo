<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * @property UserRole $role
 */
class ProjectUser extends Pivot
{
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    #[\Override]
    protected function casts(): array
    {
        return [
            'role' => UserRole::class,
            'token_quota' => 'integer',
            'token_used' => 'integer',
        ];
    }
}
