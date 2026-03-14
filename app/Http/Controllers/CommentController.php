<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Models\Comment;
use App\Notifications\CommentAdded;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CommentController extends Controller
{
    /**
     * Store a new comment.
     */
    public function store(Request $request, Chapter $chapter)
    {
        Gate::authorize('view', $chapter->project);

        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment = $chapter->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $request->content,
        ]);

        // Notify other collaborators
        $project = $chapter->project;
        $usersToNotify = $project->collaborators
            ->push($project->user)
            ->unique('id')
            ->filter(fn ($u): bool => $u->id !== auth()->id());

        foreach ($usersToNotify as $user) {
            $user->notify(new CommentAdded($comment));
        }

        return back()->with('success', 'Commentaire ajouté.');
    }

    /**
     * Resolve a comment.
     */
    public function resolve(Comment $comment)
    {
        Gate::authorize('update', $comment->chapter->project);

        $comment->update(['is_resolved' => true]);

        return back()->with('success', 'Commentaire résolu.');
    }

    /**
     * Delete a comment.
     */
    public function destroy(Comment $comment)
    {
        if (auth()->id() !== $comment->user_id) {
            Gate::authorize('update', $comment->chapter->project);
        }

        $comment->delete();

        return back()->with('success', 'Commentaire supprimé.');
    }
}
