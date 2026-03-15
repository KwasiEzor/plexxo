<?php

namespace App\Http\Controllers;

use App\Enums\TemplateStatus;
use App\Models\Template;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MyTemplatesController extends Controller
{
    /**
     * Display a listing of the user's templates.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $status = $request->input('status', 'all');

        $query = Template::query();

        if ($status === 'favorites') {
            $query = $user->favoriteTemplates()->getQuery();
        } else {
            // Only show templates owned by the user unless it's favorites
            $query->where('user_id', $user->id);

            if (in_array($status, array_column(TemplateStatus::cases(), 'value'))) {
                $query->where('status', $status);
            } elseif ($status === 'archives') {
                $query->where('status', TemplateStatus::Archived->value);
            } elseif ($status === 'drafts') {
                $query->where('status', TemplateStatus::Draft->value);
            } elseif ($status === 'completed') {
                $query->where('status', TemplateStatus::Completed->value);
            }
        }

        $templates = $query->with('user')
            ->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(fn ($template) => [
                'id' => $template->id,
                'name' => $template->name,
                'slug' => $template->slug,
                'description' => $template->description,
                'image' => $template->image,
                'category' => $template->category,
                'status' => $template->status->value,
                'is_favorite' => $user->favoriteTemplates()->where('template_id', $template->id)->exists(),
                'created_at' => $template->created_at,
                'updated_at' => $template->updated_at,
            ]);

        return Inertia::render('templates/my-templates', [
            'templates' => $templates,
            'filters' => [
                'status' => $status,
            ],
            'stats' => [
                'total' => $user->templates()->count(),
                'favorites' => $user->favoriteTemplates()->count(),
                'drafts' => $user->templates()->where('status', TemplateStatus::Draft)->count(),
                'completed' => $user->templates()->where('status', TemplateStatus::Completed)->count(),
                'archived' => $user->templates()->where('status', TemplateStatus::Archived)->count(),
            ],
        ]);
    }

    /**
     * Toggle favorite status for a template.
     */
    public function toggleFavorite(Request $request, Template $template)
    {
        $user = $request->user();
        $user->favoriteTemplates()->toggle($template->id);

        return back()->with('success', 'Template favorite status updated.');
    }

    /**
     * Archive a template.
     */
    public function archive(Request $request, Template $template)
    {
        $this->authorize('update', $template);

        $template->update(['status' => TemplateStatus::Archived]);

        return back()->with('success', 'Template archived successfully.');
    }

    /**
     * Delete a template.
     */
    public function destroy(Request $request, Template $template)
    {
        $this->authorize('delete', $template);

        $template->delete();

        return redirect()->route('my-templates.index')
            ->with('success', 'Template deleted successfully.');
    }
}
