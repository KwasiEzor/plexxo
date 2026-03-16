import { Head, router, usePage } from '@inertiajs/react';
import { useEcho, useEchoPresence } from '@laravel/echo-react';
import { 
    Book, 
    Download,
    ExternalLink,
    FileText, 
    Languages,
    Loader2, 
    Save, 
    Settings, 
    Sparkles,
    UserCheck
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { update as chaptersUpdate } from '@/actions/App/Http/Controllers/ChapterController';
import { show as projectsShow } from '@/actions/App/Http/Controllers/ProjectController';
import { pdf as projectsExportPdf } from '@/actions/App/Http/Controllers/ProjectExportController';
import { generate, revise, translate } from '@/routes/chapters';
import { exportHtml, exportEpub, publish as projectsPublish } from '@/routes/projects';
import CommentSidebar from '@/components/comment-sidebar';
import CollaboratorManager from '@/components/collaborator-manager';
import CoverManager from '@/components/cover-manager';
import ExportSettingsModal from '@/components/export-settings-modal';
import PresenceAvatars from '@/components/presence-avatars';
import ProjectActivityFeed from '@/components/project-activity-feed';
import ProjectStats from '@/components/project-stats';
import SourceList from '@/components/source-list';
import StyleGuideModal from '@/components/style-guide-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Project, Chapter } from '@/types';

interface ProjectShowProps {
    project: Project;
    cover_url?: string;
    activities: any[];
    auth: {
        user: any;
        can: {
            update_project: boolean;
            delete_project: boolean;
            invite_collaborators: boolean;
        };
    };
}

interface PresenceUser {
    id: number;
    name: string;
}

export default function ProjectShow({ project, cover_url, activities, auth }: ProjectShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: project.title, href: projectsShow({ project: project.slug }) },
    ];

    const [activeChapter, setActiveChapter] = useState<Chapter | null>(
        project.chapters.length > 0 ? project.chapters[0] : null
    );
    const [content, setContent] = useState(activeChapter?.content || '');
    const [isSaving, setIsSaving] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);
    const [typingUsers, setTypingUsers] = useState<Record<number, string>>({});
    const [viewingChapters, setViewingChapters] = useState<Record<number, number>>({});
    const [sidebarTab, setSidebarTab] = useState<'comments' | 'activity'>('comments');
    
    // Listen for real-time presence
    const { channel: presenceChannel } = useEchoPresence(`project.${project.id}`);

    useEffect(() => {
        const channel = presenceChannel();

        if (!channel) {
            return;
        }
        
        channel.here((users: PresenceUser[]) => {
            setOnlineUsers(users);
        });
        
        channel.joining((user: PresenceUser) => {
            setOnlineUsers((prev) => [...prev, user]);
        });
        
        channel.leaving((user: PresenceUser) => {
            setOnlineUsers((prev) => prev.filter((u) => u.id !== user.id));
            setTypingUsers((prev) => {
                const next = { ...prev };
                delete next[user.id];
                return next;
            });
            setViewingChapters((prev) => {
                const next = { ...prev };
                delete next[user.id];
                return next;
            });
        });

        // Listen for typing whisper
        channel.listenForWhisper('typing', (e: { id: number; name: string; chapter_id: number }) => {
            setTypingUsers((prev) => ({
                ...prev,
                [e.id]: e.name
            }));

            // Clear typing after 3 seconds
            setTimeout(() => {
                setTypingUsers((prev) => {
                    const next = { ...prev };
                    delete next[e.id];
                    return next;
                });
            }, 3000);
        });

        // Listen for viewing whisper
        channel.listenForWhisper('viewing', (e: { id: number; name: string; chapter_id: number }) => {
            setViewingChapters((prev) => ({
                ...prev,
                [e.id]: e.chapter_id
            }));
        });

        // Initial whisper of what we are viewing
        if (activeChapter) {
            channel.whisper('viewing', {
                id: (usePage().props as any).auth.user.id,
                name: (usePage().props as any).auth.user.name,
                chapter_id: activeChapter.id
            });
        }
    }, [presenceChannel, activeChapter?.id]);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);
        
        // Whisper typing
        const channel = presenceChannel();
        if (channel && activeChapter && auth.can.update_project) {
            channel.whisper('typing', {
                id: (usePage().props as any).auth.user.id,
                name: (usePage().props as any).auth.user.name,
                chapter_id: activeChapter.id
            });
        }
    };

    // Listen for real-time updates (collaboration / AI generation)
    useEcho(`project.${project.id}`, 'ChapterUpdated', (e: { chapter: Chapter }) => {
        if (activeChapter?.id === e.chapter.id) {
            if (!isSaving) {
                setContent(e.chapter.content || '');
            }
        }

        router.reload({ only: ['project', 'activities'] });
    });

    const handleSave = () => {
        if (!activeChapter || !auth.can.update_project) {
            return;
        }

        setIsSaving(true);
        
        router.put(chaptersUpdate({ chapter: activeChapter.id }), {
            content: content
        }, {
            onFinish: () => setIsSaving(false),
            preserveScroll: true
        });
    };

    const handleGenerate = () => {
        if (!activeChapter || !auth.can.update_project) {
            return;
        }
        
        router.post(generate({ chapter: activeChapter.id }).url, {}, {
            preserveScroll: true,
            onSuccess: () => {
                // The actual content will come via Echo
            }
        });
    };

    const handleRevise = () => {
        if (!activeChapter || !auth.can.update_project) {
            return;
        }
        
        router.post(revise({ chapter: activeChapter.id }).url, {}, {
            preserveScroll: true
        });
    };

    const handleTranslate = (language: string) => {
        if (!activeChapter || !auth.can.update_project) {
            return;
        }
        
        router.post(translate({ chapter: activeChapter.id }).url, {
            language: language
        }, {
            preserveScroll: true
        });
    };

    const handleExport = () => {
        window.open(projectsExportPdf({ project: project.slug }), '_blank');
    };

    const handleExportHtml = () => {
        window.open(exportHtml({ project: project.slug }).url, '_blank');
    };

    const handleExportEpub = () => {
        window.open(exportEpub({ project: project.slug }).url, '_blank');
    };

    const handlePublish = () => {
        if (!auth.can.update_project) return;

        if (confirm('Voulez-vous publier ce projet sur Gumroad ?')) {
            router.post(projectsPublish({ project: project.slug }).url);
        }
    };

    const isGenerating = activeChapter?.status === 'generating';

    const chapters = project.chapters || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={project.title} />
            
            <div className="flex h-[calc(100vh-64px)] flex-col lg:flex-row overflow-hidden">
                {/* Sidebar: Chapters & Plan */}
                <aside className="w-full lg:w-80 border-r bg-sidebar flex flex-col">
                    <div className="p-4 border-b flex justify-between items-center bg-background/50">
                        <h2 className="font-semibold flex items-center">
                            <Book className="mr-2 h-4 w-4" />
                            Plan du livre
                        </h2>
                        <div className="flex items-center">
                            <StyleGuideModal project={project} />
                            {auth.can.update_project && (
                                <Button variant="ghost" size="icon" title="Paramètres">
                                    <Settings className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {chapters.map((chapter) => (
                            <button
                                key={chapter.id}
                                onClick={() => setActiveChapter(chapter)}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                                    activeChapter?.id === chapter.id 
                                    ? 'bg-primary text-primary-foreground shadow-sm' 
                                    : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                }`}
                            >
                                <div className="flex items-center flex-1 min-w-0">
                                    <span className="truncate">
                                        {chapter.order + 1}. {chapter.title}
                                    </span>
                                    {Object.entries(viewingChapters).filter(([uid, cid]) => cid === chapter.id && Number(uid) !== (usePage().props as any).auth.user.id).length > 0 && (
                                        <div className="flex -space-x-1 ml-2 overflow-hidden">
                                            {Object.entries(viewingChapters)
                                                .filter(([uid, cid]) => cid === chapter.id && Number(uid) !== (usePage().props as any).auth.user.id)
                                                .map(([uid, cid]) => (
                                                    <div key={uid} className="h-4 w-4 rounded-full bg-primary/20 border border-background flex items-center justify-center text-[6px] font-bold">
                                                        {onlineUsers.find(u => u.id === Number(uid))?.name[0].toUpperCase() || '?'}
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </div>
                                {chapter.status === 'generating' && (
                                    <Loader2 className="ml-2 h-3 w-3 animate-spin" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="p-4 border-t bg-background/50 space-y-6">
                        <SourceList project={project} />
                        
                        <div className="space-y-4">
                            {auth.can.update_project && (
                                <CoverManager project={project} coverUrl={cover_url} />
                            )}
                            
                            <div className="space-y-2">
                                {auth.can.update_project && (
                                    <Button 
                                        className="w-full justify-start" 
                                        variant="outline" 
                                        onClick={handleGenerate}
                                        disabled={!activeChapter || isGenerating}
                                    >
                                        {isGenerating ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Sparkles className="mr-2 h-4 w-4 text-primary" />
                                        )}
                                        {isGenerating ? 'IA en cours...' : "Rédiger ce chapitre"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main: Editor */}
                <main className="flex-1 flex flex-col bg-background overflow-hidden">
                    {activeChapter ? (
                        <div className="flex-1 flex overflow-hidden">
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <header className="px-6 py-4 border-b flex justify-between items-center">
                                <div>
                                    <h1 className="text-xl font-bold">{activeChapter.title}</h1>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <Badge variant="outline" className="text-[10px] h-5">
                                            {activeChapter.status.toUpperCase()}
                                        </Badge>
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                            {content.split(/\s+/).filter(Boolean).length} mots
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">•</span>
                                        <span className="text-[10px] text-muted-foreground italic">
                                            Dernière modif: {new Date(activeChapter.updated_at).toLocaleTimeString()}
                                        </span>
                                        {Object.entries(typingUsers).filter(([uid, name]) => Number(uid) !== (usePage().props as any).auth.user.id).map(([uid, name]) => (
                                            <div key={uid} className="flex items-center gap-1.5 ml-4">
                                                <div className="flex gap-0.5">
                                                    <span className="h-1 w-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                    <span className="h-1 w-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                    <span className="h-1 w-1 bg-primary rounded-full animate-bounce"></span>
                                                </div>
                                                <span className="text-[10px] font-medium text-primary animate-pulse">{name} écrit...</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CollaboratorManager project={project} canInvite={auth.can.invite_collaborators} />
                                    <PresenceAvatars users={onlineUsers} />
                                    
                                    <ExportSettingsModal project={project} />

                                    {auth.can.update_project && (
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={handleRevise} 
                                            disabled={!content || activeChapter.status === 'revising'}
                                            title="Lancer l'Agent Réviseur pour améliorer le style et corriger les fautes"
                                        >
                                            {activeChapter.status === 'revising' ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <UserCheck className="mr-2 h-4 w-4 text-blue-500" />
                                            )}
                                            {activeChapter.status === 'revising' ? 'Révision...' : 'Réviser (IA)'}
                                        </Button>
                                    )}

                                    {auth.can.update_project && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    disabled={!content || activeChapter.status === 'translating'}
                                                    title="Traduire le contenu dans une autre langue"
                                                >
                                                    {activeChapter.status === 'translating' ? (
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Languages className="mr-2 h-4 w-4 text-green-500" />
                                                    )}
                                                    {activeChapter.status === 'translating' ? 'Traduction...' : 'Traduire'}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleTranslate('Anglais')}>
                                                    Anglais
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleTranslate('Espagnol')}>
                                                    Espagnol
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleTranslate('Allemand')}>
                                                    Allemand
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleTranslate('Italien')}>
                                                    Italien
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}

                                    {auth.can.update_project && (
                                        <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
                                            {isSaving ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <Save className="mr-2 h-4 w-4" />
                                            )}
                                            Sauvegarder
                                        </Button>
                                    )}
                                    <Button size="sm" onClick={handleExport}>
                                        <Download className="mr-2 h-4 w-4" />
                                        PDF
                                    </Button>

                                    <Button size="sm" variant="outline" onClick={handleExportHtml}>
                                        <FileText className="mr-2 h-4 w-4" />
                                        HTML
                                    </Button>

                                    <Button size="sm" variant="outline" onClick={handleExportEpub}>
                                        <Book className="mr-2 h-4 w-4" />
                                        EPUB
                                    </Button>

                                    {auth.can.update_project && (
                                        <Button size="sm" variant="secondary" onClick={handlePublish}>
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            Publier (Gumroad)
                                        </Button>
                                    )}
                                </div>
                                </header>
                                
                                <div className="flex-1 p-6 overflow-y-auto flex flex-col items-center bg-muted/30">
                                    <div className="w-full max-w-3xl">
                                        <ProjectStats project={project} />
                                        <div className="w-full bg-background shadow-sm border rounded-lg p-10 min-h-[1000px]">
                                            <textarea
                                                value={content}
                                                onChange={handleContentChange}
                                                placeholder={auth.can.update_project ? "Commencez à écrire ici ou laissez l'IA vous aider..." : "Contenu en lecture seule..."}
                                                className="w-full h-full min-h-[800px] resize-none border-none focus:ring-0 text-lg leading-relaxed font-serif outline-none"
                                                readOnly={!auth.can.update_project}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <aside className="w-80 border-l bg-sidebar flex flex-col hidden xl:flex overflow-hidden">
                                <div className="grid grid-cols-2 p-1 bg-muted/50 border-b">
                                    <button 
                                        onClick={() => setSidebarTab('comments')}
                                        className={`py-2 text-[10px] uppercase font-bold tracking-widest rounded-md transition-all ${
                                            sidebarTab === 'comments' 
                                            ? 'bg-background shadow-sm text-primary' 
                                            : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        Commentaires
                                    </button>
                                    <button 
                                        onClick={() => setSidebarTab('activity')}
                                        className={`py-2 text-[10px] uppercase font-bold tracking-widest rounded-md transition-all ${
                                            sidebarTab === 'activity' 
                                            ? 'bg-background shadow-sm text-primary' 
                                            : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        Activité
                                    </button>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    {sidebarTab === 'comments' ? (
                                        <CommentSidebar chapter={activeChapter} hideHeader={true} canUpdate={auth.can.update_project} />
                                    ) : (
                                        <ProjectActivityFeed activities={activities} />
                                    )}
                                </div>
                            </aside>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold">Aucun chapitre sélectionné</h3>
                            <p className="text-muted-foreground">Choisissez un chapitre dans le plan pour commencer l'édition.</p>
                        </div>
                    )}
                </main>
            </div>
        </AppLayout>
    );
}
