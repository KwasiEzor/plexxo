import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface User {
    id: number;
    name: string;
}

interface PresenceAvatarsProps {
    users: User[];
}

export default function PresenceAvatars({ users }: PresenceAvatarsProps) {
    if (users.length === 0) return null;

    return (
        <div className="flex -space-x-2 overflow-hidden items-center mr-4">
            {users.map((user) => (
                <Tooltip key={user.id}>
                    <TooltipTrigger asChild>
                        <Avatar className="h-8 w-8 border-2 border-background ring-0">
                            <AvatarFallback className="bg-muted text-[10px] font-medium">
                                {user.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="text-xs">{user.name}</p>
                    </TooltipContent>
                </Tooltip>
            ))}
            {users.length > 5 && (
                <span className="text-xs text-muted-foreground ml-3 font-medium">
                    +{users.length - 5} autres
                </span>
            )}
        </div>
    );
}
