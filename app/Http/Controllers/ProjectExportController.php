<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Services\GumroadService;
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

    /**
     * Export the project as an SEO-optimized HTML file.
     */
    public function html(Project $project)
    {
        $this->authorize('view', $project);

        $project->load(['user', 'chapters' => function ($query): void {
            $query->orderBy('order');
        }]);

        return view('exports.html', ['project' => $project]);
    }

    /**
     * Publish the project to Gumroad.
     */
    public function publish(Project $project, GumroadService $gumroad)
    {
        $this->authorize('update', $project);

        try {
            $product = $gumroad->createProduct($project);
            
            return back()->with('success', "Projet publié sur Gumroad ! ID: {$product['id']}");
        } catch (\Exception $e) {
            return back()->with('error', "Erreur lors de la publication: ".$e->getMessage());
        }
    }
}
