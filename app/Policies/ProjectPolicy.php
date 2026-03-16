<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Project $project): bool
    {
        return $user->id === $project->user_id ||
               $project->collaborators()->where('user_id', $user->id)->exists();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Project $project): bool
    {
        if ($user->id === $project->user_id) {
            return true;
        }

        $collaborator = $project->collaborators()
            ->where('user_id', $user->id)
            ->first();

        return $collaborator?->pivot->role->canUpdate() ?? false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Project $project): bool
    {
        return $user->id === $project->user_id;
    }

    /**
     * Determine whether the user can invite collaborators.
     */
    public function invite(User $user, Project $project): bool
    {
        if ($user->id === $project->user_id) {
            return true;
        }

        $collaborator = $project->collaborators()
            ->where('user_id', $user->id)
            ->first();

        return $collaborator?->pivot->role->isAdmin() ?? false;
    }

    /**
     * Determine whether the user can remove collaborators.
     */
    public function removeCollaborator(User $user, Project $project, User $target): bool
    {
        // Owner can remove anyone
        if ($user->id === $project->user_id) {
            return true;
        }

        // Admin can remove others, but not the owner
        if ($target->id === $project->user_id) {
            return false;
        }

        $collaborator = $project->collaborators()
            ->where('user_id', $user->id)
            ->first();

        return $collaborator?->pivot->role->isAdmin() ?? false;
    }
}
