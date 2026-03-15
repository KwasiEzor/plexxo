<?php

namespace App\Http\Controllers;

use App\Models\ProjectInvitation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CollaborationController extends Controller
{
    /**
     * Display projects the user is collaborating on.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Projects where user is a collaborator (not owner)
        $collaborations = $user->collaborations()
            ->withCount('chapters')
            ->latest()
            ->paginate(10);

        $pendingInvitations = ProjectInvitation::where('email', $user->email)
            ->with('project')
            ->get()
            ->filter(fn ($invitation) => ! $invitation->hasExpired())
            ->values();

        return Inertia::render('collaborations/index', [
            'collaborations' => $collaborations,
            'pendingInvitations' => $pendingInvitations,
        ]);
    }
}
