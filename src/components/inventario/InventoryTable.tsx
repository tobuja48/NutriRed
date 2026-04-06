import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { getProducto, getDonante, getCategoriaByProducto, formatFechaCorta, getDiasRestantes, municipios } from '@/data/mockData';
import { cn } from '@/lib/utils';

function getDiasColor(dias: number): string {
    if (dias <= 2) return 'bg-red-100 text-red-700';
    if (dias <= 5) return 'bg-orange-100 text-orange-700';
    if (dias <= 14) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
}

function getSuggestedMunicipio(): string {
    const sorted = [...municipios].sort((a, b) => b.ipm - a.ipm);
    return sorted[0]?.nombre || '';
}

export default function InventoryTable() {
    const { lotes } = useAppContext();

    const activeLotes = useMemo(() => {
        return lotes
            .filter(l => l.estado === 'Disponible' || l.estado === 'Reservado')
            .map(l => ({
                ...l,
                diasRestantes: getDiasRestantes(l.fechaVencimiento),
            }))
            .sort((a, b) => a.diasRestantes - b.diasRestantes);
    }, [lotes]);

    const municipiosSorted = useMemo(() =>
        [...municipios].sort((a, b) => b.ipm - a.ipm),
        []
    );

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">Inventario activo</CardTitle>
            </CardHeader>
            <CardContent>
                {activeLotes.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No hay lotes activos</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Producto</TableHead>
                                <TableHead>Lote</TableHead>
                                <TableHead className="hidden md:table-cell">Donante</TableHead>
                                <TableHead className="text-right">Kg</TableHead>
                                <TableHead>Días restantes</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="hidden lg:table-cell">Municipio sugerido</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activeLotes.map((lote, i) => {
                                const producto = getProducto(lote.productoId);
                                const donante = getDonante(lote.donanteId);
                                const cat = getCategoriaByProducto(lote.productoId);
                                const mun = municipiosSorted[i % municipiosSorted.length];
                                return (
                                    <TableRow key={lote.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5">
                                                <span>{cat?.icono}</span>
                                                <span className="font-medium">{producto?.nombre}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground">{lote.codigo}</TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground">{donante?.nombre}</TableCell>
                                        <TableCell className="text-right font-semibold">{lote.cantidadKg}</TableCell>
                                        <TableCell>
                                            <Badge className={cn('font-bold', getDiasColor(lote.diasRestantes))}>
                                                {lote.diasRestantes <= 0 ? 'Vencido' : `${lote.diasRestantes}d`}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={lote.estado === 'Disponible' ? 'success' : 'warning'}>{lote.estado}</Badge>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                                            {mun?.nombre} <span className="text-xs">(IPM: {mun?.ipm})</span>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
