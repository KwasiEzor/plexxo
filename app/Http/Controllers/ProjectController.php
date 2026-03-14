<?php

namespace App\Http\Controllers;

use App\Enums\ProjectStatus;
use App\Http\Requests\StoreProjectRequest;
use App\Jobs\GenerateProjectOutline;
use App\Models\Project;
use App\Models\User;
use App\Services\AI\ImageGenerator;
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
            'status' => ProjectStatus::Pending,
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
            'project' => $project->load([
                'chapters' => fn ($q) => $q->with(['comments' => fn ($cq) => $cq->with('user')->latest()]),
                'sources',
            ])->append('total_word_count'),
            'cover_url' => $project->getFirstMediaUrl('cover'),
        ]);
    }

    /**
     * Update the project settings.
     */
    public function update(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'style_guide' => 'nullable|array',
            'settings' => 'nullable|array',
        ]);

        $project->update($request->only('title', 'description', 'style_guide', 'settings'));

        return back()->with('success', 'Paramètres mis à jour !');
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

    /**
     * Generate an AI cover for the project.
     */
    public function generateCover(Project $project, ImageGenerator $generator)
    {
        $this->authorize('update', $project);

        try {
            $imageUrl = $generator->generateCover($project);

            $project->addMediaFromUrl($imageUrl)
                ->toMediaCollection('cover');

            return back()->with('success', 'Couverture générée avec succès !');
        } catch (\Exception $e) {
            return back()->with('error', 'Erreur lors de la génération: '.$e->getMessage());
        }
    }
}
