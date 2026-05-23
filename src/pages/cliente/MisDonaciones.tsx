import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, HandHeart } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { productos } from '@/data/mockData';

export default function MisDonaciones() {
    const { user } = useAuth();
    const { lotes, addLote, allDonantes } = useAppContext();
    
    // Encontrar el Donante asociado a este usuario
    const miDonante = allDonantes.find(d => d.nombre === user?.nombre);
    
    // Filtrar los lotes de este donante
    const misLotes = lotes.filter(l => l.donanteId === miDonante?.id).sort((a, b) => b.id - a.id);

    const [isOpen, setIsOpen] = useState(false);
    const [productoId, setProductoId] = useState('');
    const [cantidad, setCantidad] = useState('');

    const handleDonar = (e: React.FormEvent) => {
        e.preventDefault();
        if (!productoId || !cantidad) {
            toast.error('Por favor completa todos los campos.');
            return;
        }
        
        if (!miDonante) {
            toast.error('Error: No se encontró tu perfil de donante asociado.');
            return;
        }

        const newLoteId = lotes.length > 0 ? Math.max(...lotes.map(l => l.id)) + 1 : 1;
        
        addLote({
            id: newLoteId,
            codigo: `DON-${new Date().getFullYear()}-${String(newLoteId).padStart(4, '0')}`,
            productoId: parseInt(productoId),
            donanteId: miDonante.id,
            cantidadKg: parseFloat(cantidad),
            fechaIngreso: new Date().toISOString().split('T')[0],
            fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +30 días aprox
            estado: 'Disponible',
            calidad: 'Óptima',
            municipioDestinoId: null
        });

        setIsOpen(false);
        setProductoId('');
        setCantidad('');
        toast.success('¡Donación registrada con éxito en la red global! Gracias por tu aporte.');
    };

    const getProductName = (id: number) => productos.find(p => p.id === id)?.nombre || 'Desconocido';

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mis Donaciones</h1>
                    <p className="text-slate-500 mt-1">Gestiona el historial y estado de tus aportes.</p>
                </div>
                
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary-600 hover:bg-primary-700 shadow-sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Nueva Donación
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleDonar}>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <HandHeart className="w-5 h-5 text-primary-600" />
                                    Registrar Nueva Donación
                                </DialogTitle>
                                <DialogDescription>
                                    Ingresa los detalles de los alimentos que deseas donar. Tu donación aparecerá en el sistema del banco inmediatamente.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="producto">Producto o Alimento</Label>
                                    <Select value={productoId} onValueChange={setProductoId}>
                                        <SelectTrigger id="producto">
                                            <SelectValue placeholder="Selecciona un producto..." />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[200px]">
                                            {productos.map(p => (
                                                <SelectItem key={p.id} value={p.id.toString()}>{p.nombre} ({p.unidadMedida})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cantidad">Cantidad en Kg</Label>
                                    <Input 
                                        id="cantidad" 
                                        type="number" 
                                        min="0.1"
                                        step="0.1"
                                        placeholder="Ej: 50" 
                                        value={cantidad}
                                        onChange={(e) => setCantidad(e.target.value)}
                                    />
                                    <p className="text-[10px] text-muted-foreground">Por favor ingresa un peso aproximado en Kilogramos.</p>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white">Registrar Aporte</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-border shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Historial</CardTitle>
                    <CardDescription>Lista completa de todos tus aportes realizados.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Código</th>
                                    <th scope="col" className="px-6 py-3">Fecha</th>
                                    <th scope="col" className="px-6 py-3">Producto</th>
                                    <th scope="col" className="px-6 py-3">Cantidad</th>
                                    <th scope="col" className="px-6 py-3">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {misLotes.length > 0 ? misLotes.map((row) => (
                                    <tr key={row.id} className="bg-white border-b hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{row.codigo}</td>
                                        <td className="px-6 py-4">{row.fechaIngreso}</td>
                                        <td className="px-6 py-4">{getProductName(row.productoId)}</td>
                                        <td className="px-6 py-4">{row.cantidadKg} kg</td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className={
                                                row.estado === 'Disponible' ? "bg-amber-50 text-amber-700 border-amber-200" : 
                                                row.estado === 'Reservado' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                "bg-emerald-50 text-emerald-700 border-emerald-200"
                                            }>
                                                {row.estado}
                                            </Badge>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-muted-foreground">
                                            Aún no tienes donaciones registradas o no encontramos tu perfil.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
