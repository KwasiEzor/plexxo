<?php

namespace App\Notifications;

use App\Models\Chapter;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ChapterGenerated extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Chapter $chapter) {}

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Chapitre généré avec succès')
            ->line("Le chapitre '{$this->chapter->title}' de votre projet '{$this->chapter->project->title}' a été généré par l'IA.")
            ->action('Voir le chapitre', route('projects.show', $this->chapter->project->slug))
            ->line('Merci d\'utiliser Plexxo !');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'chapter_id' => $this->chapter->id,
            'chapter_title' => $this->chapter->title,
            'project_title' => $this->chapter->project->title,
            'project_slug' => $this->chapter->project->slug,
            'message' => "Le chapitre '{$this->chapter->title}' est prêt !",
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }
}
