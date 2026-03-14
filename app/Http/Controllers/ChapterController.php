<?php

namespace App\Http\Controllers;

use App\Jobs\GenerateChapterContent;
use App\Models\Chapter;
use Illuminate\Http\Request;

class ChapterController extends Controller
{
    /**
     * Update the specified chapter in storage.
     */
    public function update(Request $request, Chapter $chapter)
    {
        $this->authorize('update', $chapter->project);

        $request->validate([
            'content' => 'nullable|string',
            'title' => 'nullable|string|max:255',
        ]);

        $chapter->update($request->only('content', 'title'));

        // If content was updated, maybe change status
        if ($request->has('content') && $chapter->status === 'empty') {
            $chapter->update(['status' => 'draft']);
        }

        return back()->with('success', 'Chapitre sauvegardé.');
    }

    /**
     * Trigger AI content generation for the chapter.
     */
    public function generate(Chapter $chapter)
    {
        $this->authorize('update', $chapter->project);

        if ($chapter->status === 'generating') {
            return back()->with('error', 'Génération déjà en cours.');
        }

        GenerateChapterContent::dispatch($chapter);

        return back()->with('success', "L'IA commence à rédiger le chapitre...");
    }
}
