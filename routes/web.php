<?php

use App\Http\Controllers\ChapterController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectExportController;
use App\Http\Controllers\SourceController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('dashboard', [ProjectController::class, 'index'])->name('dashboard');
    Route::post('projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::get('projects/{project:slug}', [ProjectController::class, 'show'])->name('projects.show');
    Route::post('projects/{project:slug}/cover', [ProjectController::class, 'updateCover'])->name('projects.update-cover');
    Route::post('projects/{project:slug}/generate-cover', [ProjectController::class, 'generateCover'])->name('projects.generate-cover');
    Route::post('projects/{project:slug}/invite', [ProjectController::class, 'invite'])->name('projects.invite');
    Route::get('projects/{project:slug}/export/pdf', [ProjectExportController::class, 'pdf'])->name('projects.export-pdf');
    Route::get('projects/{project:slug}/export/html', [ProjectExportController::class, 'html'])->name('projects.export-html');
    Route::get('projects/{project:slug}/export/epub', [ProjectExportController::class, 'epub'])->name('projects.export-epub');
    Route::post('projects/{project:slug}/publish', [ProjectExportController::class, 'publish'])->name('projects.publish');

    Route::put('chapters/{chapter}', [ChapterController::class, 'update'])->name('chapters.update');
    Route::post('chapters/{chapter}/generate', [ChapterController::class, 'generate'])->name('chapters.generate');
    Route::post('chapters/{chapter}/revise', [ChapterController::class, 'revise'])->name('chapters.revise');
    Route::post('chapters/{chapter}/translate', [ChapterController::class, 'translate'])->name('chapters.translate');
    Route::post('chapters/{chapter}/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::patch('comments/{comment}/resolve', [CommentController::class, 'resolve'])->name('comments.resolve');
    Route::delete('comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');

    Route::post('projects/{project:slug}/sources', [SourceController::class, 'store'])->name('sources.store');
    Route::delete('sources/{source}', [SourceController::class, 'destroy'])->name('sources.destroy');
});

require __DIR__.'/settings.php';
