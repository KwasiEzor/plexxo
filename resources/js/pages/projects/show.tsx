import { Head, usePage, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { show as projectsShow } from '@/actions/App/Http/Controllers/ProjectController';
import { update as chaptersUpdate, generate as chaptersGenerate } from '@/actions/App/Http/Controllers/ChapterController';
import { pdf as projectsExportPdf } from '@/actions/App/Http/Controllers/ProjectExportController';
import type { BreadcrumbItem, Project, Chapter } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CoverManager from '@/components/cover-manager';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
    Book, 
    ChevronLeft, 
    Download,
    ExternalLink,
    FileText, 
    Image as ImageIcon, 
    Languages,
    Loader2, 
    Save, 
    Settings, 
    Sparkles,
    UserCheck
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useEcho, useEchoPresence } from '@laravel/echo-react';
import PresenceAvatars from '@/components/presence-avatars';
import SourceList from '@/components/source-list';

interface ProjectShowProps {
    project: Project;
    cover_url?: string;
}

interface PresenceUser {
    id: number;
    name: string;
}

export default function ProjectShow({ project, cover_url }: ProjectShowProps) {
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
    
    // Listen for real-time presence
    const { channel: presenceChannel } = useEchoPresence(`project.${project.id}`);

    useEffect(() => {
        const channel = presenceChannel();
        
        channel.here((users: PresenceUser[]) => setOnlineUsers(users));
        channel.joining((user: PresenceUser) => setOnlineUsers((prev) => [...prev, user]));
        channel.leaving((user: PresenceUser) => setOnlineUsers((prev) => prev.filter((u) => u.id !== user.id)));
    }, [presenceChannel]);

    // Listen for real-time updates (collaboration / AI generation)
    useEcho(`project.${project.id}`, 'ChapterUpdated', (e: { chapter: Chapter }) => {
        if (activeChapter?.id === e.chapter.id) {
            if (!isSaving) {
                setContent(e.chapter.content || '');
            }
        }
        router.reload({ only: ['project'] });
    });

    const handleSave = () => {
        if (!activeChapter) return;
        setIsSaving(true);
        
        router.put(chaptersUpdate({ chapter: activeChapter.id }), {
            content: content
        }, {
            onFinish: () => setIsSaving(false),
            preserveScroll: true
        });
    };

    const handleGenerate = () => {
        if (!activeChapter) return;
        
        router.post(route('chapters.generate', { chapter: activeChapter.id }), {}, {
            preserveScroll: true,
            onSuccess: () => {
                // The actual content will come via Echo
            }
        });
    };

    const handleRevise = () => {
        if (!activeChapter) return;
        
        router.post(route('chapters.revise', { chapter: activeChapter.id }), {}, {
            preserveScroll: true
        });
    };

    const handleTranslate = (language: string) => {
        if (!activeChapter) return;
        
        router.post(route('chapters.translate', { chapter: activeChapter.id }), {
            language: language
        }, {
            preserveScroll: true
        });
    };

    const handleExport = () => {
        window.open(projectsExportPdf({ project: project.slug }), '_blank');
    };

    const handleExportHtml = () => {
        window.open(route('projects.export-html', { project: project.slug }), '_blank');
    };

    const handlePublish = () => {
        if (confirm('Voulez-vous publier ce projet sur Gumroad ?')) {
            router.post(route('projects.publish', { project: project.slug }));
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
                        <Button variant="ghost" size="icon" title="Paramètres">
                            <Settings className="h-4 w-4" />
                        </Button>
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
                                <span className="truncate flex-1">
                                    {chapter.order + 1}. {chapter.title}
                                </span>
                                {chapter.status === 'generating' && (
                                    <Loader2 className="ml-2 h-3 w-3 animate-spin" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="p-4 border-t bg-background/50 space-y-6">
                        <SourceList project={project} />
                        
                        <div className="space-y-4">
                            <CoverManager project={project} coverUrl={cover_url} />
                            
                            <div className="space-y-2">
                                <Button 
                                    className="w-full justify-start" 
                                    variant="outline" 
                                    onClick={handleGenerate}
                                    disabled={!activeChapter || isGenerating}
                                >
                                    {isGenerating ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="mr-2 h-4 w-4 text-purple-500" />
                                    )}
                                    {isGenerating ? 'IA en cours...' : "Rédiger ce chapitre"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main: Editor */}
                <main className="flex-1 flex flex-col bg-background overflow-hidden">
                    {activeChapter ? (
                        <>
                            <header className="px-6 py-4 border-b flex justify-between items-center">
                                <div>
                                    <h1 className="text-xl font-bold">{activeChapter.title}</h1>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <Badge variant="outline" className="text-[10px] h-5">
                                            {activeChapter.status.toUpperCase()}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground italic">
                                            Dernière modif: {new Date(activeChapter.updated_at).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <PresenceAvatars users={onlineUsers} />
                                    
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

                                    <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
                                        {isSaving ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Save className="mr-2 h-4 w-4" />
                                        )}
                                        Sauvegarder
                                    </Button>
                                    <Button size="sm" onClick={handleExport}>
                                        <Download className="mr-2 h-4 w-4" />
                                        PDF
                                    </Button>

                                    <Button size="sm" variant="outline" onClick={handleExportHtml}>
                                        <FileText className="mr-2 h-4 w-4" />
                                        HTML (SEO)
                                    </Button>

                                    <Button size="sm" variant="secondary" onClick={handlePublish}>
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Publier (Gumroad)
                                    </Button>
                                </div>
                            </header>
                            
                            <div className="flex-1 p-6 overflow-y-auto flex justify-center bg-muted/30">
                                <div className="w-full max-w-3xl bg-background shadow-sm border rounded-lg p-10 min-h-[1000px]">
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Commencez à écrire ici ou laissez l'IA vous aider..."
                                        className="w-full h-full min-h-[800px] resize-none border-none focus:ring-0 text-lg leading-relaxed font-serif outline-none"
                                    />
                                </div>
                            </div>
                        </>
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
