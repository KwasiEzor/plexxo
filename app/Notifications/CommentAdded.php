<?php

namespace App\Notifications;

use App\Models\Comment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CommentAdded extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Comment $comment) {}

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Nouveau commentaire sur Plexxo')
            ->line("{$this->comment->user->name} a commenté le chapitre '{$this->comment->chapter->title}'.")
            ->action('Voir le commentaire', route('projects.show', $this->comment->chapter->project->slug))
            ->line('Merci d\'utiliser notre application !');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'comment_id' => $this->comment->id,
            'user_name' => $this->comment->user->name,
            'chapter_title' => $this->comment->chapter->title,
            'project_slug' => $this->comment->chapter->project->slug,
            'message' => "Nouveau commentaire de {$this->comment->user->name}",
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }
}
