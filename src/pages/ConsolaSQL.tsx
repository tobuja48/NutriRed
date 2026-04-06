import { useState, useEffect } from 'react';
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
import { municipios, categorias, productos } from '@/data/mockData';

const SQL_TEMPLATES = [
    { id: 1, label: 'Consulta simple (Filtro)', sql: "SELECT * FROM donantes WHERE tipo = 'Supermercado';" },
    { id: 2, label: 'JOIN Múltiple', sql: "SELECT l.codigo, p.nombre AS producto, d.nombre AS donante\nFROM lotes l\nJOIN productos p ON l.productoId = p.id\nJOIN donantes d ON l.donanteId = d.id;" },
    { id: 3, label: 'Subconsulta (IN)', sql: "SELECT nombre, departamento FROM municipios \nWHERE id IN (\n  SELECT municipioId FROM despachos\n);" },
    { id: 4, label: 'VIEW y Agregación', sql: "CREATE VIEW resumen_donantes AS\nSELECT d.nombre, COUNT(l.id) AS num_lotes, SUM(l.cantidadKg) AS total_kg\nFROM donantes d \nLEFT JOIN lotes l ON d.id = l.donanteId \nGROUP BY d.nombre;\n\nSELECT * FROM resumen_donantes;" }
];

export default function ConsolaSQL() {
    const { allDonantes, lotes, despachos } = useAppContext();

    const [query, setQuery] = useState(SQL_TEMPLATES[0].sql);
    const [results, setResults] = useState<any[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedTable, setSelectedTable] = useState('donantes');
    const [rawTableData, setRawTableData] = useState<any[]>([]);
    const [rawTableColumns, setRawTableColumns] = useState<string[]>([]);

    // Sincronizar el estado en vivo (React AppContext -> alaSQL)
    useEffect(() => {
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

            for (const q of queries) {
                const res = alasql(q);
                if (Array.isArray(res) && res.length >= 0) {
                    lastRes = res;
                }
            }

            if (lastRes && lastRes.length > 0) {
                setResults(lastRes);
                setColumns(Object.keys(lastRes[0]));
            } else if (lastRes && lastRes.length === 0) {
                toast.info('Consulta ejecutada exitosamente, pero 0 filas retornadas.');
            } else {
                toast.success('Comando ejecutado exitosamente.');
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
                    <Card>
                        <CardHeader className="bg-slate-50 border-b">
                            <CardTitle className="text-lg">Modelo Entidad-Relación (ER) de NutriRed</CardTitle>
                            <CardDescription>Arquitectura relacional orientada a la Normalización de Datos (3NF) mapeando todo el proyecto.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 overflow-x-auto">

                            {/* ER Diagram Container */}
                            <div className="min-w-[800px] mx-auto grid grid-cols-3 gap-8 relative items-start">

                                {/* DONANTES */}
                                <div className="bg-white border rounded-lg shadow-sm z-10 w-full mb-8">
                                    <div className="bg-amber-600 text-white font-bold text-center py-2 rounded-t-lg">DONANTES</div>
                                    <div className="p-3 text-xs font-mono space-y-1">
                                        <div className="flex justify-between items-center bg-amber-50 px-2 py-1 rounded">
                                            <span className="font-bold flex items-center text-amber-700">
                                                <Key className="w-3 h-3 mr-1" /> id
                                            </span>
                                            <span className="text-muted-foreground">INT (PK)</span>
                                        </div>
                                        <div className="flex justify-between items-center px-2 py-1">
                                            <span>nombre, tipo, ciudad</span>
                                        </div>
                                    </div>
                                </div>

                                {/* LOTES (Centro) */}
                                <div className="bg-white border-2 border-primary-500 rounded-lg shadow-md z-10 w-full col-start-2 row-start-1">
                                    <div className="bg-primary-600 text-white font-bold text-center py-2 rounded-t-lg flex items-center justify-center gap-2">
                                        LOTES <span className="text-[10px] font-normal bg-white/20 px-2 py-0.5 rounded-full">Tabla Central</span>
                                    </div>
                                    <div className="p-3 text-xs font-mono space-y-1">
                                        <div className="flex justify-between items-center bg-amber-50 px-2 py-1 rounded">
                                            <span className="font-bold flex items-center text-amber-700">
                                                <Key className="w-3 h-3 mr-1" /> id
                                            </span>
                                            <span className="text-muted-foreground">INT (PK)</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-slate-100 px-2 py-1 rounded border border-slate-200 border-dashed">
                                            <span className="font-bold flex items-center text-slate-600">
                                                <Key className="w-3 h-3 mr-1" /> productoId
                                            </span>
                                            <span className="text-muted-foreground">INT (FK)</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-slate-100 px-2 py-1 rounded border border-slate-200 border-dashed">
                                            <span className="font-bold flex items-center text-slate-600">
                                                <Key className="w-3 h-3 mr-1" /> donanteId
                                            </span>
                                            <span className="text-muted-foreground">INT (FK)</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-slate-100 px-2 py-1 rounded border border-slate-200 border-dashed">
                                            <span className="font-bold flex items-center text-slate-600">
                                                <Key className="w-3 h-3 mr-1" /> municipioDestinoId
                                            </span>
                                            <span className="text-muted-foreground">INT (FK) null</span>
                                        </div>
                                        <div className="flex justify-between items-center px-2 py-1">
                                            <span>cantidadKg, estado, etc</span>
                                        </div>
                                    </div>
                                </div>

                                {/* PRODUCTOS */}
                                <div className="bg-white border rounded-lg shadow-sm z-10 w-full col-start-3 row-start-1 mb-8">
                                    <div className="bg-blue-600 text-white font-bold text-center py-2 rounded-t-lg">PRODUCTOS</div>
                                    <div className="p-3 text-xs font-mono space-y-1">
                                        <div className="flex justify-between items-center bg-amber-50 px-2 py-1 rounded">
                                            <span className="font-bold flex items-center text-amber-700">
                                                <Key className="w-3 h-3 mr-1" /> id
                                            </span>
                                            <span className="text-muted-foreground">INT (PK)</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-slate-100 px-2 py-1 rounded border border-slate-200 border-dashed">
                                            <span className="font-bold flex items-center text-slate-600">
                                                <Key className="w-3 h-3 mr-1" /> categoriaId
                                            </span>
                                            <span className="text-muted-foreground">INT (FK)</span>
                                        </div>
                                        <div className="flex justify-between items-center px-2 py-1">
                                            <span>nombre, vidaUtilDias</span>
                                        </div>
                                    </div>
                                </div>

                                {/* DESPACHOS */}
                                <div className="bg-white border rounded-lg shadow-sm z-10 w-full col-start-2 row-start-2 mt-4">
                                    <div className="bg-indigo-600 text-white font-bold text-center py-2 rounded-t-lg">DESPACHOS</div>
                                    <div className="p-3 text-xs font-mono space-y-1">
                                        <div className="flex justify-between items-center bg-amber-50 px-2 py-1 rounded">
                                            <span className="font-bold flex items-center text-amber-700">
                                                <Key className="w-3 h-3 mr-1" /> id
                                            </span>
                                            <span className="text-muted-foreground">INT (PK)</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-slate-100 px-2 py-1 rounded border border-slate-200 border-dashed">
                                            <span className="font-bold flex items-center text-slate-600">
                                                <Key className="w-3 h-3 mr-1" /> loteId
                                            </span>
                                            <span className="text-muted-foreground">INT (FK)</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-slate-100 px-2 py-1 rounded border border-slate-200 border-dashed">
                                            <span className="font-bold flex items-center text-slate-600">
                                                <Key className="w-3 h-3 mr-1" /> municipioId
                                            </span>
                                            <span className="text-muted-foreground">INT (FK)</span>
                                        </div>
                                        <div className="flex justify-between items-center px-2 py-1">
                                            <span>fechaDespacho, estado</span>
                                        </div>
                                    </div>
                                </div>

                                {/* MUNICIPIOS */}
                                <div className="bg-white border rounded-lg shadow-sm z-10 w-full col-start-1 row-start-2 mt-4">
                                    <div className="bg-purple-600 text-white font-bold text-center py-2 rounded-t-lg">MUNICIPIOS</div>
                                    <div className="p-3 text-xs font-mono space-y-1">
                                        <div className="flex justify-between items-center bg-amber-50 px-2 py-1 rounded">
                                            <span className="font-bold flex items-center text-amber-700">
                                                <Key className="w-3 h-3 mr-1" /> id
                                            </span>
                                            <span className="text-muted-foreground">INT (PK)</span>
                                        </div>
                                        <div className="flex justify-between items-center px-2 py-1">
                                            <span>nombre, IPM</span>
                                        </div>
                                    </div>
                                </div>

                                {/* CATEGORIAS */}
                                <div className="bg-white border rounded-lg shadow-sm z-10 w-full col-start-3 row-start-2 mt-4">
                                    <div className="bg-rose-600 text-white font-bold text-center py-2 rounded-t-lg">CATEGORIAS</div>
                                    <div className="p-3 text-xs font-mono space-y-1">
                                        <div className="flex justify-between items-center bg-amber-50 px-2 py-1 rounded">
                                            <span className="font-bold flex items-center text-amber-700">
                                                <Key className="w-3 h-3 mr-1" /> id
                                            </span>
                                            <span className="text-muted-foreground">INT (PK)</span>
                                        </div>
                                        <div className="flex justify-between items-center px-2 py-1">
                                            <span>nombre, tempRequerida</span>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Trazos (SVG background) */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none mt-10 opacity-30" style={{ zIndex: 0 }}>
                                {/* Donantes to Lotes */}
                                <path d="M 28% 10% C 40% 10%, 40% 10%, 50% 10%" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                                {/* Productos to Lotes */}
                                <path d="M 72% 10% C 60% 10%, 60% 10%, 50% 10%" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                            </svg>

                            <div className="mt-12 bg-slate-50 border p-4 rounded-lg text-sm text-slate-700 max-w-4xl mx-auto space-y-2 relative z-20">
                                <h4 className="font-semibold flex items-center gap-2 mb-3"><Database className="w-4 h-4" /> Conceptos de Normalización Logrados</h4>
                                <p><strong>Integridad Referencial (FK):</strong> Para saber el nombre del donante de un **lote** o de qué producto es, no repetimos texto asilado. Guardamos `productoId` y `donanteId` en el Lote referenciando a sus respectivos `id` (PK) en las otras entidades.</p>
                                <p><strong>Relaciones Simbólicas:</strong> Un Donante puede hacer muchos Lotes (1:N). Un Producto puede estar en múltiples Lotes (1:N). Un Lote pertenece a un único Despacho pero un Municipio recibe muchos Despachos (1:N).</p>
                                <p><strong>CRUD Activo:</strong> Cualquier registro nuevo en otra pantalla de la UI ejecuta una simulación Transaccional (Create, Read, Update, Delete) que se refleja en todo el front.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
}
