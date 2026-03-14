import { Toaster } from 'sonner';
import NotificationCenter from '@/components/notification-center';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { AppLayoutProps } from '@/types';

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
        <NotificationCenter />
        <Toaster position="top-right" closeButton richColors />
    </AppLayoutTemplate>
);
