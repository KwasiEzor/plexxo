<?php

use App\Http\Controllers\ChapterController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectExportController;
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
    Route::post('projects/{project:slug}/invite', [ProjectController::class, 'invite'])->name('projects.invite');
    Route::get('projects/{project:slug}/export/pdf', [ProjectExportController::class, 'pdf'])->name('projects.export-pdf');

    Route::put('chapters/{chapter}', [ChapterController::class, 'update'])->name('chapters.update');
    Route::post('chapters/{chapter}/generate', [ChapterController::class, 'generate'])->name('chapters.generate');
    Route::post('chapters/{chapter}/revise', [ChapterController::class, 'revise'])->name('chapters.revise');

    Route::post('projects/{project:slug}/sources', [\App\Http\Controllers\SourceController::class, 'store'])->name('sources.store');
    Route::delete('sources/{source}', [\App\Http\Controllers\SourceController::class, 'destroy'])->name('sources.destroy');
});

require __DIR__.'/settings.php';
