import { Link } from '@inertiajs/react';
import { Book, ChevronRight, Loader2 } from 'lucide-react';
import { show as projectsShow } from '@/actions/App/Http/Controllers/ProjectController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Project } from '@/types';

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const statusLabels: Record<string, string> = {
        pending: 'En attente',
        generating: 'Génération...',
        draft: 'Brouillon',
        finalized: 'Finalisé',
        failed: 'Échec',
    };

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-500',
        generating: 'bg-blue-500',
        draft: 'bg-green-500',
        finalized: 'bg-purple-500',
        failed: 'bg-red-500',
    };

    const isGenerating = project.status === 'generating' || project.status === 'pending';

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <Badge className={statusColors[project.status] || 'bg-gray-500'}>
                        {isGenerating && <Loader2 className="mr-1 h-3 w-3 animate-spin inline" />}
                        {statusLabels[project.status]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{project.language.toUpperCase()}</span>
                </div>
                <CardTitle className="mt-2 line-clamp-1">{project.title}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">
                    {project.description || 'Pas de description.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                    <Book className="mr-2 h-4 w-4" />
                    {project.chapters_count || 0} chapitres
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full" asChild disabled={isGenerating}>
                    <Link href={projectsShow({ project: project.slug })}>
                        {isGenerating ? 'Veuillez patienter...' : 'Ouvrir'}
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
