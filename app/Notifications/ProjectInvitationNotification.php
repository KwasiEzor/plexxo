<?php

namespace App\Notifications;

use App\Models\ProjectInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProjectInvitationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public ProjectInvitation $invitation) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $acceptUrl = route('invitations.accept', ['token' => $this->invitation->token]);

        return (new MailMessage)
            ->subject('Invitation à rejoindre le projet '.$this->invitation->project->title)
            ->greeting('Bonjour !')
            ->line('Vous avez été invité à rejoindre le projet "'.$this->invitation->project->title.'" en tant qu\' '.$this->invitation->role->label().'.')
            ->line('Plexxo est une forge créative augmentée par l\'IA pour les auteurs.')
            ->action('Accepter l\'invitation', $acceptUrl)
            ->line('Si vous n\'avez pas encore de compte, vous pourrez en créer un après avoir cliqué sur le bouton ci-dessus.')
            ->line('Cette invitation expirera dans 7 jours.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'project_id' => $this->invitation->project_id,
            'role' => $this->invitation->role,
        ];
    }
}
