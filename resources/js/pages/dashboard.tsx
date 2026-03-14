import { Head, usePage, router } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import { useEffect } from 'react';
import CreateProject from '@/components/create-project';
import ProjectCard from '@/components/project-card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, Project } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

interface DashboardProps {
    projects: {
        data: Project[];
        links: any;
    };
}

export default function Dashboard({ projects }: DashboardProps) {
    const { auth } = usePage().props as any;
    const echo = useEcho();

    useEffect(() => {
        if (!echo || !auth.user) {
return;
}

        const channel = echo.private(`user.${auth.user.id}`);
        
        channel.listen('ProjectOutlineGenerated', () => {
            // Reload the page data when a project is generated
            router.reload({ only: ['projects'] });
        });

        return () => {
            channel.stopListening('ProjectOutlineGenerated');
        };
    }, [echo, auth.user]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Vos Projets</h1>
                        <p className="text-muted-foreground">Gérez et créez vos ebooks augmentés par l'IA.</p>
                    </div>
                    <CreateProject />
                </div>

                {projects.data.length === 0 ? (
                    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
                        <div className="rounded-full bg-muted p-4 mb-4">
                            <Head title="Aucun projet" />
                        </div>
                        <h3 className="text-xl font-semibold">Aucun ebook pour le moment</h3>
                        <p className="text-muted-foreground mb-6">Commencez par créer votre premier ebook avec Plexxo.</p>
                        <CreateProject />
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.data.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
