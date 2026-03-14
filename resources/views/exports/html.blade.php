<!DOCTYPE html>
<html lang="{{ $project->language }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $project->title }} | Plexxo Ebook</title>
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="{{ $project->description }}">
    <meta name="author" content="{{ $project->user->name }}">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="book">
    <meta property="og:title" content="{{ $project->title }}">
    <meta property="og:description" content="{{ $project->description }}">
    <meta property="og:site_name" content="Plexxo">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $project->title }}">
    <meta name="twitter:description" content="{{ $project->description }}">

    <style>
        body { font-family: 'Georgia', serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 2rem; }
        h1 { text-align: center; color: #111; margin-bottom: 3rem; }
        h2 { border-bottom: 1px solid #eee; padding-bottom: 0.5rem; margin-top: 3rem; }
        .chapter-content { margin-bottom: 4rem; }
        .meta { text-align: center; color: #666; font-style: italic; margin-bottom: 5rem; }
    </style>
</head>
<body>
    <h1>{{ $project->title }}</h1>
    
    <div class="meta">
        Par {{ $project->user->name }}<br>
        Généré avec Plexxo
    </div>

    @foreach($project->chapters as $chapter)
        <div class="chapter-content">
            <h2>{{ $chapter->title }}</h2>
            {!! nl2br(e($chapter->content)) !!}
        </div>
    @endforeach
</body>
</html>
