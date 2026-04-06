import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Truck } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { getProducto, getMunicipio, formatFechaCorta } from '@/data/mockData';

const estadoVariant: Record<string, 'success' | 'warning' | 'default'> = {
    'Programado': 'warning',
    'En tránsito': 'default',
    'Entregado': 'success',
};

export default function DispatchHistory() {
    const { despachos, lotes } = useAppContext();
    const sorted = [...despachos].sort((a, b) => b.id - a.id);

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Truck className="w-5 h-5 text-primary-600" />
                    Historial de despachos
                </CardTitle>
            </CardHeader>
            <CardContent>
                {sorted.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Truck className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p>No hay despachos registrados</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Producto</TableHead>
                                <TableHead>Municipio</TableHead>
                                <TableHead className="hidden md:table-cell">Transportador</TableHead>
                                <TableHead className="text-right">Raciones</TableHead>
                                <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                                <TableHead>Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sorted.map(d => {
                                const lote = lotes.find(l => l.id === d.loteId);
                                const producto = lote ? getProducto(lote.productoId) : null;
                                const municipio = getMunicipio(d.municipioId);
                                return (
                                    <TableRow key={d.id}>
                                        <TableCell className="font-mono text-xs text-muted-foreground">#{d.id}</TableCell>
                                        <TableCell className="font-medium">{producto?.nombre || 'N/A'}</TableCell>
                                        <TableCell>
                                            <div>
                                                <span className="font-medium">{municipio?.nombre}</span>
                                                <span className="text-xs text-muted-foreground ml-1">({municipio?.departamento})</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground">{d.transportador}</TableCell>
                                        <TableCell className="text-right font-semibold">{d.racionesEntregadas.toLocaleString('es-CO')}</TableCell>
                                        <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">{formatFechaCorta(d.fechaDespacho)}</TableCell>
                                        <TableCell>
                                            <Badge variant={estadoVariant[d.estado]}>{d.estado}</Badge>
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
