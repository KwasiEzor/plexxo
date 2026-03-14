import { useEchoNotification } from '@laravel/echo-react';
import { toast } from 'sonner';
import { usePage } from '@inertiajs/react';
import { Bell } from 'lucide-react';

export default function NotificationCenter() {
    const { auth } = usePage().props as any;

    if (!auth.user) return null;

    useEchoNotification(`App.Models.User.${auth.user.id}`, (notification: any) => {
        toast(notification.message || 'Nouvelle notification', {
            description: notification.chapter_title || notification.user_name,
            icon: <Bell className="h-4 w-4 text-indigo-500" />,
            action: {
                label: 'Voir',
                onClick: () => {
                    if (notification.project_slug) {
                        window.location.href = `/projects/${notification.project_slug}`;
                    }
                }
            }
        });
    });

    return null;
}
