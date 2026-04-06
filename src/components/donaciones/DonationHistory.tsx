import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Search, Package } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppContext } from '@/contexts/AppContext';
import { getProducto, getDonante, getCategoriaByProducto, formatFechaCorta, categorias } from '@/data/mockData';

const estadoVariant: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
    Disponible: 'success',
    Reservado: 'warning',
    Despachado: 'secondary',
    Vencido: 'destructive',
};

const calidadColor: Record<string, string> = {
    'Óptima': 'text-green-600',
    'Buena': 'text-blue-600',
    'Regular': 'text-amber-600',
};

export default function DonationHistory() {
    const { lotes } = useAppContext();
    const [search, setSearch] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('todos');
    const [catFilter, setCatFilter] = useState('todos');
    const [page, setPage] = useState(0);
    const perPage = 10;

    const filtered = useMemo(() => {
        return lotes.filter(l => {
            const producto = getProducto(l.productoId);
            const donante = getDonante(l.donanteId);
            const searchLower = search.toLowerCase();

            const matchSearch = !search ||
                producto?.nombre.toLowerCase().includes(searchLower) ||
                l.codigo.toLowerCase().includes(searchLower) ||
                donante?.nombre.toLowerCase().includes(searchLower);

            const matchEstado = estadoFilter === 'todos' || l.estado === estadoFilter;
            const matchCat = catFilter === 'todos' || (producto && producto.categoriaId === Number(catFilter));

            return matchSearch && matchEstado && matchCat;
        }).sort((a, b) => b.id - a.id);
    }, [lotes, search, estadoFilter, catFilter]);

    const totalPages = Math.ceil(filtered.length / perPage);
    const paginated = filtered.slice(page * perPage, (page + 1) * perPage);

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">Historial de lotes</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por producto, lote o donante..."
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(0); }}
                            className="pl-9"
                        />
                    </div>
                    <Select value={estadoFilter} onValueChange={(v) => { setEstadoFilter(v); setPage(0); }}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos los estados</SelectItem>
                            <SelectItem value="Disponible">Disponible</SelectItem>
                            <SelectItem value="Reservado">Reservado</SelectItem>
                            <SelectItem value="Despachado">Despachado</SelectItem>
                            <SelectItem value="Vencido">Vencido</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={catFilter} onValueChange={(v) => { setCatFilter(v); setPage(0); }}>
                        <SelectTrigger className="w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todas las categorías</SelectItem>
                            {categorias.map(c => (
                                <SelectItem key={c.id} value={String(c.id)}>{c.icono} {c.nombre}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                {paginated.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p>No se encontraron lotes</p>
                    </div>
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Código</TableHead>
                                    <TableHead>Producto</TableHead>
                                    <TableHead className="hidden md:table-cell">Donante</TableHead>
                                    <TableHead className="text-right">Kg</TableHead>
                                    <TableHead className="hidden sm:table-cell">Ingreso</TableHead>
                                    <TableHead className="hidden sm:table-cell">Vencimiento</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="hidden lg:table-cell">Calidad</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginated.map(lote => {
                                    const producto = getProducto(lote.productoId);
                                    const donante = getDonante(lote.donanteId);
                                    const cat = getCategoriaByProducto(lote.productoId);
                                    return (
                                        <TableRow key={lote.id}>
                                            <TableCell className="font-mono text-xs text-muted-foreground">{lote.codigo}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-base">{cat?.icono}</span>
                                                    <span className="font-medium">{producto?.nombre}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-muted-foreground">{donante?.nombre}</TableCell>
                                            <TableCell className="text-right font-semibold">{lote.cantidadKg}</TableCell>
                                            <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">{formatFechaCorta(lote.fechaIngreso)}</TableCell>
                                            <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">{formatFechaCorta(lote.fechaVencimiento)}</TableCell>
                                            <TableCell>
                                                <Badge variant={estadoVariant[lote.estado]}>{lote.estado}</Badge>
                                            </TableCell>
                                            <TableCell className={`hidden lg:table-cell text-sm font-medium ${calidadColor[lote.calidad]}`}>
                                                {lote.calidad}
                                            </TableCell>
                                            <TableCell>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Ver detalle</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    Mostrando {page * perPage + 1}-{Math.min((page + 1) * perPage, filtered.length)} de {filtered.length}
                                </p>
                                <div className="flex gap-1">
                                    <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page === 0}>
                                        Anterior
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>
                                        Siguiente
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
