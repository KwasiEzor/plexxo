<!DOCTYPE html>
<html lang="{{ $project->language }}">
<head>
    <meta charset="UTF-8">
    <title>{{ $project->title }}</title>
    <style>
        body { 
            font-family: 'DejaVu Sans', sans-serif; 
            line-height: {{ $project->settings['line_height'] ?? '1.6' }}; 
            font-size: {{ $project->settings['font_size'] ?? '12pt' }};
        }
        .page-break { page-break-after: always; }
        .cover { text-align: center; margin-top: 100px; }
        .cover h1 { font-size: 40px; margin-bottom: 20px; }
        .cover h2 { font-size: 24px; color: #666; }
        .chapter-title { font-size: 28px; margin-top: 40px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
        .chapter-content { margin-top: 20px; text-align: justify; }
    </style>
</head>
<body>
    <div class="cover">
        @if($project->hasMedia('cover'))
            <img src="{{ $project->getFirstMedia('cover')->getPath() }}" style="max-width: 300px; margin-bottom: 30px;">
        @endif
        <h1>{{ $project->title }}</h1>
        <h2>{{ $project->user->name }}</h2>
        <p>{{ $project->description }}</p>
    </div>

    <div class="page-break"></div>

    @foreach($project->chapters as $chapter)
        <div class="chapter">
            <h1 class="chapter-title">{{ $chapter->order + 1 }}. {{ $chapter->title }}</h1>
            <div class="chapter-content">
                {!! nl2br(e($chapter->content)) !!}
            </div>
        </div>
        @if(!$loop->last)
            <div class="page-break"></div>
        @endif
    @endforeach
</body>
</html>
