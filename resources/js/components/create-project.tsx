import { useForm } from '@inertiajs/react';
import { Loader2, Plus, Sparkles, Languages, Type, Layout } from 'lucide-react';
import { useState } from 'react';
import { store as projectsStore } from '@/actions/App/Http/Controllers/ProjectController';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function CreateProject() {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        language: 'fr',
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(projectsStore(), {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-blue-600 shadow-md transition-all hover:shadow-lg hover:scale-[1.02]">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvel Ebook
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-none shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-primary to-blue-600" />
                
                <form onSubmit={submit}>
                    <DialogHeader className="pt-4">
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            Lancer une création IA <Sparkles className="h-5 w-5 text-primary" />
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground/80">
                            Configurez les bases de votre prochain succès littéraire. L'IA de Plexxo s'occupe de la structure initiale.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-6 py-6">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold">
                                <Type className="h-4 w-4 text-primary/70" /> Titre de l'ouvrage
                            </Label>
                            <Input
                                id="title"
                                className="h-11 border-border/50 bg-muted/20 focus:bg-background transition-colors"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="ex: Le Futur de l'IA Générative"
                                required
                            />
                            {errors.title && <p className="text-xs font-medium text-destructive">{errors.title}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="language" className="flex items-center gap-2 text-sm font-semibold">
                                    <Languages className="h-4 w-4 text-primary/70" /> Langue
                                </Label>
                                <Select value={data.language} onValueChange={(value) => setData('language', value)}>
                                    <SelectTrigger className="h-11 border-border/50 bg-muted/20">
                                        <SelectValue placeholder="Langue" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fr">🇫🇷 Français</SelectItem>
                                        <SelectItem value="en">🇺🇸 Anglais</SelectItem>
                                        <SelectItem value="es">🇪🇸 Espagnol</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="template" className="flex items-center gap-2 text-sm font-semibold opacity-50">
                                    <Layout className="h-4 w-4" /> Style (Beta)
                                </Label>
                                <Select defaultValue="educational" disabled>
                                    <SelectTrigger className="h-11 border-border/50 bg-muted/10">
                                        <SelectValue placeholder="Éducatif" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="educational">Éducatif</SelectItem>
                                        <SelectItem value="narrative">Narratif</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold">
                                <Sparkles className="h-4 w-4 text-primary/70" /> Brief de contenu
                            </Label>
                            <Textarea
                                id="description"
                                className="min-h-[120px] resize-none border-border/50 bg-muted/20 focus:bg-background transition-colors"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Décrivez le sujet, le public cible et les points clés à aborder..."
                            />
                            {errors.description && <p className="text-xs font-medium text-destructive">{errors.description}</p>}
                            <p className="text-[10px] text-muted-foreground italic">
                                Plus votre description est précise, meilleur sera le plan généré.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="bg-muted/30 p-4 -mx-6 -mb-6 mt-2">
                        <Button 
                            type="submit" 
                            disabled={processing}
                            className="w-full h-11 bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 font-bold tracking-tight shadow-inner"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Initialisation de l'IA...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Générer le Plan Complet
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
