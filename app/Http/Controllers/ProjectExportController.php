<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

class ProjectExportController extends Controller
{
    /**
     * Export the project as a PDF.
     */
    public function pdf(Project $project): Response
    {
        $this->authorize('view', $project);

        $project->load(['user', 'chapters' => function ($query): void {
            $query->orderBy('order');
        }]);

        $pdf = Pdf::loadView('exports.ebook', ['project' => $project]);

        return $pdf->download($project->slug.'.pdf');
    }
}
