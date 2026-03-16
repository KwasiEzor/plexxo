<?php

namespace App\Listeners;

use App\Models\ProjectInvitation;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Session;

class HandleProjectInvitationAfterRegistration
{
    /**
     * Handle the event.
     */
    public function handle(Registered $event): void
    {
        $token = Session::get('project_invitation_token');

        if (! $token) {
            return;
        }

        $invitation = ProjectInvitation::where('token', $token)->first();

        if ($invitation && ! $invitation->hasExpired()) {
            // Join the project
            $invitation->project->collaborators()->syncWithoutDetaching([
                $event->user->id => ['role' => $invitation->role],
            ]);

            $invitation->delete();
            Session::forget('project_invitation_token');
        }
    }
}
