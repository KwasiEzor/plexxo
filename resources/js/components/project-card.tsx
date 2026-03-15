import { Link } from '@inertiajs/react';
import { Book, ChevronRight, Loader2, Calendar } from 'lucide-react';
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
        pending: 'bg-amber-500/10 text-amber-600 border-amber-200 hover:bg-amber-500/20',
        generating: 'bg-blue-500/10 text-blue-600 border-blue-200 hover:bg-blue-500/20',
        draft: 'bg-emerald-500/10 text-emerald-600 border-emerald-200 hover:bg-emerald-500/20',
        finalized: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
        failed: 'bg-rose-500/10 text-rose-600 border-rose-200 hover:bg-rose-500/20',
    };

    const isGenerating = project.status === 'generating' || project.status === 'pending';

    return (
        <Card className="group overflow-hidden border-border/50 transition-all hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <Badge variant="outline" className={`${statusColors[project.status] || ''} font-medium px-2.5 py-0.5 rounded-full transition-colors`}>
                        {isGenerating && <Loader2 className="mr-1.5 h-3 w-3 animate-spin inline" />}
                        {statusLabels[project.status]}
                    </Badge>
                    <Badge variant="secondary" className="bg-muted/50 text-muted-foreground font-mono text-[10px] uppercase tracking-wider">
                        {project.language}
                    </Badge>
                </div>
                <CardTitle className="mt-4 text-xl font-bold tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                    {project.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px] text-sm text-muted-foreground/80 leading-relaxed mt-1">
                    {project.description || 'Pas de description fournie.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                    <div className="flex items-center gap-1.5">
                        <Book className="h-3.5 w-3.5" />
                        <span>{project.chapters_count || 0} chapitres</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(project.updated_at).toLocaleDateString()}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="pt-2">
                <Button 
                    variant={isGenerating ? "ghost" : "default"} 
                    className="w-full group/btn relative overflow-hidden h-10 shadow-sm" 
                    asChild 
                    disabled={isGenerating}
                >
                    <Link href={projectsShow({ project: project.slug })}>
                        <span className="relative z-10 flex items-center justify-center">
                            {isGenerating ? 'Initialisation...' : 'Ouvrir l\'Ebook'}
                            {!isGenerating && <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />}
                        </span>
                        {!isGenerating && <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity" />}
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
