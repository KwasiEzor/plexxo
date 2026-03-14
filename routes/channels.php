<?php

use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('project.{id}', function (User $user, $id) {
    $project = Project::find($id);

    if (! $project) {
        return false;
    }

    if ($user->id === $project->user_id || $project->collaborators()->where('user_id', $user->id)->exists()) {
        return [
            'id' => $user->id,
            'name' => $user->name,
        ];
    }

    return false;
});
