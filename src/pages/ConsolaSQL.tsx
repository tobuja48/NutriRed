import { useState, useEffect, useRef, useCallback } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database, Play, Code2, Network, Table2, Key } from 'lucide-react';
import { toast } from 'sonner';

import alasql from 'alasql';
import { useAppContext } from '@/contexts/AppContext';
import { municipios, categorias, productos, type Donante, type Lote, type Despacho } from '@/data/mockData';

/* ================= ER DIAGRAM COMPONENT ================= */

interface RelLine {
    x1: number; y1: number; x2: number; y2: number;
    color: string; label: string; dashed?: boolean;
}

function ERDiagram() {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const [lines, setLines] = useState<RelLine[]>([]);

    const calcLines = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();

        const getBox = (id: string) => {
            const el = container.querySelector(`[data-entity="${id}"]`) as HTMLElement | null;
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return {
                left: r.left - rect.left,
                right: r.right - rect.left,
                top: r.top - rect.top,
                bottom: r.bottom - rect.top,
                cx: (r.left + r.right) / 2 - rect.left,
                cy: (r.top + r.bottom) / 2 - rect.top,
            };
        };

        const donantes = getBox('donantes');
        const lotes = getBox('lotes');
        const productos = getBox('productos');
        const despachos = getBox('despachos');
        const municipios = getBox('municipios');
        const categorias = getBox('categorias');

        if (!donantes || !lotes || !productos || !despachos || !municipios || !categorias) return;

        const newLines: RelLine[] = [
            // Donantes → Lotes (donanteId)
            { x1: donantes.right, y1: donantes.cy, x2: lotes.left, y2: lotes.top + 65, color: '#d97706', label: '1 : N' },
            // Productos → Lotes (productoId)
            { x1: productos.left, y1: productos.cy, x2: lotes.right, y2: lotes.top + 45, color: '#2563eb', label: '1 : N' },
            // Lotes → Despachos (loteId)
            { x1: lotes.cx, y1: lotes.bottom, x2: despachos.cx, y2: despachos.top, color: '#4f46e5', label: '1 : N' },
            // Municipios → Lotes (municipioDestinoId)
            { x1: municipios.right, y1: municipios.cy - 10, x2: lotes.left, y2: lotes.bottom - 20, color: '#9333ea', label: '1 : N', dashed: true },
            // Municipios → Despachos (municipioId)
            { x1: municipios.right, y1: municipios.cy + 10, x2: despachos.left, y2: despachos.cy, color: '#7c3aed', label: '1 : N' },
            // Categorias → Productos (categoriaId)
            { x1: categorias.left, y1: categorias.cy, x2: productos.right, y2: productos.bottom - 20, color: '#e11d48', label: '1 : N' },
        ];
        setLines(newLines);
    }, []);

    useEffect(() => {
        // Initial calc after layout
        const timer = setTimeout(calcLines, 100);
        window.addEventListener('resize', calcLines);
        return () => { clearTimeout(timer); window.removeEventListener('resize', calcLines); };
    }, [calcLines]);

    const EntityBox = ({ id, title, color, fields, badge }: {
        id: string;
        title: string;
        color: string;
        fields: { name: string; type: string; isPK?: boolean; isFK?: boolean }[];
        badge?: string;
    }) => (
        <div data-entity={id} className="bg-white border-2 rounded-xl shadow-lg z-10 w-full transition-transform hover:scale-[1.02] hover:shadow-xl" style={{ borderColor: color }}>
            <div className="text-white font-bold text-center py-2.5 rounded-t-[10px] flex items-center justify-center gap-2 text-sm tracking-wide" style={{ backgroundColor: color }}>
                {title}
                {badge && <span className="text-[10px] font-normal bg-white/25 px-2 py-0.5 rounded-full">{badge}</span>}
            </div>
            <div className="p-3 text-xs font-mono space-y-1">
                {fields.map((f, i) => (
                    <div key={i} className={`flex justify-between items-center px-2 py-1.5 rounded ${
                        f.isPK ? 'bg-amber-50 border border-amber-200' :
                        f.isFK ? 'bg-slate-100 border border-slate-200 border-dashed' : ''
                    }`}>
                        <span className={`font-semibold flex items-center ${
                            f.isPK ? 'text-amber-700' : f.isFK ? 'text-slate-600' : 'text-slate-500'
                        }`}>
                            {(f.isPK || f.isFK) && <Key className="w-3 h-3 mr-1.5 shrink-0" />}
                            {f.name}
                        </span>
                        <span className="text-muted-foreground ml-2 whitespace-nowrap">{f.type}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <Card>
            <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-lg">Modelo Entidad-Relación (ER) de NutriRed</CardTitle>
                <CardDescription>Arquitectura relacional orientada a la Normalización de Datos (3NF) — las líneas muestran las relaciones FK → PK entre tablas.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 overflow-x-auto">
                {/* Legend */}
                <div className="flex flex-wrap gap-4 mb-6 text-xs items-center justify-center">
                    <span className="flex items-center gap-1.5"><span className="w-5 h-0.5 rounded" style={{ backgroundColor: '#d97706' }}></span>donanteId</span>
                    <span className="flex items-center gap-1.5"><span className="w-5 h-0.5 rounded" style={{ backgroundColor: '#2563eb' }}></span>productoId</span>
                    <span className="flex items-center gap-1.5"><span className="w-5 h-0.5 rounded" style={{ backgroundColor: '#4f46e5' }}></span>loteId</span>
                    <span className="flex items-center gap-1.5"><span className="w-5 h-0.5 rounded border-t-2 border-dashed" style={{ borderColor: '#9333ea' }}></span>municipioDestinoId (nullable)</span>
                    <span className="flex items-center gap-1.5"><span className="w-5 h-0.5 rounded" style={{ backgroundColor: '#7c3aed' }}></span>municipioId</span>
                    <span className="flex items-center gap-1.5"><span className="w-5 h-0.5 rounded" style={{ backgroundColor: '#e11d48' }}></span>categoriaId</span>
                </div>

                <div ref={containerRef} className="min-w-[780px] mx-auto grid grid-cols-3 gap-x-12 gap-y-10 relative items-start" style={{ gridTemplateRows: 'auto auto' }}>
                    {/* SVG relationship lines */}
                    <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
                        <defs>
                            {lines.map((l, i) => (
                                <marker key={`m-${i}`} id={`arrow-${i}`} viewBox="0 0 10 6" refX="9" refY="3" markerWidth="8" markerHeight="6" orient="auto-start-reverse">
                                    <path d="M 0 0 L 10 3 L 0 6 z" fill={l.color} />
                                </marker>
                            ))}
                        </defs>
                        {lines.map((l, i) => {
                            const dx = l.x2 - l.x1;
                            const dy = l.y2 - l.y1;
                            const mx = l.x1 + dx * 0.5;
                            const my = l.y1 + dy * 0.5;
                            // Control points for a nice curve
                            const cx1 = l.x1 + dx * 0.3;
                            const cy1 = l.y1;
                            const cx2 = l.x2 - dx * 0.3;
                            const cy2 = l.y2;
                            return (
                                <g key={i}>
                                    <path
                                        d={`M ${l.x1} ${l.y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${l.x2} ${l.y2}`}
                                        stroke={l.color}
                                        strokeWidth="2.5"
                                        fill="none"
                                        strokeDasharray={l.dashed ? '6,4' : 'none'}
                                        markerEnd={`url(#arrow-${i})`}
                                        opacity={0.8}
                                    />
                                    {/* Cardinality label */}
                                    <rect x={mx - 16} y={my - 10} width="32" height="18" rx="4" fill="white" stroke={l.color} strokeWidth="1" opacity="0.95" />
                                    <text x={mx} y={my + 3} textAnchor="middle" fontSize="9" fontWeight="bold" fill={l.color}>{l.label}</text>
                                </g>
                            );
                        })}
                    </svg>

                    {/* Row 1: DONANTES — LOTES — PRODUCTOS */}
                    <EntityBox id="donantes" title="DONANTES" color="#d97706" fields={[
                        { name: 'id', type: 'INT (PK)', isPK: true },
                        { name: 'nombre', type: 'VARCHAR' },
                        { name: 'tipo', type: 'ENUM' },
                        { name: 'ciudad', type: 'VARCHAR' },
                        { name: 'contacto', type: 'VARCHAR' },
                        { name: 'telefono', type: 'VARCHAR' },
                    ]} />

                    <EntityBox id="lotes" title="LOTES" color="#16a34a" badge="Tabla Central" fields={[
                        { name: 'id', type: 'INT (PK)', isPK: true },
                        { name: 'productoId', type: 'INT (FK)', isFK: true },
                        { name: 'donanteId', type: 'INT (FK)', isFK: true },
                        { name: 'municipioDestinoId', type: 'INT (FK) NULL', isFK: true },
                        { name: 'codigo', type: 'VARCHAR' },
                        { name: 'cantidadKg', type: 'DECIMAL' },
                        { name: 'estado', type: 'ENUM' },
                        { name: 'calidad', type: 'ENUM' },
                    ]} />

                    <EntityBox id="productos" title="PRODUCTOS" color="#2563eb" fields={[
                        { name: 'id', type: 'INT (PK)', isPK: true },
                        { name: 'categoriaId', type: 'INT (FK)', isFK: true },
                        { name: 'nombre', type: 'VARCHAR' },
                        { name: 'unidadMedida', type: 'VARCHAR' },
                    ]} />

                    {/* Row 2: MUNICIPIOS — DESPACHOS — CATEGORIAS */}
                    <EntityBox id="municipios" title="MUNICIPIOS" color="#9333ea" fields={[
                        { name: 'id', type: 'INT (PK)', isPK: true },
                        { name: 'nombre', type: 'VARCHAR' },
                        { name: 'departamento', type: 'VARCHAR' },
                        { name: 'ipm', type: 'DECIMAL' },
                        { name: 'poblacion', type: 'INT' },
                        { name: 'distanciaKm', type: 'DECIMAL' },
                    ]} />

                    <EntityBox id="despachos" title="DESPACHOS" color="#4f46e5" fields={[
                        { name: 'id', type: 'INT (PK)', isPK: true },
                        { name: 'loteId', type: 'INT (FK)', isFK: true },
                        { name: 'municipioId', type: 'INT (FK)', isFK: true },
                        { name: 'fechaDespacho', type: 'DATE' },
                        { name: 'transportador', type: 'VARCHAR' },
                        { name: 'racionesEntregadas', type: 'INT' },
                        { name: 'estado', type: 'ENUM' },
                    ]} />

                    <EntityBox id="categorias" title="CATEGORÍAS" color="#e11d48" fields={[
                        { name: 'id', type: 'INT (PK)', isPK: true },
                        { name: 'nombre', type: 'ENUM' },
                        { name: 'icono', type: 'VARCHAR' },
                        { name: 'vidaUtilDias', type: 'INT' },
                    ]} />
                </div>

                {/* Summary */}
                <div className="mt-10 bg-slate-50 border p-4 rounded-lg text-sm text-slate-700 max-w-4xl mx-auto space-y-2 relative z-20">
                    <h4 className="font-semibold flex items-center gap-2 mb-3"><Database className="w-4 h-4" /> Conceptos de Normalización Logrados</h4>
                    <p><strong>Integridad Referencial (FK):</strong> Para saber el nombre del donante de un <strong>lote</strong> o de qué producto es, no repetimos texto aislado. Guardamos <code>productoId</code> y <code>donanteId</code> en el Lote referenciando a sus respectivos <code>id</code> (PK) en las otras entidades.</p>
                    <p><strong>Relaciones Simbólicas:</strong> Un Donante puede hacer muchos Lotes (1:N). Un Producto puede estar en múltiples Lotes (1:N). Un Lote pertenece a un único Despacho pero un Municipio recibe muchos Despachos (1:N).</p>
                    <p><strong>CRUD Activo:</strong> Cualquier registro nuevo en otra pantalla de la UI ejecuta una simulación Transaccional (Create, Read, Update, Delete) que se refleja en todo el front.</p>
                </div>
            </CardContent>
        </Card>
    );
}

const SQL_TEMPLATES = [
    { id: 1, label: 'Consulta simple (Filtro)', sql: "SELECT * FROM donantes WHERE tipo = 'Supermercado';" },
    { id: 2, label: 'JOIN Múltiple', sql: "SELECT l.codigo, p.nombre AS producto, d.nombre AS donante\nFROM lotes l\nJOIN productos p ON l.productoId = p.id\nJOIN donantes d ON l.donanteId = d.id;" },
    { id: 3, label: 'Subconsulta (IN)', sql: "SELECT nombre, departamento FROM municipios \nWHERE id IN (\n  SELECT municipioId FROM despachos\n);" },
    { id: 4, label: 'VIEW y Agregación', sql: "CREATE VIEW resumen_donantes AS\nSELECT d.nombre, COUNT(l.id) AS num_lotes, SUM(l.cantidadKg) AS total_kg\nFROM donantes d \nLEFT JOIN lotes l ON d.id = l.donanteId \nGROUP BY d.nombre;\n\nSELECT * FROM resumen_donantes;" },
    { id: 5, label: 'INSERT (Agregar donante)', sql: "INSERT INTO donantes (id, nombre, tipo, ciudad, contacto, telefono, totalDonacionesKg, donacionesCount)\nVALUES (99, 'Nuevo Donante', 'ONG', 'Cartagena', 'Ana López', '+57 320 111 2233', 0, 0);\nSELECT * FROM donantes WHERE id = 99;" },
    { id: 6, label: 'UPDATE (Modificar lote)', sql: "UPDATE lotes SET estado = 'Reservado' WHERE id = 1;\nSELECT * FROM lotes WHERE id = 1;" },
    { id: 7, label: 'DELETE (Eliminar despacho)', sql: "DELETE FROM despachos WHERE id = 8;\nSELECT * FROM despachos;" },
];

export default function ConsolaSQL() {
    const { allDonantes, lotes, despachos, setLotes, setDespachos, setDonantes } = useAppContext();
    const skipSync = useRef(false);

    const [query, setQuery] = useState(SQL_TEMPLATES[0].sql);
    const [results, setResults] = useState<any[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedTable, setSelectedTable] = useState('donantes');
    const [rawTableData, setRawTableData] = useState<any[]>([]);
    const [rawTableColumns, setRawTableColumns] = useState<string[]>([]);

    // Sincronizar el estado en vivo (React AppContext -> alaSQL)
    useEffect(() => {
        if (skipSync.current) {
            skipSync.current = false;
            return;
        }
        try {
            ['donantes', 'lotes', 'despachos', 'municipios', 'categorias', 'productos'].forEach(t => alasql(`DROP TABLE IF EXISTS ${t}`));

            alasql('CREATE TABLE donantes');
            alasql.tables.donantes.data = allDonantes.map(d => ({ ...d }));

            alasql('CREATE TABLE lotes');
            alasql.tables.lotes.data = lotes.map(l => ({ ...l }));

            alasql('CREATE TABLE despachos');
            alasql.tables.despachos.data = despachos.map(d => ({ ...d }));

            alasql('CREATE TABLE municipios');
            alasql.tables.municipios.data = municipios.map(m => ({ ...m }));

            alasql('CREATE TABLE categorias');
            alasql.tables.categorias.data = categorias.map(c => ({ ...c }));

            alasql('CREATE TABLE productos');
            alasql.tables.productos.data = productos.map(p => ({ ...p }));

            // Update current raw view
            updateRawView(selectedTable);
        } catch (err: any) {
            console.error('Error sincronizando DB:', err);
        }
    }, [allDonantes, lotes, despachos, selectedTable]);

    const updateRawView = (tableName: string) => {
        try {
            const data = alasql(`SELECT * FROM ${tableName}`);
            setRawTableData(data);
            if (data.length > 0) {
                setRawTableColumns(Object.keys(data[0]));
            } else {
                setRawTableColumns([]);
            }
        } catch {
            setRawTableData([]);
            setRawTableColumns([]);
        }
    };

    const handleTableSelect = (val: string) => {
        setSelectedTable(val);
        updateRawView(val);
    };

    const handleEjecutar = () => {
        if (!query.trim()) return;
        setError(null);
        setResults([]);
        setColumns([]);

        try {
            const queries = query.split(';').map(q => q.trim()).filter(Boolean);
            let lastRes: any = null;
            const DML_REGEX = /^\s*(INSERT|UPDATE|DELETE|ALTER|DROP|TRUNCATE)/i;
            let hasDML = false;

            for (const q of queries) {
                if (DML_REGEX.test(q)) hasDML = true;
                const res = alasql(q);
                if (Array.isArray(res) && res.length >= 0) {
                    lastRes = res;
                }
            }

            // Sync modified data back to React AppContext
            if (hasDML) {
                skipSync.current = true;
                try {
                    const newDonantes = alasql('SELECT * FROM donantes') as Donante[];
                    const newLotes = alasql('SELECT * FROM lotes') as Lote[];
                    const newDespachos = alasql('SELECT * FROM despachos') as Despacho[];
                    setDonantes(newDonantes);
                    setLotes(newLotes);
                    setDespachos(newDespachos);
                } catch { /* tabla podría no existir */ }
                updateRawView(selectedTable);
                toast.success('Modificación ejecutada y sincronizada con la aplicación.');
            }

            if (lastRes && lastRes.length > 0) {
                setResults(lastRes);
                setColumns(Object.keys(lastRes[0]));
            } else if (lastRes && lastRes.length === 0) {
                if (!hasDML) toast.info('Consulta ejecutada exitosamente, pero 0 filas retornadas.');
            } else {
                if (!hasDML) toast.success('Comando ejecutado exitosamente.');
            }
        } catch (err: any) {
            setError(err.message);
            toast.error('Error de sintaxis SQL');
        }
    };

    return (
        <div>
            <PageHeader
                title="Laboratorio de Base de Datos"
                subtitle="Entorno de pruebas interactivo: Todas las tablas del proyecto están cargadas y sincronizadas en tiempo real."
            />

            <Tabs defaultValue="consola" className="space-y-6">
                <TabsList className="bg-white border text-muted-foreground p-1 h-12 w-full sm:w-auto overflow-x-auto justify-start">
                    <TabsTrigger value="consola" className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700 h-9 px-4">
                        <Code2 className="w-4 h-4 mr-2" /> Consola SQL
                    </TabsTrigger>
                    <TabsTrigger value="tablas" className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700 h-9 px-4">
                        <Table2 className="w-4 h-4 mr-2" /> Explorador de Datos
                    </TabsTrigger>
                    <TabsTrigger value="er" className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700 h-9 px-4">
                        <Network className="w-4 h-4 mr-2" /> Modelo Relacional (ER)
                    </TabsTrigger>
                </TabsList>

                {/* ================= CONSOLA TAB ================= */}
                <TabsContent value="consola">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 space-y-4">
                            <Card>
                                <CardHeader className="pb-3 bg-slate-50 border-b">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Database className="w-4 h-4" /> Entorno de Pruebas
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 text-sm space-y-4">
                                    <p className="text-muted-foreground">Tablas disponibles en memoria (sincronizadas con la UI):</p>

                                    <div className="space-y-1 text-xs">
                                        <p className="font-semibold px-2 py-1 bg-primary-50 rounded text-primary-800">donantes, lotes, despachos, municipios, categorias, productos</p>
                                    </div>

                                    <h4 className="font-semibold text-sm pt-2">Ejemplos Rápidos:</h4>
                                    <div className="space-y-2">
                                        {SQL_TEMPLATES.map(tpl => (
                                            <button
                                                key={tpl.id}
                                                onClick={() => setQuery(tpl.sql)}
                                                className="w-full text-left text-xs bg-white border border-border rounded-lg p-2 hover:border-primary-400 hover:shadow-sm transition"
                                            >
                                                <div className="font-semibold text-primary-700 mb-1">{tpl.label}</div>
                                                <code className="text-muted-foreground line-clamp-2">{tpl.sql}</code>
                                            </button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-2 space-y-4">
                            <Card>
                                <CardHeader className="pb-3 border-b flex flex-row items-center justify-between bg-slate-900 text-white rounded-t-xl">
                                    <CardTitle className="text-base flex items-center gap-2 text-slate-100">
                                        <Code2 className="w-4 h-4" /> Ejecutor
                                    </CardTitle>
                                    <Button size="sm" className="bg-primary-600 hover:bg-primary-500 text-white font-medium shadow-none h-8" onClick={handleEjecutar}>
                                        <Play className="w-3.5 h-3.5 mr-1" />
                                        Ejecutar
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Textarea
                                        value={query}
                                        onChange={e => setQuery(e.target.value)}
                                        placeholder="Escribe tu consulta SQL aquí..."
                                        className="min-h-[160px] font-mono text-sm border-0 focus-visible:ring-0 resize-none rounded-none w-full bg-[#1e293b] text-[#e2e8f0] p-4"
                                        spellCheck={false}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3 border-b bg-slate-50">
                                    <CardTitle className="text-base">Resultado</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 overflow-x-auto min-h-[200px]">
                                    {error ? (
                                        <div className="p-4 text-red-600 text-sm font-mono bg-red-50/50">
                                            <p className="font-bold mb-1">Error de ejecución:</p>
                                            {error}
                                        </div>
                                    ) : results.length > 0 ? (
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-muted hover:bg-muted">
                                                    {columns.map(col => (
                                                        <TableHead key={col} className="font-bold text-slate-700 whitespace-nowrap">{col}</TableHead>
                                                    ))}
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {results.map((row, i) => (
                                                    <TableRow key={i}>
                                                        {columns.map(col => (
                                                            <TableCell key={col} className="text-sm border-b whitespace-nowrap">
                                                                {row[col] !== null && typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col] ?? 'NULL')}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <div className="flex items-center justify-center h-full min-h-[150px] text-muted-foreground text-sm flex-col gap-2">
                                            <Database className="w-8 h-8 opacity-20" />
                                            El resultado de la consulta aparecerá aquí.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* ================= EXPLORADOR TAB ================= */}
                <TabsContent value="tablas">
                    <Card>
                        <CardHeader className="pb-3 bg-slate-50 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Table2 className="w-4 h-4 text-primary-600" /> Explorador de Datos
                                </CardTitle>
                                <CardDescription>
                                    Si agregas o modificas información en la Aplicación, se reflejará aquí en vivo.
                                </CardDescription>
                            </div>
                            <div className="shrink-0">
                                <Select value={selectedTable} onValueChange={handleTableSelect}>
                                    <SelectTrigger className="w-[180px] bg-white">
                                        <SelectValue placeholder="Seleccionar tabla" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="donantes">donantes</SelectItem>
                                        <SelectItem value="lotes">lotes</SelectItem>
                                        <SelectItem value="despachos">despachos</SelectItem>
                                        <SelectItem value="productos">productos</SelectItem>
                                        <SelectItem value="categorias">categorias</SelectItem>
                                        <SelectItem value="municipios">municipios</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 border-t overflow-x-auto min-h-[300px]">
                            {rawTableData.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted hover:bg-muted">
                                            {rawTableColumns.map(col => (
                                                <TableHead key={col} className="font-semibold whitespace-nowrap px-4 text-xs">
                                                    {col === 'id' ? <><Key className="w-3 h-3 inline mr-1 text-amber-500" />{col} (PK)</> :
                                                        col.endsWith('Id') ? <><Key className="w-3 h-3 inline mr-1 text-slate-400" />{col} (FK)</> : col}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {rawTableData.map((row, i) => (
                                            <TableRow key={row.id || i}>
                                                {rawTableColumns.map(col => (
                                                    <TableCell key={col} className="px-4 text-sm border-b">
                                                        {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col])}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
                                    La tabla está vacía.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ================= ER MODEL TAB ================= */}
                <TabsContent value="er">
                    <ERDiagram />
                </TabsContent>

            </Tabs>
        </div>
    );
}
