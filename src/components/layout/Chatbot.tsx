import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Message {
    text: string;
    sender: 'bot' | 'user';
}

const FAQ = [
    { id: 1, label: '¿Qué es NutriRed?', text: '¿Qué es NutriRed y cómo ayuda en Colombia?' },
    { id: 2, label: '¿Cómo ruteo donaciones?', text: '¿Cómo funciona el ruteo inteligente de los lotes de despachos?' },
    { id: 3, label: '¿Conceptos SQL?', text: 'Explícame qué es una llave primaria y foránea en bases de datos.' },
];

const SYSTEM_PROMPT = `
Eres el asistente virtual oficial de NutriRed. NutriRed es una plataforma de banco de alimentos en Colombia desarrollada con React, TypeScript, TailwindCSS v4, shadcn/ui y Vite.
Tu objetivo es ayudar a los usuarios a entender la aplicación o responder dudas breves técnicas sobre el proyecto.

Información sobre el dominio:
- Inventario y Lotes: Productos donados que entran con una fecha de vencimiento. Se filtran por urgencia (Crítica, Alta, Media).
- Despachos: Sistema para enviar lotes de alimentos a municipios colombianos priorizando según la caducidad del lote y el **Índice de Pobreza Multidimensional (IPM)** del municipio destino.
- Donantes: Empresas y supermercados registrados que realizan donaciones en Kg.
- SQL en NutriRed: Existe una Consola SQL (con alaSQL) configurada para mostrar "clientes" y "ventas" en entorno web y de consola para demostrar dominio de Base de Datos. Funciones que debes poder explicar: Modelo ER, Normalización (3NF), CRUD, Primary Key (PK), Foreign Key (FK), JOIN, VIEW y subconsultas.

Información técnica:
El frontend usa estado in-memory (AppContext) con mocks, no tiene un backend DB real todavía, salvo la consola SQL virtual incorporada para consultas didácticas.

Actúa de forma muy amable, profesional, concisa pero completa. Usa viñetas para listar conceptos fácilmente y emojis ocasionales. Evita respuestas excesivamente largas.
`;

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

export default function Chatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { text: '¡Hola! Soy el asistente virtual impulsado por Inteligencia Artificial de NutriRed. Te puedo ayudar con información sobre la app o conceptos de Bases de Datos.', sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, open, isLoading]);

    const fetchGroqResponse = async (userText: string, currentMessages: Message[]) => {
        setIsLoading(true);
        try {
            const apiMessages = [
                { role: 'system', content: SYSTEM_PROMPT },
                ...currentMessages.map(m => ({
                    role: m.sender === 'user' ? 'user' : 'assistant',
                    content: m.text
                })),
                { role: 'user', content: userText }
            ];

            const response = await fetch('/api/groq/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama-3.1-8b-instant',
                    messages: apiMessages,
                    temperature: 0.7,
                    max_tokens: 1024,
                })
            });

            if (!response.ok) throw new Error('Network error');
            const data = await response.json();
            const botResponse = data.choices[0].message.content;

            setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { text: 'Lo siento, tuve un problema al conectarme al servidor de IA. Revisa tu consola o la conexión a internet.', sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async (text: string) => {
        if (!text.trim() || isLoading) return;

        // Optimistically update UI
        setMessages(prev => [...prev, { text, sender: 'user' }]);
        setInput('');

        // Fetch AI response
        await fetchGroqResponse(text, messages);
    };

    const handleFAQ = (faq: typeof FAQ[0]) => {
        handleSend(faq.text);
    };

    if (!open) {
        return (
            <Button
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-xl bg-amber-500 hover:bg-amber-600 animate-bounce transition-all"
                size="icon"
            >
                <MessageCircle className="w-6 h-6 text-white" />
            </Button>
        );
    }

    return (
        <Card className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] flex flex-col shadow-2xl z-50 border-amber-200">
            <CardHeader className="p-4 bg-amber-500 rounded-t-xl flex flex-row items-center justify-between space-y-0 text-white">
                <div className="flex items-center gap-2">
                    <div className="bg-white/20 p-1.5 rounded-full flex-shrink-0">
                        <Bot className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <CardTitle className="text-sm font-bold text-white truncate">NutriRed AI</CardTitle>
                        <p className="text-[10px] opacity-90 truncate">Powered by Groq</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-white flex-shrink-0 hover:bg-white/20 h-8 w-8 rounded-full">
                    <X className="w-5 h-5" />
                </Button>
            </CardHeader>

            <CardContent className="flex-1 p-0 flex flex-col overflow-hidden bg-slate-50">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white ${msg.sender === 'user' ? 'bg-slate-700' : 'bg-amber-500'}`}>
                                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${msg.sender === 'user' ? 'bg-white border text-foreground' : 'bg-amber-50 text-amber-900 border border-amber-100 rounded-tl-none'}`}>
                                <div className="whitespace-pre-wrap">{msg.text}</div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-2 flex-row">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white bg-amber-500">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="bg-amber-50 border border-amber-100 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-2 text-sm text-amber-800">
                                <Loader2 className="w-4 h-4 animate-spin text-amber-600" /> Escribiendo...
                            </div>
                        </div>
                    )}
                    <div ref={endRef} />
                </div>

                <div className="p-3 bg-white border-t border-border focus-within:ring-1 ring-amber-500 transition-all rounded-b-xl">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
                        {FAQ.map(faq => (
                            <button
                                key={faq.id}
                                onClick={() => handleFAQ(faq)}
                                disabled={isLoading}
                                className="flex-shrink-0 snap-start px-3 py-1.5 bg-secondary text-secondary-foreground text-xs rounded-full border hover:bg-amber-50 hover:text-amber-700 transition min-w-max disabled:opacity-50"
                            >
                                {faq.label}
                            </button>
                        ))}
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend(input);
                        }}
                        className="flex gap-2 mt-1 relative"
                    >
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Escribe tu consulta..."
                            className="text-sm h-10 pr-10 focus-visible:ring-amber-500"
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-1 top-1 bottom-1 h-8 w-8 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300"
                        >
                            <Send className="w-3.5 h-3.5" />
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}
