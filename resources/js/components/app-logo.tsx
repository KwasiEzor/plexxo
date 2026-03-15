import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-3 group px-1">
            <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-blue-600 to-cyan-500 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 group-hover:shadow-primary/40 group-hover:-rotate-3">
                <AppLogoIcon className="size-6 stroke-[2.5]" />
            </div>
            <div className="grid flex-1 text-left leading-tight">
                <span className="truncate text-xl font-black tracking-tighter text-foreground bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">
                    PLEXXO
                </span>
                <span className="truncate text-[9px] font-bold text-primary/80 uppercase tracking-[0.2em] -mt-0.5">
                    Creative Forge
                </span>
            </div>
        </div>
    );
}
