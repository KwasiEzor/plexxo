import { Head, Link, router } from '@inertiajs/react';
import { Check, Star, ArrowRight, Sparkles, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { index as templatesRoute, show as templatesShow, favorite as templatesFavorite } from '@/routes/templates';
import type { BreadcrumbItem, Template, PaginatedResponse } from '@/types';
import { useDebounce } from '@/hooks/use-debounce';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Modèles',
        href: '/templates',
    },
];

interface TemplatesProps {
    templates: PaginatedResponse<Template>;
    filters: {
        search?: string;
        category?: string;
    };
}

export default function Templates({ templates, filters }: TemplatesProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || 'all');
    const debouncedSearch = useDebounce(search, 300);

    const categories = ['all', 'Fiction', 'Business', 'Non-Fiction', 'Fantasy', 'Thriller'];

    const updateFilters = useCallback(() => {
        router.get(templatesRoute().url, {
            search: debouncedSearch || undefined,
            category: category !== 'all' ? category : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, [debouncedSearch, category]);

    const handleToggleFavorite = (id: number) => {
        router.post(templatesFavorite({ template: id }).url, {}, {
            preserveScroll: true,
        });
    };

    useEffect(() => {
        if (debouncedSearch !== filters.search || category !== filters.category) {
            updateFilters();
        }
    }, [debouncedSearch, category]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Modèles d'Ebooks" />
            
            <div className="max-w-7xl mx-auto p-4 md:p-8 pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="max-w-2xl">
                        <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5 px-3 py-1 text-xs font-bold uppercase tracking-widest">
                            Bibliothèque de structures
                        </Badge>
                        <h1 className="text-4xl font-black tracking-tight mb-4 text-balance">Choisissez votre structure.</h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Commencez avec un plan d'expert conçu pour captiver vos lecteurs dès la première page.
                        </p>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input 
                            placeholder="Rechercher un modèle..." 
                            className="pl-10 h-11 bg-card/50 border-border/50 focus:border-primary/50 transition-all rounded-xl shadow-inner"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-2xl border border-border/50">
                            {categories.map((cat) => (
                                <Button 
                                    key={cat}
                                    variant={category === cat ? "default" : "ghost"}
                                    size="sm"
                                    className={`rounded-xl text-xs font-bold transition-all px-4 ${
                                        category === cat ? "shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-transparent"
                                    }`}
                                    onClick={() => setCategory(cat)}
                                >
                                    {cat === 'all' ? 'Tous' : cat}
                                </Button>
                            ))}
                        </div>
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
                                    
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-background/80 backdrop-blur-md border-none text-[10px] font-bold uppercase tracking-wider text-foreground px-2 py-0.5 rounded-lg shadow-sm">
                                            {template.category}
                                        </Badge>
                                    </div>

                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button 
                                            onClick={() => handleToggleFavorite(template.id)}
                                            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center text-primary shadow-lg border border-white/20 hover:scale-110 transition-transform"
                                        >
                                            <Star size={14} className={template.is_favorite ? "fill-current" : ""} />
                                        </button>
                                        
                                        {template.is_premium && (
                                            <div className="h-8 w-8 rounded-full bg-primary/90 backdrop-blur-md flex items-center justify-center text-primary-foreground shadow-lg border border-white/20">
                                                <Star size={14} className="fill-current" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <CardHeader className="pt-6 pb-2">
                                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">
                                        {template.name}
                                    </CardTitle>
                                    <p className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed min-h-[32px]">
                                        {template.description}
                                    </p>
                                </CardHeader>
                                
                                <CardContent className="flex-1">
                                    <ul className="space-y-2">
                                        {template.features?.slice(0, 3).map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                                                <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                    <Check size={10} />
                                                </div>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                
                                <CardFooter className="pt-2 pb-6">
                                    <Button 
                                        asChild
                                        className="w-full rounded-xl font-bold group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300 bg-gradient-to-r from-primary to-blue-600 hover:opacity-90"
                                    >
                                        <Link href={templatesShow({ template: template.slug }).url}>
                                            Détails & Utiliser
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                            <Search className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold">Aucun modèle trouvé</h3>
                        <p className="text-muted-foreground max-w-sm mt-2">
                            Essayez de modifier vos critères de recherche ou explorez une autre catégorie.
                        </p>
                        <Button 
                            variant="outline" 
                            className="mt-6 rounded-xl"
                            onClick={() => { setSearch(''); setCategory('all'); }}
                        >
                            Réinitialiser les filtres
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
                
                {/* Custom Template CTA */}
                <div className="mt-32 relative rounded-3xl overflow-hidden bg-primary/5 border border-primary/10 p-8 md:p-12 shadow-2xl shadow-primary/5">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent opacity-50" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="max-w-xl text-center md:text-left">
                            <Badge className="bg-primary/10 text-primary border-none mb-4 font-bold tracking-widest uppercase text-[10px] px-3">Sur-Mesure</Badge>
                            <h2 className="text-3xl font-black mb-4 tracking-tight">Besoin d'une structure personnalisée ?</h2>
                            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                                Laissez notre IA analyser vos idées et générer un plan de chapitres personnalisé en quelques secondes. Idéal pour les sujets de niche.
                            </p>
                        </div>
                        <Button size="lg" className="rounded-2xl px-10 py-7 h-auto font-black text-xl shadow-2xl shadow-primary/20 hover:scale-105 transition-all bg-gradient-to-r from-primary to-blue-600">
                            <Sparkles className="mr-3 h-6 w-6" />
                            Générer avec l'IA
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
