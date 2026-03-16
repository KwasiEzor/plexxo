import { useForm, router } from '@inertiajs/react';
import { Image as ImageIcon, Loader2, Upload, Sparkles } from 'lucide-react';
import { useRef } from 'react';
import { updateCover as projectsUpdateCover } from '@/actions/App/Http/Controllers/ProjectController';
import { Button } from '@/components/ui/button';
import { generateCover } from '@/routes/projects';
import type { Project } from '@/types';

interface CoverManagerProps {
    project: Project;
    coverUrl?: string;
}

export default function CoverManager({ project, coverUrl }: CoverManagerProps) {
    const fileInput = useRef<HTMLInputElement>(null);
    const { setData, processing } = useForm({
        cover: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('cover', file);
            
            router.post(projectsUpdateCover({ project: project.slug }), {
                cover: file
            }, {
                forceFormData: true,
                onSuccess: () => {
                    // Success
                }
            });
        }
    };

    const handleGenerate = () => {
        router.post(generateCover({ project: project.slug }).url, {}, {
            preserveScroll: true
        });
    };

    return (
        <div className="space-y-4">
            <div className="relative aspect-[2/3] w-full max-w-[200px] mx-auto rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/20 flex items-center justify-center bg-muted/30">
                {coverUrl ? (
                    <img src={coverUrl} alt="Couverture" className="w-full h-full object-cover" />
                ) : (
                    <div className="text-center p-4">
                        <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <span className="text-xs text-muted-foreground">Pas de couverture</span>
                    </div>
                )}
                
                {processing && (
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-2">
                <input
                    type="file"
                    ref={fileInput}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
                <Button variant="outline" size="sm" onClick={() => fileInput.current?.click()} disabled={processing}>
                    <Upload className="mr-2 h-3 w-3" />
                    Uploader
                </Button>
                <Button variant="outline" size="sm" className="text-primary" onClick={handleGenerate} disabled={processing}>
                    <Sparkles className="mr-2 h-3 w-3" />
                    IA Cover
                </Button>
            </div>
        </div>
    );
}
