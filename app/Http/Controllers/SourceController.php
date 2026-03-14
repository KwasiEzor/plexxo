<?php

namespace App\Http\Controllers;

use App\Enums\SourceStatus;
use App\Enums\SourceType;
use App\Jobs\ProcessSourceDocument;
use App\Models\Project;
use App\Models\Source;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class SourceController extends Controller
{
    /**
     * Store a new source document.
     */
    public function store(Request $request, Project $project)
    {
        Gate::authorize('update', $project);

        $request->validate([
            'file' => 'required|file|mimes:pdf,docx|max:10240', // 10MB
        ]);

        $file = $request->file('file');
        $extension = $file->getClientOriginalExtension();

        $source = $project->sources()->create([
            'title' => $file->getClientOriginalName(),
            'type' => SourceType::from($extension),
            'status' => SourceStatus::Pending,
        ]);

        $source->addMedia($file)->toMediaCollection('sources');

        ProcessSourceDocument::dispatch($source);

        return back()->with('success', 'Document en cours de traitement...');
    }

    /**
     * Remove a source document.
     */
    public function destroy(Source $source)
    {
        Gate::authorize('update', $source->project);

        $source->delete();

        return back()->with('success', 'Document supprimé.');
    }
}
