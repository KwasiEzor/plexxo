import { useForm } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Project } from '@/types/project';

interface StyleGuideModalProps {
    project: Project;
}

export default function StyleGuideModal({ project }: StyleGuideModalProps) {
    const [open, setOpen] = useState(false);
    
    const { data, setData, put, processing } = useForm({
        style_guide: {
            tone: project.style_guide?.tone || '',
            target_audience: project.style_guide?.target_audience || '',
            avoid_words: project.style_guide?.avoid_words || '',
            custom_instructions: project.style_guide?.custom_instructions || '',
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('projects.update', { project: project.slug }), {
            onSuccess: () => setOpen(false),
        });
    };

    const updateField = (field: string, value: string) => {
        setData('style_guide', {
            ...data.style_guide,
            [field]: value
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Guide de Style IA">
                    <Sparkles className="h-4 w-4 text-primary" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center">
                            <Sparkles className="mr-2 h-5 w-5 text-primary" />
                            Guide de Style IA
                        </DialogTitle>
                        <DialogDescription>
                            Définissez comment l'IA doit rédiger et réviser votre livre pour une cohérence parfaite.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="tone">Ton global (ex: Professionnel, Humoristique, Inspirant)</Label>
                            <Textarea
                                id="tone"
                                value={data.style_guide.tone}
                                onChange={(e) => updateField('tone', e.target.value)}
                                placeholder="Décrivez le ton souhaité..."
                                className="min-h-[60px]"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="audience">Public cible</Label>
                            <Textarea
                                id="audience"
                                value={data.style_guide.target_audience}
                                onChange={(e) => updateField('audience', e.target.value)}
                                placeholder="À qui s'adresse ce livre ?"
                                className="min-h-[60px]"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="avoid">Mots ou expressions à éviter</Label>
                            <Textarea
                                id="avoid"
                                value={data.style_guide.avoid_words}
                                onChange={(e) => updateField('avoid', e.target.value)}
                                placeholder="Ex: jargon technique trop complexe, termes trop familiers..."
                                className="min-h-[60px]"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="instructions">Instructions personnalisées</Label>
                            <Textarea
                                id="instructions"
                                value={data.style_guide.custom_instructions}
                                onChange={(e) => updateField('custom_instructions', e.target.value)}
                                placeholder="Toute autre consigne pour l'IA..."
                                className="min-h-[80px]"
                            />
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Enregistrement...' : 'Sauvegarder le guide'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
