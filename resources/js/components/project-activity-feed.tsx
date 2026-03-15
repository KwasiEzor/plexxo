import { 
    Activity, 
    User, 
    Book, 
    FileText, 
    Plus, 
    Settings, 
    History,
    MessageSquare,
    Link as LinkIcon
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ActivityItem {
    id: number;
    description: string;
    subject_type: string;
    event: string;
    causer: {
        id: number;
        name: string;
    } | null;
    created_at: string;
    properties: any;
}

interface ProjectActivityFeedProps {
    activities: ActivityItem[];
}

export default function ProjectActivityFeed({ activities }: ProjectActivityFeedProps) {
    const getIcon = (subjectType: string, event: string) => {
        if (event === 'created') return <Plus className="h-3 w-3 text-emerald-500" />;
        
        switch (subjectType) {
            case 'Project': return <Book className="h-3 w-3 text-blue-500" />;
            case 'Chapter': return <FileText className="h-3 w-3 text-primary" />;
            case 'Source': return <LinkIcon className="h-3 w-3 text-amber-500" />;
            case 'Comment': return <MessageSquare className="h-3 w-3 text-purple-500" />;
            default: return <Activity className="h-3 w-3 text-muted-foreground" />;
        }
    };

    const formatDescription = (activity: ActivityItem) => {
        const causer = activity.causer?.name || 'Système';
        const subject = activity.subject_type.toLowerCase();
        
        if (activity.event === 'created') {
            return `${causer} a créé un nouveau ${subject}`;
        }
        
        if (activity.event === 'updated') {
            return `${causer} a mis à jour le ${subject}`;
        }

        if (activity.event === 'deleted') {
            return `${causer} a supprimé un ${subject}`;
        }

        return activity.description;
    };

    return (
        <Card className="border-none bg-sidebar h-full flex flex-col shadow-none">
            <CardHeader className="px-4 py-4 border-b bg-background/50">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <History className="h-4 w-4 text-primary" />
                    Flux d'activité
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    {activities.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground text-xs italic">
                            Aucune activité récente.
                        </div>
                    ) : (
                        <div className="divide-y divide-border/30">
                            {activities.map((activity) => (
                                <div key={activity.id} className="p-4 hover:bg-muted/30 transition-colors group">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 rounded-full bg-background p-1.5 shadow-sm border border-border/50 group-hover:border-primary/30 transition-colors">
                                            {getIcon(activity.subject_type, activity.event)}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-xs font-medium leading-tight">
                                                {formatDescription(activity)}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-muted-foreground italic">
                                                    {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <Badge variant="outline" className="text-[8px] px-1 py-0 h-3 border-none bg-muted/50 text-muted-foreground uppercase font-bold tracking-tighter">
                                                    {activity.event}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
