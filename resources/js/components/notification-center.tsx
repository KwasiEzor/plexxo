import { usePage } from '@inertiajs/react';
import { useEchoNotification } from '@laravel/echo-react';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';

export default function NotificationCenter() {
    const { auth } = usePage().props as any;

    useEchoNotification(auth.user ? `App.Models.User.${auth.user.id}` : null, (notification: any) => {
        toast(notification.message || 'Nouvelle notification', {
            description: notification.chapter_title || notification.user_name,
            icon: <Bell className="h-4 w-4 text-blue-500" />,
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

    if (!auth.user) {
        return null;
    }

    return null;
}
