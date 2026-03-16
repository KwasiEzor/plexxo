<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Models\ChapterVersion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChapterVersionController extends Controller
{
    /**
     * Store a new version of the chapter content.
     */
    public function store(Request $request, Chapter $chapter)
    {
        $this->authorize('update', $chapter->project);

        $request->validate([
            'version_name' => 'nullable|string|max:255',
        ]);

        $chapter->versions()->create([
            'user_id' => auth()->id(),
            'content' => $chapter->content,
            'version_name' => $request->version_name ?? 'Manuel '.now()->format('d/m/Y H:i'),
        ]);

        return back()->with('success', 'Version enregistrée avec succès.');
    }

    /**
     * Rollback the chapter to a specific version.
     */
    public function rollback(Request $request, Chapter $chapter, ChapterVersion $version)
    {
        $this->authorize('update', $chapter->project);

        if ($version->chapter_id !== $chapter->id) {
            abort(403);
        }

        DB::transaction(function () use ($chapter, $version) {
            // Create a backup of the current state before rolling back
            $chapter->versions()->create([
                'user_id' => auth()->id(),
                'content' => $chapter->content,
                'version_name' => 'Auto-sauvegarde avant rollback ('.now()->format('H:i').')',
            ]);

            // Update the chapter with the version content
            $chapter->update([
                'content' => $version->content,
            ]);
        });

        return back()->with('success', 'Chapitre restauré à la version du '.$version->created_at->format('d/m/Y H:i'));
    }

    /**
     * Delete a specific version.
     */
    public function destroy(Chapter $chapter, ChapterVersion $version)
    {
        $this->authorize('update', $chapter->project);

        if ($version->chapter_id !== $chapter->id) {
            abort(403);
        }

        $version->delete();

        return back()->with('success', 'Version supprimée.');
    }
}
