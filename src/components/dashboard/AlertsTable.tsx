import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Send } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { getLotesProximosVencer, getProducto, getDonante, formatFechaCorta, getDiasRestantes } from '@/data/mockData';

export default function AlertsTable() {
    const navigate = useNavigate();
    const { lotes } = useAppContext();
    const alertLotes = getLotesProximosVencer(lotes, 7);

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    Alertas de vencimiento
                </CardTitle>
            </CardHeader>
            <CardContent>
                {alertLotes.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <AlertTriangle className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p>No hay lotes próximos a vencer</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Producto</TableHead>
                                <TableHead>Lote</TableHead>
                                <TableHead className="hidden md:table-cell">Donante</TableHead>
                                <TableHead className="text-right">Cant. (kg)</TableHead>
                                <TableHead>Vence en</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {alertLotes.slice(0, 8).map((lote) => {
                                const producto = getProducto(lote.productoId);
                                const donante = getDonante(lote.donanteId);
                                const dias = getDiasRestantes(lote.fechaVencimiento);
                                const prioridad = dias <= 2 ? 'CRÍTICA' : 'ALTA';

                                return (
                                    <TableRow key={lote.id}>
                                        <TableCell className="font-medium">{producto?.nombre}</TableCell>
                                        <TableCell className="text-muted-foreground text-xs font-mono">{lote.codigo}</TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground">{donante?.nombre}</TableCell>
                                        <TableCell className="text-right font-semibold">{lote.cantidadKg}</TableCell>
                                        <TableCell>
                                            <span className={dias <= 2 ? 'text-red-600 font-bold' : 'text-amber-600 font-semibold'}>
                                                {dias <= 0 ? 'Vencido' : `${dias} día${dias !== 1 ? 's' : ''}`}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={prioridad === 'CRÍTICA' ? 'critical' : 'alta'}>
                                                {prioridad}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => navigate('/despachos', { state: { loteId: lote.id } })}
                                                className="text-primary-600 hover:text-primary-700"
                                            >
                                                <Send className="w-4 h-4 mr-1" />
                                                Despachar
                                            </Button>
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
