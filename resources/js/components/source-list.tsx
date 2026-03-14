import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Trash2, Loader2, FileCode, CheckCircle2, AlertCircle } from 'lucide-react';

interface Source {
    id: number;
    title: string;
    type: string;
    status: string;
}

interface Project {
    id: number;
    slug: string;
    sources?: Source[];
}

interface SourceListProps {
    project: Project;
}

export default function SourceList({ project }: SourceListProps) {
    const [isUploading, setIsUploading] = useState(false);
    const { setData, post, processing, reset } = useForm({
        file: null as File | null,
    });

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('sources.store', { project: project.slug }), {
            onSuccess: () => {
                reset();
                setIsUploading(false);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Supprimer ce document ?')) {
            router.delete(route('sources.destroy', { source: id }));
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle2 className="h-3 w-3 text-green-500" />;
            case 'failed':
                return <AlertCircle className="h-3 w-3 text-destructive" />;
            case 'processing':
            case 'pending':
                return <Loader2 className="h-3 w-3 animate-spin text-primary" />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Sources (RAG)
                </h3>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => setIsUploading(!isUploading)}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            {isUploading && (
                <form onSubmit={handleUpload} className="p-3 border rounded-md bg-muted/50 space-y-3">
                    <input
                        type="file"
                        accept=".pdf,.docx"
                        onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                        className="text-xs block w-full text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setIsUploading(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" size="sm" disabled={processing}>
                            {processing ? 'Envoi...' : 'Ajouter'}
                        </Button>
                    </div>
                </form>
            )}

            <div className="space-y-2">
                {project.sources?.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic px-2">
                        Aucun document source ajouté.
                    </p>
                ) : (
                    project.sources?.map((source) => (
                        <div key={source.id} className="flex items-center justify-between p-2 rounded-md border bg-background group">
                            <div className="flex items-center space-x-2 overflow-hidden">
                                {source.type === 'pdf' ? <FileText className="h-4 w-4 text-red-500 flex-shrink-0" /> : <FileCode className="h-4 w-4 text-blue-500 flex-shrink-0" />}
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-xs font-medium truncate" title={source.title}>
                                        {source.title}
                                    </span>
                                    <div className="flex items-center space-x-1">
                                        {getStatusIcon(source.status)}
                                        <span className="text-[10px] text-muted-foreground uppercase">
                                            {source.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDelete(source.id)}
                            >
                                <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
