import { Head } from '@inertiajs/react';
import { Send, Bot, User, Sparkles, Zap, BrainCircuit } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { assistant } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Assistant IA',
        href: assistant(),
    },
];

interface Message {
    role: 'assistant' | 'user';
    content: string;
    timestamp: string;
}

export default function Assistant({ messages: initialMessages, ai_stats }: { messages: Message[], ai_stats: any }) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        
        const newMessage: Message = {
            role: 'user',
            content: input,
            timestamp: new Date().toISOString(),
        };
        
        setMessages([...messages, newMessage]);
        setInput('');
        
        // Mock response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "C'est une excellente question ! En tant qu'assistant Plexxo, je peux vous aider à structurer vos chapitres, améliorer votre style ou même générer des idées de couvertures. Que souhaitez-vous approfondir ?",
                timestamp: new Date().toISOString(),
            }]);
        }, 1000);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Assistant IA" />
            
            <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Assistant IA</h1>
                        <p className="text-muted-foreground text-sm">Posez vos questions ou demandez de l'aide pour votre écriture.</p>
                    </div>
                    
                    <Card className="flex items-center gap-4 px-4 py-2 bg-primary/5 border-primary/10">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Tokens disponibles</span>
                            <span className="text-sm font-mono font-bold text-primary">{ai_stats.tokens_available.toLocaleString()}</span>
                        </div>
                        <div className="h-8 w-[1px] bg-primary/20" />
                        <BrainCircuit className="h-5 w-5 text-primary" />
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1 min-h-0">
                    {/* Main Chat Area */}
                    <Card className="md:col-span-3 flex flex-col overflow-hidden border-none bg-card/50 backdrop-blur-sm shadow-xl shadow-primary/5">
                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-6">
                                {messages.map((msg, i) => (
                                    <div 
                                        key={i} 
                                        className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                    >
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                                            msg.role === 'assistant' 
                                                ? 'bg-primary text-primary-foreground' 
                                                : 'bg-muted border border-border'
                                        }`}>
                                            {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                                        </div>
                                        <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                                            msg.role === 'assistant'
                                                ? 'bg-muted/50 border border-border'
                                                : 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                        }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="p-4 border-t bg-background/50">
                            <div className="relative flex items-center">
                                <Input 
                                    placeholder="Posez votre question à l'IA..." 
                                    className="pr-12 py-6 bg-background/50 border-primary/20 focus-visible:ring-primary/30"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <Button 
                                    size="icon" 
                                    className="absolute right-2 h-8 w-8 rounded-lg shadow-lg shadow-primary/20"
                                    onClick={handleSend}
                                >
                                    <Send size={16} />
                                </Button>
                            </div>
                            <p className="text-[10px] text-center text-muted-foreground mt-3">
                                L'IA peut faire des erreurs. Vérifiez les informations importantes.
                            </p>
                        </div>
                    </Card>

                    {/* Sidebar Suggestions */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 px-1">Actions suggérées</h3>
                        
                        {[
                            { title: "Analyser le style", icon: Sparkles, color: "text-amber-500", bg: "bg-amber-500/10" },
                            { title: "Générer un plan", icon: Zap, color: "text-primary", bg: "bg-primary/10" },
                            { title: "Traduire le texte", icon: BrainCircuit, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                        ].map((item, i) => (
                            <button 
                                key={i}
                                className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-card/50 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 group text-left"
                            >
                                <div className={`h-8 w-8 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                                    <item.icon className={`h-4 w-4 ${item.color}`} />
                                </div>
                                <span className="text-xs font-bold">{item.title}</span>
                            </button>
                        ))}
                        
                        <Card className="mt-8 p-4 bg-gradient-to-br from-primary/10 to-transparent border-primary/10">
                            <h4 className="text-xs font-bold mb-2">Plexxo Pro</h4>
                            <p className="text-[10px] text-muted-foreground mb-4">
                                Passez à Pro pour utiliser les modèles GPT-4o et Claude 3.5 Sonnet.
                            </p>
                            <Button size="sm" variant="outline" className="w-full text-[10px] h-8 border-primary/20 hover:bg-primary/10">
                                Voir les tarifs
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
