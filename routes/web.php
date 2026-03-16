<?php

use App\Http\Controllers\AssistantController;
use App\Http\Controllers\Auth\SocialLoginController;
use App\Http\Controllers\ChapterController;
use App\Http\Controllers\CollaborationController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\MyTemplatesController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectExportController;
use App\Http\Controllers\SourceController;
use App\Http\Controllers\TemplateController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::controller(SocialLoginController::class)->prefix('auth/{provider}')->name('social.')->group(function () {
    Route::get('redirect', 'redirect')->name('redirect');
    Route::get('callback', 'callback')->name('callback');
});

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('dashboard', [ProjectController::class, 'dashboard'])->name('dashboard');
    Route::get('ebooks', [ProjectController::class, 'index'])->name('projects.index');
    Route::get('assistant', [AssistantController::class, 'index'])->name('assistant');
    Route::get('collaborations', [CollaborationController::class, 'index'])->name('collaborations.index');

    Route::get('my-templates', [MyTemplatesController::class, 'index'])->name('my-templates.index');

    Route::prefix('templates')->name('templates.')->group(function () {
        Route::controller(TemplateController::class)->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('{template:slug}', 'show')->name('show');
        });

        Route::controller(MyTemplatesController::class)->group(function () {
            Route::post('{template}/favorite', 'toggleFavorite')->name('favorite');
            Route::post('{template}/archive', 'archive')->name('archive');
            Route::delete('{template}', 'destroy')->name('destroy');
        });
    });

    Route::post('projects/{project:slug}/sources', [SourceController::class, 'store'])->name('sources.store');

    Route::prefix('projects')->name('projects.')->group(function () {
        Route::controller(ProjectController::class)->group(function () {
            Route::post('/', 'store')->name('store');
            Route::get('{project:slug}', 'show')->name('show');
            Route::delete('{project:slug}', 'destroy')->name('destroy');
            Route::post('{project:slug}/cover', 'updateCover')->name('update-cover');
            Route::post('{project:slug}/generate-cover', 'generateCover')->name('generate-cover');
            Route::post('{project:slug}/invite', 'invite')->name('invite');
            Route::delete('{project:slug}/collaborators/{user}', 'removeCollaborator')->name('collaborators.remove');
        });

        Route::controller(ProjectExportController::class)->prefix('{project:slug}')->group(function () {
            Route::get('export/pdf', 'pdf')->name('export-pdf');
            Route::get('export/html', 'html')->name('export-html');
            Route::get('export/epub', 'epub')->name('export-epub');
            Route::post('publish', 'publish')->name('publish');
        });
    });

    Route::controller(ChapterController::class)->prefix('chapters/{chapter}')->name('chapters.')->group(function () {
        Route::put('/', 'update')->name('update');
        Route::post('generate', 'generate')->name('generate');
        Route::post('revise', 'revise')->name('revise');
        Route::post('translate', 'translate')->name('translate');
    });

    Route::controller(CommentController::class)->group(function () {
        Route::post('chapters/{chapter}/comments', 'store')->name('comments.store');
        Route::prefix('comments/{comment}')->name('comments.')->group(function () {
            Route::patch('resolve', 'resolve')->name('resolve');
            Route::delete('/', 'destroy')->name('destroy');
        });
    });

    Route::delete('sources/{source}', [SourceController::class, 'destroy'])->name('sources.destroy');
});

Route::get('invitations/{token}/accept', [InvitationController::class, 'accept'])->name('invitations.accept');

require __DIR__.'/settings.php';
