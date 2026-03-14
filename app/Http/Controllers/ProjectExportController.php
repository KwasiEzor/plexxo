<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class ProjectExportController extends Controller
{
    /**
     * Export the project as a PDF.
     */
    public function pdf(Project $project)
    {
        $this->authorize('view', $project);

        $project->load(['user', 'chapters' => function ($query) {
            $query->orderBy('order');
        }]);

        $pdf = Pdf::loadView('exports.ebook', compact('project'));

        return $pdf->download($project->slug . '.pdf');
    }
}
