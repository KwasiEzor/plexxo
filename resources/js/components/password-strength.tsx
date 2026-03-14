import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface PasswordStrengthProps {
    password?: string;
}

export default function PasswordStrength({ password = '' }: PasswordStrengthProps) {
    const strength = useMemo(() => {
        if (!password) {
return 0;
}

        let score = 0;

        if (password.length > 8) {
score++;
}

        if (password.match(/[A-Z]/)) {
score++;
}

        if (password.match(/[0-9]/)) {
score++;
}

        if (password.match(/[^A-Za-z0-9]/)) {
score++;
}

        return score;
    }, [password]);

    const strengthLabel = [
        'Trop court',
        'Faible',
        'Moyen',
        'Fort',
        'Excellent',
    ][strength];

    const strengthColor = [
        'bg-muted',
        'bg-red-500',
        'bg-orange-500',
        'bg-blue-500',
        'bg-green-500',
    ][strength];

    return (
        <div className="space-y-2 mt-2 px-1">
            <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Force du mot de passe</span>
                <span className={cn("text-[10px] font-bold uppercase", strength === 0 ? "text-muted-foreground" : "text-foreground")}>
                    {strengthLabel}
                </span>
            </div>
            <div className="flex gap-1 h-1">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className={cn(
                            "flex-1 rounded-full transition-all duration-500",
                            i <= strength ? strengthColor : "bg-muted dark:bg-white/5"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
