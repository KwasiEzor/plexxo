import { Link } from '@inertiajs/react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0 bg-background">
            <div className="relative hidden h-full flex-col p-16 text-white lg:flex overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-blue-600" />
                
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
                
                <div className="relative z-20 flex items-center mb-12">
                    <Link href={home()} className="bg-white p-2 rounded-xl">
                        <AppLogo />
                    </Link>
                </div>

                <div className="relative z-20 mt-auto">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold tracking-wider uppercase mb-6">
                        <Sparkles className="h-3 w-3 mr-2 text-primary-foreground/70" />
                        Rejoignez la Forge
                    </div>
                    <h2 className="text-4xl font-black tracking-tight leading-tight mb-8">
                        L'avenir de l'édition numérique commence ici.
                    </h2>
                    
                    <ul className="space-y-4 text-primary-foreground/80">
                        <li className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary-foreground/60" />
                            <span>Génération de plans intelligents par IA</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary-foreground/60" />
                            <span>Collaboration temps réel pour équipes</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary-foreground/60" />
                            <span>Export PDF & EPUB prêt pour la vente</span>
                        </li>
                    </ul>

                    <div className="mt-12 pt-12 border-t border-white/10 flex items-center gap-4">
                        <div className="flex -space-x-2">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="h-8 w-8 rounded-full border-2 border-primary bg-blue-400 flex items-center justify-center text-[10px] font-bold text-white">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-primary-foreground/70 font-medium">+2,400 auteurs nous font confiance</p>
                    </div>
                </div>
                
                <div className="absolute bottom-0 right-0 p-8 opacity-5 select-none pointer-events-none">
                    <Sparkles className="h-64 w-64" />
                </div>
            </div>

            <div className="w-full lg:p-8 flex items-center justify-center">
                <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px]">
                    <div className="lg:hidden flex justify-center mb-8">
                        <Link href={home()}>
                            <AppLogo />
                        </Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h1 className="text-3xl font-black tracking-tight text-foreground">{title}</h1>
                        <p className="text-base text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
                        {children}
                    </div>
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        En continuant, vous acceptez nos{' '}
                        <Link href="#" className="underline underline-offset-4 hover:text-primary">Conditions d'utilisation</Link>{' '}
                        et notre{' '}
                        <Link href="#" className="underline underline-offset-4 hover:text-primary">Politique de confidentialité</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
