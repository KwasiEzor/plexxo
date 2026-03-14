import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-2 group">
            <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-lg transition-transform group-hover:scale-110">
                <AppLogoIcon className="size-6 stroke-[2.5]" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-lg font-bold tracking-tight text-foreground">
                    Plexxo
                </span>
                <span className="truncate text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                    AI Ebook Forge
                </span>
            </div>
        </div>
    );
}
