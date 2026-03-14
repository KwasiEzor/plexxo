import { BookOpen, FileText, Clock, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Project } from '@/types/project';

interface ProjectStatsProps {
    project: Project;
}

export default function ProjectStats({ project }: ProjectStatsProps) {
    const wordCount = project.total_word_count || 0;
    const readingTime = Math.ceil(wordCount / 200); // Average 200 words per minute
    const chapterCount = project.chapters?.length || 0;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-background/50">
                <CardContent className="p-4 flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                        <FileText className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Mots total</p>
                        <p className="text-lg font-bold">{wordCount.toLocaleString()}</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-background/50">
                <CardContent className="p-4 flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                        <BookOpen className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Chapitres</p>
                        <p className="text-lg font-bold">{chapterCount}</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-background/50">
                <CardContent className="p-4 flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                        <Clock className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Lecture est.</p>
                        <p className="text-lg font-bold">{readingTime} min</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-background/50">
                <CardContent className="p-4 flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                        <BarChart3 className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Progression</p>
                        <p className="text-lg font-bold">{Math.min(100, Math.round((wordCount / 50000) * 100))}%</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
