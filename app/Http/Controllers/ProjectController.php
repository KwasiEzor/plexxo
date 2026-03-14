<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Jobs\GenerateProjectOutline;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * Display a listing of the projects.
     */
    public function index(Request $request): Response
    {
        $projects = $request->user()->projects()
            ->withCount('chapters')
            ->latest()
            ->paginate(10);

        return Inertia::render('dashboard', [
            'projects' => $projects,
        ]);
    }

    /**
     * Store a newly created project in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        $project = $request->user()->projects()->create([
            'title' => $request->title,
            'language' => $request->language,
            'template_id' => $request->template_id,
            'description' => $request->description,
            'status' => 'pending',
        ]);

        GenerateProjectOutline::dispatch($project);

        return back()->with('success', 'Projet créé ! Génération du plan en cours...');
    }

    /**
     * Display the specified project.
     */
    public function show(Project $project): Response
    {
        $this->authorize('view', $project);

        return Inertia::render('projects/show', [
            'project' => $project->load('chapters'),
            'cover_url' => $project->getFirstMediaUrl('cover'),
        ]);
    }

    /**
     * Update the project cover.
     */
    public function updateCover(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $request->validate([
            'cover' => 'required|image|max:2048', // 2MB max
        ]);

        $project->addMediaFromRequest('cover')
            ->toMediaCollection('cover');

        return back()->with('success', 'Couverture mise à jour !');
    }

    /**
     * Invite a user to the project.
     */
    public function invite(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $request->validate([
            'email' => 'required|email|exists:users,email',
            'role' => 'required|string|in:viewer,editor,admin',
        ]);

        $user = User::where('email', $request->email)->first();

        $project->collaborators()->syncWithoutDetaching([
            $user->id => ['role' => $request->role],
        ]);

        return back()->with('success', 'Utilisateur invité avec succès.');
    }
}
