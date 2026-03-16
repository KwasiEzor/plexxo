import { useForm } from '@inertiajs/react';
import { Palette } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { update } from '@/routes/projects';
import type { Project } from '@/types/project';

interface ExportSettingsModalProps {
    project: Project;
}

export default function ExportSettingsModal({ project }: ExportSettingsModalProps) {
    const [open, setOpen] = useState(false);
    
    const { data, setData, put, processing } = useForm({
        settings: {
            theme: project.settings?.theme || 'modern',
            font_family: project.settings?.font_family || 'serif',
            font_size: project.settings?.font_size || '12pt',
            line_height: project.settings?.line_height || '1.6',
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(update({ project: project.slug }).url, {
            onSuccess: () => setOpen(false),
        });
    };

    const updateField = (field: string, value: string) => {
        setData('settings', {
            ...data.settings,
            [field]: value
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" title="Thème d'export">
                    <Palette className="mr-2 h-4 w-4" />
                    Thème
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center">
                            <Palette className="mr-2 h-5 w-5" />
                            Personnalisation de l'Ebook
                        </DialogTitle>
                        <DialogDescription>
                            Choisissez le style visuel de vos exports PDF et HTML.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="theme">Thème global</Label>
                            <Select 
                                value={data.settings.theme} 
                                onValueChange={(v) => updateField('theme', v)}
                            >
                                <SelectTrigger id="theme">
                                    <SelectValue placeholder="Choisir un thème" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="modern">Moderne (Sans-serif, épuré)</SelectItem>
                                    <SelectItem value="classic">Classique (Serif, traditionnel)</SelectItem>
                                    <SelectItem value="playful">Ludique (Coloré, dynamique)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="font">Police de caractère</Label>
                            <Select 
                                value={data.settings.font_family} 
                                onValueChange={(v) => updateField('font_family', v)}
                            >
                                <SelectTrigger id="font">
                                    <SelectValue placeholder="Choisir une police" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="serif">Serif (Georgia, Times)</SelectItem>
                                    <SelectItem value="sans">Sans-serif (Inter, Arial)</SelectItem>
                                    <SelectItem value="mono">Monospace (Courier)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="size">Taille texte</Label>
                                <Select 
                                    value={data.settings.font_size} 
                                    onValueChange={(v) => updateField('font_size', v)}
                                >
                                    <SelectTrigger id="size">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10pt">10pt</SelectItem>
                                        <SelectItem value="12pt">12pt</SelectItem>
                                        <SelectItem value="14pt">14pt</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="height">Interligne</Label>
                                <Select 
                                    value={data.settings.line_height} 
                                    onValueChange={(v) => updateField('line_height', v)}
                                >
                                    <SelectTrigger id="height">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1.2">1.2 (Serré)</SelectItem>
                                        <SelectItem value="1.6">1.6 (Standard)</SelectItem>
                                        <SelectItem value="2.0">2.0 (Aéré)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <Button type="submit" disabled={processing} className="w-full">
                            {processing ? 'Enregistrement...' : 'Appliquer les styles'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
