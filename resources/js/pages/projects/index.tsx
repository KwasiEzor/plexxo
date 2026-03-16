import { Head, Link } from '@inertiajs/react';
import { 
    BookOpen, 
    Plus, 
    Search, 
    ChevronLeft, 
    ChevronRight,
    Library
} from 'lucide-react';
import { useState } from 'react';
import CreateProject from '@/components/create-project';
import ProjectCard from '@/components/project-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Project, PaginatedResponse } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tableau de bord',
        href: '/dashboard',
    },
    {
        title: 'Mes Ebooks',
        href: '/ebooks',
    },
];

interface ProjectsIndexProps {
    projects: PaginatedResponse<Project>;
}

export default function ProjectsIndex({ projects }: ProjectsIndexProps) {
    const [search, setSearch] = useState('');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mes Ebooks" />
            
            <div className="flex-1 space-y-8 p-8 pt-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <Library className="h-8 w-8 text-primary" />
                            Mes Ebooks
                        </h2>
                        <p className="text-muted-foreground mt-1">
                            Gérez l'ensemble de vos projets de rédaction.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative group w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input 
                                placeholder="Rechercher un projet..." 
                                className="pl-10 h-10 bg-card/50"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <CreateProject />
                    </div>
                </div>

                {projects.data.length === 0 ? (
                    <Card className="border-dashed flex min-h-[400px] flex-col items-center justify-center p-8 text-center bg-muted/20">
                        <div className="rounded-full bg-muted p-4 mb-4">
                            <BookOpen className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h4 className="text-xl font-semibold">Aucun ebook trouvé</h4>
                        <p className="text-muted-foreground mb-6 text-sm max-w-sm">
                            Vous n'avez pas encore de projet ou aucun ne correspond à votre recherche.
                        </p>
                        <CreateProject />
                    </Card>
                ) : (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {projects.data.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {projects.last_page > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={projects.current_page === 1}
                                    asChild
                                >
                                    <Link href={projects.prev_page_url || '#'}>
                                        <ChevronLeft className="h-4 w-4" />
                                    </Link>
                                </Button>
                                
                                <div className="flex items-center gap-1">
                                    {projects.links.filter(link => !isNaN(Number(link.label))).map((link) => (
                                        <Button
                                            key={link.label}
                                            variant={link.active ? "default" : "ghost"}
                                            size="sm"
                                            className="w-9 h-9"
                                            asChild
                                        >
                                            <Link href={link.url || '#'}>
                                                {link.label}
                                            </Link>
                                        </Button>
                                    ))}
                                </div>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={projects.current_page === projects.last_page}
                                    asChild
                                >
                                    <Link href={projects.next_page_url || '#'}>
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
}
