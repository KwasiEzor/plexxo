import { Head, usePage, Link } from '@inertiajs/react';
import { 
    Users, 
    BookOpen, 
    ArrowRight, 
    Clock, 
    Shield, 
    Mail, 
    CheckCircle2,
    Plus
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ProjectCard from '@/components/project-card';
import type { BreadcrumbItem, Project } from '@/types';

interface CollaborationPageProps {
    collaborations: {
        data: Project[];
        links: any;
    };
    pendingInvitations: any[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Collaborations', href: '/collaborations' },
];

export default function CollaborationIndex({ collaborations, pendingInvitations }: CollaborationPageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Collaborations" />
            
            <div className="flex-1 space-y-8 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Collaborations</h2>
                        <p className="text-muted-foreground mt-1">
                            Gérez les projets auxquels vous participez en tant qu'invité.
                        </p>
                    </div>
                </div>

                {/* Pending Invitations Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-semibold">Invitations en attente</h3>
                    </div>

                    {pendingInvitations.length === 0 ? (
                        <Card className="border-dashed bg-muted/20">
                            <CardContent className="py-10 text-center">
                                <p className="text-muted-foreground italic">Vous n'avez aucune invitation en attente.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {pendingInvitations.map((invitation) => (
                                <Card key={invitation.id} className="border-primary/20 bg-primary/5">
                                    <CardContent className="flex items-center justify-between p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="rounded-full bg-primary/10 p-3">
                                                <Users className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg">{invitation.project.title}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className="bg-background">
                                                        Rôle: {invitation.role}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">•</span>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Clock className="h-3 w-3" /> Expire dans 7 jours
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button asChild>
                                            <Link href={route('invitations.accept', { token: invitation.token })}>
                                                Accepter l'invitation
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Collaborative Projects Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-semibold">Projets Partagés</h3>
                    </div>

                    {collaborations.data.length === 0 ? (
                        <Card className="border-dashed bg-muted/20">
                            <CardContent className="py-10 text-center">
                                <div className="max-w-[300px] mx-auto space-y-4">
                                    <Users className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                                    <p className="text-muted-foreground">Vous n'êtes actuellement collaborateur sur aucun projet.</p>
                                    <p className="text-xs text-muted-foreground">Demandez à un propriétaire de projet de vous inviter avec votre adresse email.</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {collaborations.data.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
