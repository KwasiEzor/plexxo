import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutGrid, 
    BookOpen, 
    Sparkles, 
    Library, 
    ShieldCheck, 
    CreditCard, 
    Palette,
    UserCircle,
    Zap,
    Bookmark,
    Users,
    Shield,
    Clock,
    History
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { dashboard, assistant } from '@/routes';
import { index as templatesLibrary } from '@/routes/templates';
import { index as myTemplates } from '@/routes/my-templates';
import { edit as appearance } from '@/routes/appearance';
import { edit as billing } from '@/routes/billing';
import { edit as profile } from '@/routes/profile';
import { edit as security } from '@/routes/security';
import type { NavItem } from '@/types';

const platformItems: NavItem[] = [
    {
        title: 'Tableau de bord',
        href: dashboard().url,
        icon: LayoutGrid,
    },
    {
        title: 'Assistant IA',
        href: assistant().url,
        icon: Sparkles,
    },
];

const libraryItems: NavItem[] = [
    {
        title: 'Mes Ebooks',
        href: dashboard().url, // Redirect to dashboard for now as it lists projects
        icon: Library,
    },
    {
        title: 'Collaborations',
        href: route('collaborations.index'),
        icon: Users,
    },
    {
        title: 'Mes Modèles',
        href: myTemplates().url,
        icon: Bookmark,
    },
    {
        title: 'Modèles',
        href: templatesLibrary().url, 
        icon: BookOpen,
    },
];

const settingsItems: NavItem[] = [
    {
        title: 'Profil',
        href: profile().url,
        icon: UserCircle,
    },
    {
        title: 'Sécurité',
        href: security().url,
        icon: ShieldCheck,
    },
    {
        title: 'Facturation',
        href: billing().url,
        icon: CreditCard,
    },
    {
        title: 'Apparence',
        href: appearance().url,
        icon: Palette,
    },
];

const adminItems: NavItem[] = [
    {
        title: 'Dashboard Admin',
        href: '#', 
        icon: Shield,
    },
    {
        title: 'Utilisateurs',
        href: '#', 
        icon: Users,
    },
    {
        title: 'Tokens & Usage',
        href: '#', 
        icon: Zap,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const isAdmin = auth.user?.is_admin;

    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r-0">
            <SidebarHeader className="py-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
                            <Link href={dashboard().url} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="gap-6 px-2">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 px-4 mb-2">
                        Plateforme
                    </SidebarGroupLabel>
                    <NavMain items={platformItems} />
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 px-4 mb-2">
                        Bibliothèque
                    </SidebarGroupLabel>
                    <NavMain items={libraryItems} />
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 px-4 mb-2">
                        Configuration
                    </SidebarGroupLabel>
                    <NavMain items={settingsItems} />
                </SidebarGroup>

                {isAdmin && (
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-[10px] uppercase tracking-widest font-bold text-red-500/80 px-4 mb-2">
                            Administration
                        </SidebarGroupLabel>
                        <NavMain items={adminItems} />
                    </SidebarGroup>
                )}

                {/* Promotional Widget in Sidebar */}
                <div className="mx-4 mt-4 rounded-xl bg-primary/5 p-4 border border-primary/10 group">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-primary animate-pulse" />
                        <span className="text-xs font-bold text-primary">Plexxo Pro</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mb-3 leading-relaxed">
                        Débloquez l'IA illimitée et l'exportation EPUB haute qualité.
                    </p>
                    <Link 
                        href={billing().url} 
                        className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                    >
                        En savoir plus <ChevronRight className="h-3 w-3" />
                    </Link>
                </div>
            </SidebarContent>

            <SidebarFooter className="p-4">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

// Helper component for small arrow in widget
function ChevronRight({ className }: { className?: string }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="m9 18 6-6-6-6"/>
        </svg>
    );
}
