import { Head, Link, router } from '@inertiajs/react';
import { 
    Bookmark, 
    Archive, 
    FileEdit, 
    CheckCircle2, 
    Trash2, 
    MoreVertical,
    Star,
    ArrowRight,
    Search,
    ChevronLeft,
    ChevronRight,
    LayoutGrid,
    Clock,
    Plus
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { index as myTemplatesRoute } from '@/routes/my-templates';
import { index as templatesLibraryRoute } from '@/routes/templates';
import { show as templatesShow, favorite as templatesFavorite, archive as templatesArchive, destroy as templatesDestroy } from '@/routes/templates';
import type { BreadcrumbItem, Template, PaginatedResponse } from '@/types';
import { useDebounce } from '@/hooks/use-debounce';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mes Modèles',
        href: '/my-templates',
    },
];

interface MyTemplatesProps {
    templates: PaginatedResponse<Template>;
    filters: {
        status?: string;
    };
    stats: {
        total: number;
        favorites: number;
        drafts: number;
        completed: number;
        archived: number;
    };
}

export default function MyTemplates({ templates, filters, stats }: MyTemplatesProps) {
    const [status, setStatus] = useState(filters.status || 'all');
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);

    const updateFilters = useCallback(() => {
        router.get(myTemplatesRoute(), {
            status: status !== 'all' ? status : undefined,
            search: debouncedSearch || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, [status, debouncedSearch]);

    useEffect(() => {
        if (status !== filters.status) {
            updateFilters();
        }
    }, [status]);

    const handleToggleFavorite = (id: number) => {
        router.post(templatesFavorite({ template: id }), {}, {
            preserveScroll: true,
        });
    };

    const handleArchive = (id: number) => {
        router.post(templatesArchive({ template: id }), {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce modèle ?')) {
            router.delete(templatesDestroy({ template: id }), {
                preserveScroll: true,
            });
        }
    };

    const tabs = [
        { id: 'all', label: 'Tous', icon: LayoutGrid, count: stats.total },
        { id: 'favorites', label: 'Favoris', icon: Star, count: stats.favorites },
        { id: 'drafts', label: 'Brouillons', icon: FileEdit, count: stats.drafts },
        { id: 'completed', label: 'Terminés', icon: CheckCircle2, count: stats.completed },
        { id: 'archives', label: 'Archives', icon: Archive, count: stats.archived },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mes Modèles" />
            
            <div className="max-w-7xl mx-auto p-4 md:p-8 pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="max-w-2xl">
                        <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5 px-3 py-1 text-xs font-bold uppercase tracking-widest">
                            Ma Bibliothèque
                        </Badge>
                        <h1 className="text-4xl font-black tracking-tight mb-4 text-balance">Gérez vos structures.</h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Organisez vos modèles personnels, vos favoris et vos brouillons en un seul endroit.
                        </p>
                    </div>
                    
                    <Button asChild className="rounded-2xl h-14 px-8 font-black text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all bg-gradient-to-r from-primary to-blue-600">
                        <Link href={templatesLibraryRoute()}>
                            <Plus className="mr-2 h-6 w-6" />
                            Nouveau Modèle
                        </Link>
                    </Button>
                </div>

                {/* Tabs & Search */}
                <div className="flex flex-col gap-6 mb-8">
                    <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
                        <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-2xl border border-border/50">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <Button 
                                        key={tab.id}
                                        variant={status === tab.id ? "default" : "ghost"}
                                        size="sm"
                                        className={`rounded-xl text-xs font-bold transition-all px-4 h-10 ${
                                            status === tab.id ? "shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-transparent"
                                        }`}
                                        onClick={() => setStatus(tab.id)}
                                    >
                                        <Icon className="mr-2 h-3.5 w-3.5" />
                                        {tab.label}
                                        <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[10px] ${
                                            status === tab.id ? "bg-primary-foreground/20 text-white" : "bg-muted text-muted-foreground"
                                        }`}>
                                            {tab.count}
                                        </span>
                                    </Button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="relative group max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input 
                            placeholder="Rechercher dans mes modèles..." 
                            className="pl-10 h-11 bg-card/50 border-border/50 focus:border-primary/50 transition-all rounded-xl shadow-inner"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Templates Grid */}
                {templates.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {templates.data.map((template) => (
                            <Card 
                                key={template.id} 
                                className="group overflow-hidden border-none bg-card/50 backdrop-blur-sm shadow-xl shadow-primary/5 hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 flex flex-col"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img 
                                        src={template.image || 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=400&h=600&fit=crop'} 
                                        alt={template.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60" />
                                    
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <Badge className="bg-background/80 backdrop-blur-md border-none text-[10px] font-bold uppercase tracking-wider text-foreground px-2 py-0.5 rounded-lg shadow-sm">
                                            {template.category}
                                        </Badge>
                                        <Badge className={`border-none text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg shadow-sm ${
                                            template.status === 'draft' ? 'bg-yellow-500/80 text-white' : 
                                            template.status === 'completed' ? 'bg-green-500/80 text-white' : 
                                            'bg-gray-500/80 text-white'
                                        }`}>
                                            {template.status}
                                        </Badge>
                                    </div>

                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button 
                                            onClick={() => handleToggleFavorite(template.id)}
                                            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center text-primary shadow-lg border border-white/20 hover:scale-110 transition-transform"
                                        >
                                            <Star size={14} className={template.is_favorite ? "fill-current" : ""} />
                                        </button>
                                        
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center text-muted-foreground shadow-lg border border-white/20 hover:text-foreground">
                                                    <MoreVertical size={14} />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 rounded-xl border-border/50 bg-card/90 backdrop-blur-md p-2">
                                                <DropdownMenuItem className="rounded-lg py-2 cursor-pointer">
                                                    <FileEdit className="mr-2 h-4 w-4" />
                                                    Modifier
                                                </DropdownMenuItem>
                                                {template.status !== 'archived' && (
                                                    <DropdownMenuItem 
                                                        className="rounded-lg py-2 cursor-pointer"
                                                        onClick={() => handleArchive(template.id)}
                                                    >
                                                        <Archive className="mr-2 h-4 w-4" />
                                                        Archiver
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator className="bg-border/50" />
                                                <DropdownMenuItem 
                                                    className="rounded-lg py-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                                                    onClick={() => handleDelete(template.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                
                                <CardHeader className="pt-6 pb-2">
                                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">
                                        {template.name}
                                    </CardTitle>
                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1">
                                        <Clock size={12} />
                                        <span>Modifié il y a 2 jours</span>
                                    </div>
                                </CardHeader>
                                
                                <CardContent className="flex-1">
                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[32px]">
                                        {template.description}
                                    </p>
                                </CardContent>
                                
                                <CardFooter className="pt-2 pb-6">
                                    <Button 
                                        asChild
                                        variant="outline"
                                        className="w-full rounded-xl font-bold group-hover:border-primary/50 transition-all duration-300"
                                    >
                                        <Link href={templatesShow({ template: template.slug })}>
                                            Ouvrir le modèle
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center bg-card/30 backdrop-blur-sm rounded-3xl border border-dashed border-border/50">
                        <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                            <Bookmark className="h-10 w-10 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-xl font-bold">Votre bibliothèque est vide</h3>
                        <p className="text-muted-foreground max-w-sm mt-2 mb-8">
                            Explorez nos modèles officiels pour commencer ou créez le vôtre de toutes pièces.
                        </p>
                        <Button asChild className="rounded-xl px-8 h-12 font-bold shadow-lg shadow-primary/10">
                            <Link href={templatesLibraryRoute()}>
                                Parcourir les modèles
                            </Link>
                        </Button>
                    </div>
                )}

                {/* Pagination */}
                {templates.last_page > 1 && (
                    <div className="mt-16 flex items-center justify-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={templates.current_page === 1}
                            className="rounded-xl border-border/50 bg-card/50"
                            asChild
                        >
                            <Link href={templates.prev_page_url || '#'}>
                                <ChevronLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        
                        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-2xl border border-border/50">
                            {templates.links.filter(link => !isNaN(Number(link.label))).map((link) => (
                                <Button
                                    key={link.label}
                                    variant={link.active ? "default" : "ghost"}
                                    size="sm"
                                    className={`rounded-xl w-9 h-9 font-bold transition-all ${
                                        link.active ? "shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
                                    }`}
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
                            disabled={templates.current_page === templates.last_page}
                            className="rounded-xl border-border/50 bg-card/50"
                            asChild
                        >
                            <Link href={templates.next_page_url || '#'}>
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
