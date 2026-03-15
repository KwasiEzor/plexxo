<?php

namespace App\Http\Controllers;

use App\Models\ProjectInvitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InvitationController extends Controller
{
    /**
     * Accept a project invitation.
     */
    public function accept(Request $request, string $token)
    {
        $invitation = ProjectInvitation::where('token', $token)->firstOrFail();

        if ($invitation->hasExpired()) {
            $invitation->delete();
            return redirect()->route('home')->with('error', 'Cette invitation a expiré.');
        }

        // If user is already logged in
        if (Auth::check()) {
            $user = Auth::user();

            // Check if email matches (optional, but safer)
            if ($user->email !== $invitation->email) {
                return redirect()->route('dashboard')->with('error', 'Cette invitation est destinée à un autre email.');
            }

            // Join the project
            $invitation->project->collaborators()->syncWithoutDetaching([
                $user->id => ['role' => $invitation->role],
            ]);

            $invitation->delete();

            return redirect()->route('projects.show', $invitation->project->slug)
                ->with('success', 'Vous avez rejoint le projet !');
        }

        // Store invitation token in session for post-registration processing
        session(['project_invitation_token' => $token]);

        return redirect()->route('register', ['email' => $invitation->email])
            ->with('info', 'Veuillez créer un compte pour rejoindre le projet.');
    }
}
