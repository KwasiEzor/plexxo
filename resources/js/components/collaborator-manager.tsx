import { useForm, router } from '@inertiajs/react';
import { UserPlus, X, Shield, ShieldCheck, ShieldAlert, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Project, User } from '@/types';

interface CollaboratorManagerProps {
    project: Project;
    canInvite: boolean;
}

export default function CollaboratorManager({ project, canInvite }: CollaboratorManagerProps) {
    const [open, setOpen] = useState(false);
    
    const { data, setData, post, processing, reset, errors } = useForm({
        email: '',
        role: 'editor',
    });

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('projects.invite', { project: project.slug }), {
            onSuccess: () => {
                reset('email');
            },
        });
    };

    const handleRemove = (userId: number) => {
        if (confirm('Voulez-vous vraiment retirer ce collaborateur ?')) {
            router.delete(route('projects.collaborators.remove', { 
                project: project.slug, 
                user: userId 
            }));
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return <Badge variant="destructive" className="flex items-center gap-1"><ShieldAlert className="h-3 w-3" /> Admin</Badge>;
            case 'editor':
                return <Badge variant="default" className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Éditeur</Badge>;
            case 'viewer':
                return <Badge variant="secondary" className="flex items-center gap-1"><Shield className="h-3 w-3" /> Lecteur</Badge>;
            default:
                return <Badge variant="outline">{role}</Badge>;
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Collaborateurs
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Gérer les collaborateurs</DialogTitle>
                    <DialogDescription>
                        Invitez des membres à travailler sur "{project.title}" ou gérez les accès existants.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-6">
                    {canInvite && (
                        <form onSubmit={handleInvite} className="space-y-4 p-4 border rounded-lg bg-muted/30">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Inviter un nouveau membre</h4>
                            <div className="flex gap-2">
                                <div className="flex-1 space-y-1">
                                    <Input
                                        placeholder="email@exemple.com"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        type="email"
                                        required
                                    />
                                    {errors.email && <p className="text-[10px] text-destructive">{errors.email}</p>}
                                </div>
                                <Select 
                                    value={data.role} 
                                    onValueChange={(value) => setData('role', value)}
                                >
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Rôle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="editor">Éditeur</SelectItem>
                                        <SelectItem value="viewer">Lecteur</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button type="submit" disabled={processing}>
                                    {processing ? '...' : 'Inviter'}
                                </Button>
                            </div>
                        </form>
                    )}

                    <div className="space-y-3">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Membres actuels</h4>
                        <div className="space-y-3">
                            {/* Owner */}
                            <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>{project.user?.name[0].toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">{project.user?.name} <span className="text-[10px] text-muted-foreground ml-1">(Vous)</span></p>
                                        <p className="text-[10px] text-muted-foreground">{project.user?.email}</p>
                                    </div>
                                </div>
                                <Badge variant="outline">Propriétaire</Badge>
                            </div>

                            {/* Collaborators */}
                            {project.collaborators?.map((collaborator: any) => (
                                <div key={collaborator.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={collaborator.avatar} />
                                            <AvatarFallback>{collaborator.name[0].toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">{collaborator.name}</p>
                                            <p className="text-[10px] text-muted-foreground">{collaborator.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getRoleBadge(collaborator.pivot?.role)}
                                        {canInvite && (
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleRemove(collaborator.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
