<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Models\Comment;
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

        $chapter->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $request->content,
        ]);

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
