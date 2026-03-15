<?php

namespace App\Http\Controllers;

use App\Models\Template;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TemplateController extends Controller
{
    /**
     * Display a listing of templates.
     */
    public function index(Request $request): Response
    {
        $query = Template::query();

        if ($request->has('search')) {
            $query->where('name', 'like', '%'.$request->search.'%')
                ->orWhere('description', 'like', '%'.$request->search.'%');
        }

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        $templates = $query->latest()->paginate(12)->withQueryString()->through(fn ($template) => [
            'id' => $template->id,
            'name' => $template->name,
            'slug' => $template->slug,
            'description' => $template->description,
            'image' => $template->image,
            'category' => $template->category,
            'is_premium' => $template->is_premium,
            'features' => $template->features,
            'is_favorite' => auth()->check() ? auth()->user()->favoriteTemplates()->where('template_id', $template->id)->exists() : false,
        ]);

        return Inertia::render('templates/index', [
            'templates' => $templates,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    /**
     * Display the specified template.
     */
    public function show(Template $template): Response
    {
        return Inertia::render('templates/show', [
            'template' => $template,
        ]);
    }
}
