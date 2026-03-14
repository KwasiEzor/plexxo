<?php

use App\Http\Controllers\ChapterController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectExportController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [ProjectController::class, 'index'])->name('dashboard');
    Route::post('projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::get('projects/{project:slug}', [ProjectController::class, 'show'])->name('projects.show');
    Route::post('projects/{project:slug}/cover', [ProjectController::class, 'updateCover'])->name('projects.update-cover');
    Route::get('projects/{project:slug}/export/pdf', [ProjectExportController::class, 'pdf'])->name('projects.export-pdf');
    
    Route::put('chapters/{chapter}', [ChapterController::class, 'update'])->name('chapters.update');
    Route::post('chapters/{chapter}/generate', [ChapterController::class, 'generate'])->name('chapters.generate');
});

require __DIR__.'/settings.php';
