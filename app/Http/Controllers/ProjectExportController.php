<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Services\GumroadService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Response;
use PHPePub\Core\EPub;

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
    public function html(Project $project): Factory|View
    {
        $this->authorize('view', $project);

        $project->load(['user', 'chapters' => function ($query): void {
            $query->orderBy('order');
        }]);

        return view('exports.html', ['project' => $project]);
    }

    /**
     * Export the project as an EPUB file.
     */
    public function epub(Project $project)
    {
        $this->authorize('view', $project);

        $project->load(['user', 'chapters' => function ($query): void {
            $query->orderBy('order');
        }]);

        $epub = new EPub;

        // Metadata
        $epub->setTitle($project->title);
        $epub->setAuthor($project->user->name, $project->user->name);
        $epub->setLanguage($project->language);
        $epub->setDescription($project->description ?? '');

        // Chapters
        foreach ($project->chapters as $index => $chapter) {
            $content = "<h1>{$chapter->title}</h1>".nl2br(e($chapter->content));
            $epub->addChapter($chapter->title, 'chapter'.($index + 1).'.html', $content);
        }

        // Finalize and Download
        $epub->finalize();

        return response($epub->sendBook($project->slug))
            ->header('Content-Type', 'application/epub+zip')
            ->header('Content-Disposition', 'attachment; filename="'.$project->slug.'.epub"');
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
            return back()->with('error', 'Erreur lors de la publication: '.$e->getMessage());
        }
    }
}
