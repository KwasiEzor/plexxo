<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Models\Project;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;

class AdminController extends Controller
{
    /**
     * Display a listing of platform statistics and management options.
     */
    public function index(): Response
    {
        $this->authorizeAdmin();

        $stats = [
            'total_users' => User::count(),
            'total_projects' => Project::count(),
            'total_chapters' => Chapter::count(),
            'active_subscriptions' => User::whereNotNull('stripe_id')->count(), // Simple proxy for active subs
            'total_tokens_used' => 125000, // Mocked for now, would sum from project_user
        ];

        $recentUsers = User::latest()->limit(5)->get();

        $recentProjects = Project::with('user')->latest()->limit(5)->get()->map(fn ($project) => [
            'id' => $project->id,
            'title' => $project->title,
            'owner' => $project->user->name,
            'created_at' => $project->created_at->toDateTimeString(),
        ]);

        $globalActivity = Activity::with('causer')->latest()->limit(10)->get();

        return Inertia::render('admin/index', [
            'stats' => $stats,
            'recentUsers' => $recentUsers,
            'recentProjects' => $recentProjects,
            'globalActivity' => $globalActivity,
        ]);
    }

    /**
     * Toggle user admin status.
     */
    public function toggleAdmin(User $user)
    {
        $this->authorizeAdmin();

        if ($user->hasRole('admin')) {
            $user->removeRole('admin');
        } else {
            $user->assignRole('admin');
        }

        return back()->with('success', 'Rôle administrateur mis à jour.');
    }

    /**
     * Delete a user.
     */
    public function destroyUser(User $user)
    {
        $this->authorizeAdmin();

        if ($user->id === auth()->id()) {
            return back()->with('error', 'Vous ne pouvez pas vous supprimer vous-même.');
        }

        $user->delete();

        return back()->with('success', 'Utilisateur supprimé.');
    }

    /**
     * Ensure the current user is an admin.
     */
    protected function authorizeAdmin(): void
    {
        if (! auth()->user()->isAdmin()) {
            abort(403, 'Accès réservé aux administrateurs.');
        }
    }
}
