<?php

namespace App\Http\Controllers;

use App\Enums\ProjectStatus;
use App\Enums\UserRole;
use App\Http\Requests\StoreProjectRequest;
use App\Jobs\GenerateProjectOutline;
use App\Models\Chapter;
use App\Models\Project;
use App\Models\Source;
use App\Models\Comment;
use App\Models\User;
use App\Services\AI\ImageGenerator;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\ProjectInvitation;
use App\Notifications\ProjectInvitationNotification;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;

class ProjectController extends Controller
{
    /**
     * Display a listing of the projects.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $projectIds = $user->projects()->pluck('projects.id');

        $projects = Project::query()
            ->whereIn('id', $projectIds)
            ->withCount('chapters')
            ->latest()
            ->paginate(6);

        $stats = [
            'total_projects' => $projectIds->count(),
            'total_chapters' => Chapter::whereIn('project_id', $projectIds)->count(),
            'total_words' => Chapter::whereIn('project_id', $projectIds)
                ->get()
                ->sum(fn ($chapter) => str_word_count($chapter->content ?? '')),
            'ai_tokens_used' => 12500, // Mocked for now
        ];

        $recentActivity = Activity::query()
            ->where(function ($query) use ($projectIds) {
                $query->whereIn('subject_id', $projectIds)
                    ->whereIn('subject_type', [Project::class, Chapter::class, Source::class, Comment::class]);
            })
            ->with('causer')
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn ($activity) => [
                'id' => $activity->id,
                'description' => $activity->description,
                'event' => $activity->event,
                'subject_type' => basename(str_replace('\\', '/', $activity->subject_type)),
                'causer' => $activity->causer ? ['name' => $activity->causer->name] : null,
                'created_at' => $activity->created_at->toDateTimeString(),
            ]);

        $pendingInvitations = ProjectInvitation::where('email', $user->email)
            ->with('project')
            ->get()
            ->filter(fn ($invitation) => ! $invitation->hasExpired())
            ->values();

        return Inertia::render('dashboard', [
            'projects' => $projects,
            'stats' => $stats,
            'recentActivity' => $recentActivity,
            'pendingInvitations' => $pendingInvitations,
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

        $activities = Activity::query()
            ->where(function ($query) use ($project) {
                $query->where(fn ($q) => $q->where('subject_type', Project::class)->where('subject_id', $project->id))
                    ->orWhere(fn ($q) => $q->where('subject_type', Chapter::class)->whereIn('subject_id', $project->chapters()->pluck('id')))
                    ->orWhere(fn ($q) => $q->where('subject_type', Source::class)->whereIn('subject_id', $project->sources()->pluck('id')))
                    ->orWhere(fn ($q) => $q->where('subject_type', Comment::class)->whereIn('subject_id', Comment::whereIn('chapter_id', $project->chapters()->pluck('id'))->pluck('id')));
            })
            ->with('causer')
            ->latest()
            ->limit(20)
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'description' => $activity->description,
                    'subject_type' => basename(str_replace('\\', '/', $activity->subject_type)),
                    'event' => $activity->event,
                    'causer' => $activity->causer ? [
                        'id' => $activity->causer->id,
                        'name' => $activity->causer->name,
                    ] : null,
                    'created_at' => $activity->created_at->toDateTimeString(),
                    'properties' => $activity->properties,
                ];
            });

        return Inertia::render('projects/show', [
            'project' => $project->load([
                'chapters' => fn ($q) => $q->with(['comments' => fn ($cq) => $cq->with('user')->latest()]),
                'sources',
            ])->append('total_word_count'),
            'cover_url' => $project->getFirstMediaUrl('cover'),
            'activities' => $activities,
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
        $this->authorize('invite', $project);

        $request->validate([
            'email' => 'required|email',
            'role' => ['required', Rule::enum(UserRole::class)],
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user) {
            $project->collaborators()->syncWithoutDetaching([
                $user->id => ['role' => $request->role],
            ]);

            return back()->with('success', 'Utilisateur ajouté au projet.');
        }

        // If user doesn't exist, create an invitation
        $invitation = ProjectInvitation::updateOrCreate(
            ['project_id' => $project->id, 'email' => $request->email],
            [
                'role' => $request->role,
                'token' => Str::random(40),
                'expires_at' => now()->addDays(7),
            ]
        );

        Notification::route('mail', $request->email)
            ->notify(new ProjectInvitationNotification($invitation));

        return back()->with('success', 'Invitation envoyée par email.');
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
