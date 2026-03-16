import { Head, Link } from '@inertiajs/react';
import { 
    Check, 
    Star, 
    ArrowLeft, 
    Sparkles, 
    Zap, 
    ShieldCheck, 
    Clock, 
    FileText,
    Share2,
    Heart
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { index as templatesRoute } from '@/routes/templates';
import type { BreadcrumbItem, Template } from '@/types';

interface TemplateShowProps {
    template: Template;
}

export default function TemplateShow({ template }: TemplateShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Modèles',
            href: templatesRoute().url,
        },
        {
            title: template.name,
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${template.name} - Modèle d'Ebook`} />
            
            <div className="max-w-6xl mx-auto p-4 md:p-8 pb-20">
                {/* Back Button */}
                <Button variant="ghost" size="sm" className="mb-8 rounded-xl text-muted-foreground hover:text-foreground" asChild>
                    <Link href={templatesRoute().url}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour aux modèles
                    </Link>
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Preview & Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Hero Card */}
                        <div className="relative rounded-3xl overflow-hidden aspect-video shadow-2xl shadow-primary/10 group border border-border/50">
                            <img 
                                src={template.image || 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=400&h=600&fit=crop'} 
                                alt={template.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            
                            <div className="absolute bottom-8 left-8 right-8">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge className="bg-primary text-primary-foreground border-none font-bold uppercase tracking-wider text-[10px] px-3">
                                        {template.category}
                                    </Badge>
                                    {template.is_premium && (
                                        <Badge variant="secondary" className="bg-amber-500 text-white border-none font-bold uppercase tracking-wider text-[10px] flex items-center gap-1 px-3">
                                            <Star size={10} className="fill-current" />
                                            Premium
                                        </Badge>
                                    )}
                                </div>
                                <h1 className="text-4xl font-black text-white tracking-tight leading-tight drop-shadow-sm">
                                    {template.name}
                                </h1>
                            </div>
                        </div>

                        {/* Description & Features */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold tracking-tight">À propos de ce modèle</h2>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" className="rounded-xl border-border/50 bg-card/50">
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-xl border-border/50 bg-card/50">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {template.description}
                            </p>

                            <Separator className="my-8 opacity-50" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="font-bold flex items-center gap-2 text-primary">
                                        <Zap className="h-4 w-4" />
                                        Points forts
                                    </h3>
                                    <ul className="space-y-3">
                                        {template.features?.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm font-medium text-muted-foreground">
                                                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                                                    <Check size={12} />
                                                </div>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="space-y-4 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                        Inclus dans Plexxo
                                    </h3>
                                    <ul className="space-y-2 text-xs text-muted-foreground font-medium">
                                        <li className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            Support IA illimité pour la rédaction
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            Exportation EPUB et PDF haute résolution
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            Synchronisation collaborative en temps réel
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Actions & Stats */}
                    <div className="space-y-6">
                        <Card className="border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-md overflow-hidden lg:sticky lg:top-24 border border-border/50">
                            <div className="h-2 bg-gradient-to-r from-primary to-blue-600" />
                            <CardHeader className="pt-8 pb-4">
                                <CardTitle className="text-2xl font-black tracking-tight">Prêt à écrire ?</CardTitle>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Utilisez ce modèle pour générer instantanément la structure de votre ebook.
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border/50">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                <FileText size={16} />
                                            </div>
                                            <span className="text-sm font-bold">Plan complet</span>
                                        </div>
                                        <Badge variant="outline" className="border-emerald-500/20 text-emerald-600 bg-emerald-500/5 font-bold text-[10px]">Inclus</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border/50">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                <Sparkles size={16} />
                                            </div>
                                            <span className="text-sm font-bold">Aide IA</span>
                                        </div>
                                        <Badge variant="outline" className="border-emerald-500/20 text-emerald-600 bg-emerald-500/5 font-bold text-[10px]">Inclus</Badge>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <Button className="w-full py-7 rounded-2xl font-black text-lg bg-gradient-to-r from-primary to-blue-600 hover:shadow-xl hover:shadow-primary/20 transition-all hover:scale-[1.02]">
                                        Utiliser ce modèle
                                        <Zap className="ml-2 h-5 w-5 fill-current" />
                                    </Button>
                                    <p className="text-[10px] text-center text-muted-foreground font-medium uppercase tracking-wider">
                                        Initialisation instantanée du projet
                                    </p>
                                </div>

                                <Separator className="opacity-50" />

                                <div className="flex items-center justify-center gap-8 py-2">
                                    <div className="text-center">
                                        <div className="text-xl font-bold tracking-tight">12</div>
                                        <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Chapitres</div>
                                    </div>
                                    <div className="h-8 w-[1px] bg-border/50" />
                                    <div className="text-center">
                                        <div className="text-xl font-bold tracking-tight">3.5k</div>
                                        <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Mots</div>
                                    </div>
                                    <div className="h-8 w-[1px] bg-border/50" />
                                    <div className="text-center">
                                        <div className="text-xl font-bold tracking-tight text-primary">4.8</div>
                                        <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Score IA</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4 shadow-sm shadow-primary/5">
                            <h4 className="font-bold text-sm flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                Temps de génération
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                                L'IA de Plexxo analysera ce modèle pour créer un plan spécifique à votre sujet en moins de <strong>30 secondes</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
