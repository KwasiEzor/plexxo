import { Head, Link } from '@inertiajs/react';
import { 
    BookOpen, 
    CheckCircle2, 
    Globe, 
    Layers, 
    Layout, 
    MessageSquare, 
    Sparkles, 
    Users, 
    Zap,
    ChevronRight,
    ArrowRight
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-background selection:bg-primary/10 selection:text-primary">
            <Head title="Forgez vos Ebooks avec l'IA" />
            
            {/* Navigation */}
            <nav className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <AppLogo />
                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
                        <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Fonctionnalités</a>
                        <a href="#workflow" className="text-muted-foreground hover:text-foreground transition-colors">Comment ça marche</a>
                        <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Tarifs</a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">Connexion</Link>
                        <Button asChild className="rounded-full bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 shadow-lg shadow-primary/20">
                            <Link href="/register">Essai gratuit <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 overflow-hidden">
                <div className="container mx-auto px-6 relative">
                    {/* Background Gradients */}
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
                    
                    <div className="max-w-4xl mx-auto text-center space-y-8 relative">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/5 text-primary text-xs font-bold tracking-wider uppercase border border-primary/10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            <Sparkles className="h-3.5 w-3.5 mr-2" />
                            L'IA au service de votre créativité
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-foreground animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                            Transformez vos idées en <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 italic">Ebooks Professionnels</span> en quelques minutes
                        </h1>
                        
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                            Plexxo n'est pas qu'un générateur de texte. C'est votre studio d'édition complet qui combine la puissance de l'IA avec une collaboration humaine fluide.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
                            <Button size="lg" className="h-14 px-8 rounded-2xl bg-primary hover:opacity-90 text-lg shadow-xl shadow-primary/30 w-full sm:w-auto" asChild>
                                <Link href="/register">Commencer la forge <ChevronRight className="ml-2 h-5 w-5" /></Link>
                            </Button>
                            <Button variant="outline" size="lg" className="h-14 px-8 rounded-2xl text-lg border-2 w-full sm:w-auto">
                                Voir la démo
                            </Button>
                        </div>
                        
                        {/* Mockup Dashboard Preview */}
                        <div className="mt-16 relative rounded-3xl border-2 border-white/10 dark:border-white/5 shadow-2xl overflow-hidden bg-muted p-2 animate-in fade-in zoom-in-95 duration-1000 delay-700">
                            <div className="rounded-2xl border bg-background overflow-hidden aspect-video relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-600/5 flex items-center justify-center">
                                    <div className="w-4/5 h-3/4 bg-background rounded-xl shadow-lg border p-6 flex flex-col gap-4">
                                        <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
                                        <div className="flex-1 grid grid-cols-12 gap-4">
                                            <div className="col-span-3 bg-muted/30 rounded-lg p-3 space-y-2">
                                                <div className="h-2 w-full bg-muted rounded" />
                                                <div className="h-2 w-4/5 bg-muted rounded" />
                                                <div className="h-2 w-full bg-muted rounded" />
                                            </div>
                                            <div className="col-span-9 bg-muted/10 rounded-lg p-6 space-y-4">
                                                <div className="h-4 w-1/4 bg-muted rounded" />
                                                <div className="h-2 w-full bg-muted rounded" />
                                                <div className="h-2 w-full bg-muted rounded" />
                                                <div className="h-2 w-3/4 bg-muted rounded" />
                                                <div className="h-40 w-full bg-muted/30 rounded-xl" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-muted/30">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Plus qu'un simple générateur d'Ebooks</h2>
                        <p className="text-muted-foreground text-lg">Nous avons repensé la création de contenu professionnel pour allier rapidité de l'IA et contrôle humain total.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Sparkles className="h-6 w-6 text-primary" />,
                                title: "Intelligence Augmentée",
                                desc: "Générez des plans, rédigez des chapitres entiers ou réécrivez vos paragraphes en un clic."
                            },
                            {
                                icon: <Users className="h-6 w-6 text-blue-600" />,
                                title: "Mode Équipe Natif",
                                desc: "Collaborez en temps réel avec vos relecteurs, correcteurs et designers sur une plateforme unique."
                            },
                            {
                                icon: <Layout className="h-6 w-6 text-primary" />,
                                title: "Templates Métier",
                                desc: "Livres blancs, guides techniques ou lead magnets : des structures adaptées à chaque besoin."
                            },
                            {
                                icon: <Globe className="h-6 w-6 text-blue-600" />,
                                title: "Adaptation Culturelle",
                                desc: "Ne vous contentez pas de traduire. Adaptez votre contenu aux idiomes et cultures locales."
                            },
                            {
                                icon: <Zap className="h-6 w-6 text-primary" />,
                                title: "Export Multi-format",
                                desc: "Exportez vers PDF, EPUB 3 ou publiez directement sur WordPress, Amazon KDP ou Gumroad."
                            },
                            {
                                icon: <Layers className="h-6 w-6 text-blue-600" />,
                                title: "Sources Privées (RAG)",
                                desc: "Uploadez vos propres documents pour que l'IA rédige en se basant uniquement sur vos sources."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="group p-8 rounded-3xl bg-background border transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                                <div className="size-12 rounded-2xl bg-muted flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Workflow Section */}
            <section id="workflow" className="py-24">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 space-y-8">
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">Le processus de création <br/><span className="text-primary">réinventé</span></h2>
                            <div className="space-y-6">
                                {[
                                    { step: "01", title: "Forge du Plan", desc: "Décrivez votre idée et laissez l'IA forger un plan détaillé et structuré en quelques secondes." },
                                    { step: "02", title: "Rédaction Assistée", desc: "Rédigez vous-même ou demandez à l'IA de poser les premières briques chapitre par chapitre." },
                                    { step: "03", title: "Raffinement Collaboratif", desc: "Invitez votre équipe pour une relecture humaine et une validation finale en temps réel." },
                                    { step: "04", title: "Distribution Omnicanale", desc: "Optimisez pour le SEO et exportez vers les formats numériques les plus populaires." }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-6">
                                        <span className="text-4xl font-black text-muted-foreground/20">{step.step}</span>
                                        <div>
                                            <h4 className="text-xl font-bold mb-1">{step.title}</h4>
                                            <p className="text-muted-foreground">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-blue-600 rounded-3xl rotate-3 scale-95 opacity-20 blur-2xl" />
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border bg-background p-4 aspect-square flex items-center justify-center">
                                <div className="text-center space-y-6">
                                    <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                        <Sparkles className="h-12 w-12 text-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-48 bg-muted rounded mx-auto animate-pulse" />
                                        <div className="h-2 w-32 bg-muted rounded mx-auto" />
                                        <div className="h-2 w-40 bg-muted rounded mx-auto" />
                                    </div>
                                    <Button disabled className="rounded-xl px-12">Génération en cours...</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-muted/30">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Des tarifs simples pour tous les auteurs</h2>
                        <p className="text-muted-foreground text-lg">Commencez gratuitement et passez à la vitesse supérieure quand vous êtes prêt.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Plan */}
                        <div className="flex flex-col p-8 rounded-3xl bg-background border transition-all hover:shadow-lg">
                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-2">Gratuit</h3>
                                <p className="text-muted-foreground text-sm">Pour découvrir la puissance de Plexxo.</p>
                            </div>
                            <div className="mb-8">
                                <span className="text-4xl font-black">0€</span>
                                <span className="text-muted-foreground">/mois</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center text-sm">
                                    <CheckCircle2 className="mr-3 h-5 w-5 text-green-500" />
                                    1 Projet actif
                                </li>
                                <li className="flex items-center text-sm">
                                    <CheckCircle2 className="mr-3 h-5 w-5 text-green-500" />
                                    Génération de plan IA
                                </li>
                                <li className="flex items-center text-sm">
                                    <CheckCircle2 className="mr-3 h-5 w-5 text-green-500" />
                                    Export PDF standard
                                </li>
                            </ul>
                            <Button variant="outline" className="w-full rounded-xl h-12" asChild>
                                <Link href="/register">Commencer</Link>
                            </Button>
                        </div>

                        {/* Premium Plan */}
                        <div className="flex flex-col p-8 rounded-3xl bg-background border-2 border-primary relative transition-all hover:shadow-xl shadow-primary/10">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                Recommandé
                            </div>
                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-2">Premium</h3>
                                <p className="text-muted-foreground text-sm">Pour les auteurs et créateurs sérieux.</p>
                            </div>
                            <div className="mb-8">
                                <span className="text-4xl font-black">19€</span>
                                <span className="text-muted-foreground">/mois</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center text-sm">
                                    <CheckCircle2 className="mr-3 h-5 w-5 text-green-500" />
                                    Projets illimités
                                </li>
                                <li className="flex items-center text-sm">
                                    <CheckCircle2 className="mr-3 h-5 w-5 text-green-500" />
                                    RAG & Sources privées
                                </li>
                                <li className="flex items-center text-sm">
                                    <CheckCircle2 className="mr-3 h-5 w-5 text-green-500" />
                                    Export EPUB 3 & HTML SEO
                                </li>
                                <li className="flex items-center text-sm">
                                    <CheckCircle2 className="mr-3 h-5 w-5 text-green-500" />
                                    Agent Réviseur & Traduction
                                </li>
                                <li className="flex items-center text-sm">
                                    <CheckCircle2 className="mr-3 h-5 w-5 text-green-500" />
                                    Publication directe Gumroad/KDP
                                </li>
                            </ul>
                            <Button className="w-full rounded-xl h-12 bg-primary hover:opacity-90 shadow-lg shadow-primary/20" asChild>
                                <Link href="/register">Devenir Premium</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="container mx-auto px-6 text-center">
                    <div className="max-w-4xl mx-auto rounded-4xl bg-gradient-to-r from-primary to-blue-600 p-12 md:p-20 text-white shadow-2xl shadow-primary/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <BookOpen className="h-64 w-64 rotate-12" />
                        </div>
                        <div className="relative z-10 space-y-8">
                            <h2 className="text-3xl md:text-5xl font-black">Prêt à forger votre prochain succès ?</h2>
                            <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto">Rejoignez des milliers de créateurs qui utilisent Plexxo pour transformer leur expertise en actifs numériques lucratifs.</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button size="lg" variant="secondary" className="h-14 px-10 rounded-2xl text-lg font-bold w-full sm:w-auto text-primary" asChild>
                                    <Link href="/register">Essayer Gratuitement</Link>
                                </Button>
                                <p className="text-sm font-medium text-primary-foreground/60">Aucune carte de crédit requise.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <AppLogo />
                        <p className="text-muted-foreground text-sm">© 2026 Plexxo AI. Tous droits réservés.</p>
                        <div className="flex items-center space-x-6">
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Users className="h-5 w-5" /></a>
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Globe className="h-5 w-5" /></a>
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><MessageSquare className="h-5 w-5" /></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
