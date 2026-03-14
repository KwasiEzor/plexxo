import { useForm } from '@inertiajs/react';
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
import { store as projectsStore } from '@/actions/App/Http/Controllers/ProjectController';
import { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';

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
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau Projet
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Créer un Ebook</DialogTitle>
                        <DialogDescription>
                            Entrez le titre et le sujet de votre ebook. L'IA générera ensuite un plan détaillé.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Titre de l'ebook</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="ex: Guide du SEO en 2026"
                                required
                            />
                            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="language">Langue</Label>
                            <Select value={data.language} onValueChange={(value) => setData('language', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choisir une langue" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fr">Français</SelectItem>
                                    <SelectItem value="en">Anglais</SelectItem>
                                    <SelectItem value="es">Espagnol</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.language && <p className="text-sm text-red-500">{errors.language}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description / Sujet détaillé</Label>
                            <Input
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="De quoi doit parler l'ebook ?"
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Générer le plan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
