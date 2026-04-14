import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import alasql from 'alasql';
import { useAppContext } from '@/contexts/AppContext';
import { municipios, categorias, productos } from '@/data/mockData';

interface Message {
    text: string;
    sender: 'bot' | 'user';
    sqlResult?: { columns: string[]; rows: any[] };
}

const FAQ = [
    { id: 1, label: '¿Qué es NutriRed?', text: '¿Qué es NutriRed y cómo ayuda en Colombia?' },
    { id: 2, label: '¿Cómo ruteo donaciones?', text: '¿Cómo funciona el ruteo inteligente de los lotes de despachos?' },
    { id: 3, label: 'Consulta SQL', text: '¿Cuántos lotes hay disponibles y cuál es el total de kg?' },
    { id: 4, label: 'Top donantes', text: 'Muéstrame los 3 donantes con más kg donados.' },
];

const SYSTEM_PROMPT = `
Eres el asistente virtual oficial de NutriRed. NutriRed es una plataforma de banco de alimentos en Colombia desarrollada con React, TypeScript, TailwindCSS v4, shadcn/ui y Vite.

CAPACIDAD ESPECIAL: Puedes ejecutar consultas SQL contra la base de datos del proyecto en tiempo real usando alaSQL.

## ESQUEMA DE LA BASE DE DATOS (alaSQL en memoria)

### Tabla: donantes
- id INT (PK)
- nombre VARCHAR
- tipo ENUM ('Supermercado','Productor','Restaurante','Industria','ONG','Persona natural')
- ciudad VARCHAR
- contacto VARCHAR
- telefono VARCHAR
- totalDonacionesKg INT
- donacionesCount INT

### Tabla: categorias
- id INT (PK)
- nombre ENUM ('Frutas y verduras','Lácteos','Granos y legumbres','Proteínas','Panadería','Enlatados')
- icono VARCHAR
- vidaUtilDias INT

### Tabla: productos
- id INT (PK)
- categoriaId INT (FK → categorias.id)
- nombre VARCHAR
- unidadMedida VARCHAR

### Tabla: municipios
- id INT (PK)
- nombre VARCHAR
- departamento VARCHAR
- ipm DECIMAL (Índice de Pobreza Multidimensional)
- poblacion INT
- distanciaKm DECIMAL

### Tabla: lotes
- id INT (PK)
- codigo VARCHAR
- productoId INT (FK → productos.id)
- donanteId INT (FK → donantes.id)
- cantidadKg DECIMAL
- fechaIngreso DATE (string ISO)
- fechaVencimiento DATE (string ISO)
- estado ENUM ('Disponible','Reservado','Despachado','Vencido')
- calidad ENUM ('Óptima','Buena','Regular')
- municipioDestinoId INT (FK → municipios.id, nullable)

### Tabla: despachos
- id INT (PK)
- loteId INT (FK → lotes.id)
- municipioId INT (FK → municipios.id)
- fechaDespacho DATE (string ISO)
- transportador VARCHAR
- racionesEntregadas INT
- estado ENUM ('Programado','En tránsito','Entregado')

## INSTRUCCIONES IMPORTANTES PARA CONSULTAS SQL

Cuando el usuario pida datos, estadísticas, listados, o cualquier cosa que se pueda responder con una consulta SQL:

1. Genera la consulta SQL correcta según el esquema de arriba.
2. SIEMPRE envuelve la consulta SQL en un bloque de código con triple backtick y la etiqueta "sql-exec". Ejemplo:
\`\`\`sql-exec
SELECT nombre, cantidadKg FROM lotes WHERE estado = 'Disponible';
\`\`\`
3. Después del bloque SQL, agrega una breve explicación de lo que la consulta hace.
4. IMPORTANTE para alaSQL:
   - NO uses la palabra "total" como alias (es palabra reservada), usa "cantidad", "suma", "resultado", etc.
   - NO uses DATE() function, compara fechas como strings directamente: fechaIngreso >= '2024-01-01'
   - Los nombres de columna son camelCase (cantidadKg, productoId, donanteId, etc.)
   - Para obtener nombre de producto desde lotes, haz JOIN con productos.
   - Para obtener nombre de donante desde lotes, haz JOIN con donantes.
   - Para obtener categoría de un producto, haz JOIN con categorias.

Si la pregunta NO requiere una consulta SQL (preguntas conceptuales, de la app, etc.), responde normalmente sin bloque sql-exec.

Actúa de forma amable, profesional, concisa. Usa viñetas y emojis ocasionales.
`;

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

// Sync alasql tables from AppContext
function syncAlasql(allDonantes: any[], lotes: any[], despachos: any[]) {
    try {
        ['donantes', 'lotes', 'despachos', 'municipios', 'categorias', 'productos'].forEach(t => {
            try { alasql(`DROP TABLE IF EXISTS ${t}`); } catch { /* ignore */ }
        });
        alasql('CREATE TABLE donantes'); alasql.tables.donantes.data = allDonantes.map(d => ({ ...d }));
        alasql('CREATE TABLE lotes'); alasql.tables.lotes.data = lotes.map(l => ({ ...l }));
        alasql('CREATE TABLE despachos'); alasql.tables.despachos.data = despachos.map(d => ({ ...d }));
        alasql('CREATE TABLE municipios'); alasql.tables.municipios.data = municipios.map(m => ({ ...m }));
        alasql('CREATE TABLE categorias'); alasql.tables.categorias.data = categorias.map(c => ({ ...c }));
        alasql('CREATE TABLE productos'); alasql.tables.productos.data = productos.map(p => ({ ...p }));
    } catch (e) {
        console.error('Chatbot syncAlasql error:', e);
    }
}

// Extract and execute sql-exec blocks from bot response
function extractAndRunSQL(text: string): { cleanText: string; result: { columns: string[]; rows: any[] } | null } {
    const regex = /```sql-exec\s*([\s\S]*?)```/g;
    let match: RegExpExecArray | null;
    let lastResult: { columns: string[]; rows: any[] } | null = null;

    while ((match = regex.exec(text)) !== null) {
        const sql = match[1].trim();
        try {
            const queries = sql.split(';').map(q => q.trim()).filter(Boolean);
            let res: any = null;
            for (const q of queries) {
                res = alasql(q);
            }
            if (Array.isArray(res) && res.length > 0) {
                lastResult = { columns: Object.keys(res[0]), rows: res };
            } else if (Array.isArray(res) && res.length === 0) {
                lastResult = { columns: [], rows: [] };
            }
        } catch (e: any) {
            lastResult = { columns: ['Error'], rows: [{ Error: e.message }] };
        }
    }

    // Remove the sql-exec blocks from text for display, but keep any explanation
    const cleanText = text.replace(/```sql-exec\s*[\s\S]*?```/g, '').trim();
    return { cleanText, result: lastResult };
}

export default function Chatbot() {
    const { allDonantes, lotes, despachos } = useAppContext();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { text: '¡Hola! Soy el asistente de NutriRed con IA. Puedo responder preguntas y también **ejecutar consultas SQL** en tiempo real sobre la base de datos. ¡Pregúntame lo que quieras! 🚀', sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, open, isLoading]);

    const fetchGroqResponse = async (userText: string, currentMessages: Message[]) => {
        setIsLoading(true);
        // Sync DB before querying
        syncAlasql(allDonantes, lotes, despachos);

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
                    temperature: 0.3,
                    max_tokens: 1500,
                })
            });

            if (!response.ok) throw new Error('Network error');
            const data = await response.json();
            const botResponse: string = data.choices[0].message.content;

            // Check for SQL blocks and execute them
            const { cleanText, result } = extractAndRunSQL(botResponse);

            setMessages(prev => [...prev, {
                text: cleanText || (result ? 'Consulta ejecutada:' : botResponse),
                sender: 'bot',
                sqlResult: result ?? undefined
            }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { text: 'Lo siento, tuve un problema al conectarme al servidor de IA. Revisa tu consola o la conexión a internet.', sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async (text: string) => {
        if (!text.trim() || isLoading) return;
        setMessages(prev => [...prev, { text, sender: 'user' }]);
        setInput('');
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
        <Card className="fixed bottom-6 right-6 w-80 sm:w-96 h-[540px] flex flex-col shadow-2xl z-50 border-amber-200">
            <CardHeader className="p-4 bg-amber-500 rounded-t-xl flex flex-row items-center justify-between space-y-0 text-white">
                <div className="flex items-center gap-2">
                    <div className="bg-white/20 p-1.5 rounded-full flex-shrink-0">
                        <Bot className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <CardTitle className="text-sm font-bold text-white truncate">NutriRed AI</CardTitle>
                        <p className="text-[10px] opacity-90 truncate">Powered by Groq · SQL habilitado</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-white flex-shrink-0 hover:bg-white/20 h-8 w-8 rounded-full">
                    <X className="w-5 h-5" />
                </Button>
            </CardHeader>

            <CardContent className="flex-1 p-0 flex flex-col overflow-hidden bg-slate-50">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, idx) => (
                        <div key={idx}>
                            <div className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white ${msg.sender === 'user' ? 'bg-slate-700' : 'bg-amber-500'}`}>
                                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>
                                <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${msg.sender === 'user' ? 'bg-white border text-foreground' : 'bg-amber-50 text-amber-900 border border-amber-100 rounded-tl-none'}`}>
                                    <div className="whitespace-pre-wrap">{msg.text}</div>
                                </div>
                            </div>
                            {/* SQL Result Table */}
                            {msg.sqlResult && msg.sqlResult.rows.length > 0 && (
                                <div className="mt-2 ml-10 mr-2">
                                    <div className="bg-white border border-emerald-200 rounded-lg overflow-hidden shadow-sm">
                                        <div className="bg-emerald-600 text-white text-[10px] font-bold px-3 py-1.5 flex items-center gap-1.5">
                                            <Database className="w-3 h-3" /> Resultado SQL ({msg.sqlResult.rows.length} fila{msg.sqlResult.rows.length !== 1 ? 's' : ''})
                                        </div>
                                        <div className="overflow-x-auto max-h-[180px] overflow-y-auto">
                                            <table className="w-full text-[11px]">
                                                <thead>
                                                    <tr className="bg-emerald-50">
                                                        {msg.sqlResult.columns.map(col => (
                                                            <th key={col} className="text-left px-2 py-1.5 font-bold text-emerald-800 whitespace-nowrap border-b border-emerald-100">{col}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {msg.sqlResult.rows.slice(0, 20).map((row, i) => (
                                                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                                            {msg.sqlResult!.columns.map(col => (
                                                                <td key={col} className="px-2 py-1 whitespace-nowrap border-b border-slate-100">
                                                                    {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col] ?? 'NULL')}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                    {msg.sqlResult.rows.length > 20 && (
                                                        <tr><td colSpan={msg.sqlResult.columns.length} className="text-center py-1 text-muted-foreground text-[10px]">...y {msg.sqlResult.rows.length - 20} filas más</td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {msg.sqlResult && msg.sqlResult.rows.length === 0 && (
                                <div className="mt-2 ml-10 mr-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-[11px] text-amber-700">
                                    <Database className="w-3 h-3 inline mr-1" /> La consulta no retornó resultados.
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-2 flex-row">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white bg-amber-500">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="bg-amber-50 border border-amber-100 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-2 text-sm text-amber-800">
                                <Loader2 className="w-4 h-4 animate-spin text-amber-600" /> Pensando...
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
                            placeholder="Pregunta o consulta SQL..."
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
