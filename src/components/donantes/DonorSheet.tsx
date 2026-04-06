import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Donante } from '@/data/mockData';
import { useAppContext } from '@/contexts/AppContext';
import { getProducto, formatFechaCorta } from '@/data/mockData';
import { MapPin, Phone, User } from 'lucide-react';

interface Props {
    donante: Donante | null;
    open: boolean;
    onClose: () => void;
}

export default function DonorSheet({ donante, open, onClose }: Props) {
    const { lotes } = useAppContext();

    if (!donante) return null;

    const donanteLotes = lotes.filter(l => l.donanteId === donante.id).sort((a, b) => b.id - a.id);

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{donante.nombre}</SheetTitle>
                    <SheetDescription>Detalle del donante</SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                    <Badge className="text-xs">{donante.tipo}</Badge>

                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" /> {donante.ciudad}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="w-4 h-4" /> {donante.contacto}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-4 h-4" /> {donante.telefono}
                        </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-primary-50 rounded-lg">
                            <p className="text-2xl font-bold text-primary-600">{donante.totalDonacionesKg.toLocaleString('es-CO')}</p>
                            <p className="text-xs text-muted-foreground">kg totales</p>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                            <p className="text-2xl font-bold text-foreground">{donante.donacionesCount}</p>
                            <p className="text-xs text-muted-foreground">donaciones</p>
                        </div>
                    </div>

                    <Separator />

                    <h3 className="font-semibold text-sm">Historial de lotes ({donanteLotes.length})</h3>

                    {donanteLotes.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Sin lotes registrados</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs">Producto</TableHead>
                                    <TableHead className="text-xs text-right">Kg</TableHead>
                                    <TableHead className="text-xs">Fecha</TableHead>
                                    <TableHead className="text-xs">Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {donanteLotes.map(l => {
                                    const prod = getProducto(l.productoId);
                                    return (
                                        <TableRow key={l.id}>
                                            <TableCell className="text-xs">{prod?.nombre}</TableCell>
                                            <TableCell className="text-xs text-right font-semibold">{l.cantidadKg}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground">{formatFechaCorta(l.fechaIngreso)}</TableCell>
                                            <TableCell>
                                                <Badge variant={l.estado === 'Disponible' ? 'success' : l.estado === 'Vencido' ? 'destructive' : 'secondary'} className="text-[10px]">
                                                    {l.estado}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
