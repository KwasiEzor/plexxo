import { Head, usePage, router, Link } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import { 
    BookOpen, 
    Plus, 
    Zap, 
    Layout, 
    Clock, 
    ArrowUpRight, 
    Search, 
    ChevronRight,
    Sparkles,
    FileText,
    Users
} from 'lucide-react';
import CreateProject from '@/components/create-project';
import ProjectCard from '@/components/project-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { accept as invitationsAccept } from '@/routes/invitations';
import type { BreadcrumbItem, Project } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tableau de bord',
        href: dashboard().url,
    },
];

interface DashboardProps {
    projects: {
        data: Project[];
        links: any;
    };
    stats: {
        total_projects: number;
        total_chapters: number;
        total_words: number;
        ai_tokens_used: number;
    };
    recentActivity: any[];
    pendingInvitations: any[];
}

export default function Dashboard({ projects, stats, recentActivity, pendingInvitations }: DashboardProps) {
    const { auth } = usePage().props as any;

    useEcho(auth.user ? `user.${auth.user.id}` : null, 'ProjectOutlineGenerated', () => {
        router.reload({ only: ['projects'] });
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tableau de bord" />
            
            <div className="flex-1 space-y-8 p-8 pt-6">
                {/* Hero Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            Bonjour, {auth.user.name} 👋
                        </h2>
                        <p className="text-muted-foreground mt-1">
                            Votre écosystème d'écriture augmentée par l'IA est prêt.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="hidden md:flex">
                            <Search className="mr-2 h-4 w-4" />
                            Rechercher...
                        </Button>
                        <CreateProject />
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="relative overflow-hidden border-none bg-gradient-to-br from-blue-500/10 to-blue-600/5 shadow-sm transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Projets Actifs</CardTitle>
                            <Layout className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_projects}</div>
                            <p className="text-xs text-muted-foreground">+2 depuis la semaine dernière</p>
                            <div className="absolute -bottom-2 -right-2 opacity-5">
                                <Layout className="h-24 w-24" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="relative overflow-hidden border-none bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Chapitres Rédigés</CardTitle>
                            <FileText className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_chapters}</div>
                            <p className="text-xs text-muted-foreground">85% du plan complété</p>
                            <div className="absolute -bottom-2 -right-2 opacity-5">
                                <FileText className="h-24 w-24" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="relative overflow-hidden border-none bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 shadow-sm transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Mots Générés</CardTitle>
                            <Sparkles className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{(stats.total_words / 1000).toFixed(1)}k</div>
                            <p className="text-xs text-muted-foreground">+12k mots cette session</p>
                            <div className="absolute -bottom-2 -right-2 opacity-5">
                                <Sparkles className="h-24 w-24" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="relative overflow-hidden border-none bg-gradient-to-br from-orange-500/10 to-orange-600/5 shadow-sm transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Jetons IA Restants</CardTitle>
                            <Zap className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{(stats.ai_tokens_used / 1000).toFixed(1)}k</div>
                            <p className="text-xs text-muted-foreground">Plan: Premium AI</p>
                            <div className="absolute -bottom-2 -right-2 opacity-5">
                                <Zap className="h-24 w-24" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Invitations Alert */}
                {pendingInvitations.length > 0 && (
                    <div className="grid gap-4">
                        {pendingInvitations.map((invitation) => (
                            <Card key={invitation.id} className="border-primary/20 bg-primary/5 shadow-none">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-full bg-primary/10 p-2">
                                            <Users className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">
                                                Invitation en attente
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Vous avez été invité à rejoindre le projet <span className="font-bold text-foreground">"{invitation.project.title}"</span> en tant qu' <span className="font-bold text-foreground">{invitation.role}</span>.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link 
                                            href={invitationsAccept({ token: invitation.token }).url}
                                            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                                        >
                                            Accepter
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <div className="grid gap-8 md:grid-cols-7">
                    {/* Projects Section */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-primary" />
                                <h3 className="text-xl font-semibold">Projets Récents</h3>
                            </div>
                            <Link href={dashboard().url} className="text-sm font-medium text-primary hover:underline flex items-center">
                                Voir tout <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                        </div>

                        {projects.data.length === 0 ? (
                            <Card className="border-dashed flex min-h-[300px] flex-col items-center justify-center p-8 text-center bg-muted/20">
                                <div className="rounded-full bg-muted p-4 mb-4">
                                    <Plus className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h4 className="text-lg font-semibold">Aucun ebook en cours</h4>
                                <p className="text-muted-foreground mb-6 text-sm max-w-[250px]">
                                    Libérez votre créativité en lançant votre premier projet assisté par IA.
                                </p>
                                <CreateProject />
                            </Card>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2">
                                {projects.data.map((project) => (
                                    <ProjectCard key={project.id} project={project} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Activity Feed Section */}
                    <div className="md:col-span-3 space-y-6">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            <h3 className="text-xl font-semibold">Activité Récente</h3>
                        </div>

                        <Card className="border-none bg-muted/20">
                            <CardContent className="p-0">
                                <div className="divide-y divide-border/50">
                                    {recentActivity.length === 0 ? (
                                        <div className="p-8 text-center text-muted-foreground text-sm">
                                            Aucune activité récente à afficher.
                                        </div>
                                    ) : (
                                        recentActivity.map((activity) => (
                                            <div key={activity.id} className="flex items-start gap-4 p-4 transition-colors hover:bg-muted/40 group">
                                                <div className="mt-1 rounded-full bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                                                    {activity.event === 'created' ? (
                                                        <Plus className="h-4 w-4 text-primary" />
                                                    ) : (
                                                        <ArrowUpRight className="h-4 w-4 text-primary" />
                                                    )}
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-sm font-medium leading-none">
                                                        {activity.causer?.name || 'Système'} a {activity.event === 'created' ? 'créé' : 'mis à jour'} un {activity.subject_type.toLowerCase()}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground italic flex items-center gap-1">
                                                        Il y a {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Special Widget - AI Health */}
                        <Card className="bg-primary text-primary-foreground border-none overflow-hidden group">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center justify-between">
                                    Plexxo AI <Zap className="h-4 w-4" />
                                </CardTitle>
                                <CardDescription className="text-primary-foreground/70">
                                    L'IA est prête pour votre prochain chapitre.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span>Capacité de traitement</span>
                                            <span>98%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                                            <div className="h-full bg-white w-[98%] transition-all group-hover:w-full" />
                                        </div>
                                    </div>
                                    <Button variant="secondary" size="sm" className="w-full bg-white text-primary hover:bg-white/90">
                                        Lancer une idée
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
