import { useForm } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MessageSquare, Send, CheckCircle2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { Chapter } from '@/types/project';
import { Textarea } from '@/components/ui/textarea';

interface CommentSidebarProps {
    chapter: Chapter;
}

export default function CommentSidebar({ chapter }: CommentSidebarProps) {
    const [isAdding, setIsAdding] = useState(false);
    
    const { data, setData, post, processing, reset } = useForm({
        content: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('comments.store', { chapter: chapter.id }), {
            onSuccess: () => {
                reset();
                setIsAdding(false);
            },
        });
    };

    const handleResolve = (id: number) => {
        post(route('comments.resolve', { comment: id }), {
            _method: 'patch',
            preserveScroll: true,
        } as any);
    };

    const handleDelete = (id: number) => {
        if (confirm('Supprimer ce commentaire ?')) {
            post(route('comments.destroy', { comment: id }), {
                _method: 'delete',
                preserveScroll: true,
            } as any);
        }
    };

    return (
        <aside className="w-80 border-l bg-sidebar flex flex-col hidden xl:flex">
            <div className="p-4 border-b flex justify-between items-center bg-background/50">
                <h2 className="font-semibold flex items-center text-sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Commentaires ({chapter.comments?.length || 0})
                </h2>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsAdding(!isAdding)}>
                    <Send className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isAdding && (
                    <form onSubmit={handleSubmit} className="space-y-3 pb-4 border-b">
                        <Textarea
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            placeholder="Votre commentaire..."
                            className="text-xs min-h-[80px]"
                            required
                        />
                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                                Annuler
                            </Button>
                            <Button type="submit" size="sm" disabled={processing}>
                                {processing ? 'Envoi...' : 'Commenter'}
                            </Button>
                        </div>
                    </form>
                )}

                {chapter.comments?.length === 0 && !isAdding ? (
                    <div className="text-center py-10">
                        <MessageSquare className="h-8 w-8 text-muted-foreground/20 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground italic">Aucun commentaire sur ce chapitre.</p>
                    </div>
                ) : (
                    chapter.comments?.map((comment) => (
                        <div key={comment.id} className={`group space-y-2 ${comment.is_resolved ? 'opacity-50' : ''}`}>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback className="text-[8px]">
                                            {comment.user?.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold">{comment.user?.name}</span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: fr })}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {!comment.is_resolved && (
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-green-500" onClick={() => handleResolve(comment.id)}>
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                        </Button>
                                    )}
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleDelete(comment.id)}>
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>
                            
                            <div className={`text-xs p-3 rounded-lg border ${comment.is_resolved ? 'bg-muted/50' : 'bg-background shadow-xs'}`}>
                                {comment.content}
                                {comment.is_resolved && (
                                    <div className="mt-2 flex items-center text-[10px] text-green-600 font-bold uppercase tracking-wider">
                                        <CheckCircle2 className="mr-1 h-3 w-3" />
                                        Résolu
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </aside>
    );
}
