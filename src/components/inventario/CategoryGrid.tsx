import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAppContext } from '@/contexts/AppContext';
import { categorias, getProducto, getDiasRestantes } from '@/data/mockData';

export default function CategoryGrid() {
    const { lotes } = useAppContext();
    const activeLotes = lotes.filter(l => l.estado === 'Disponible' || l.estado === 'Reservado');
    const totalKg = activeLotes.reduce((s, l) => s + l.cantidadKg, 0);

    const categoryData = categorias.map(cat => {
        const catLotes = activeLotes.filter(l => {
            const p = getProducto(l.productoId);
            return p && p.categoriaId === cat.id;
        });
        const kg = catLotes.reduce((s, l) => s + l.cantidadKg, 0);
        const alertCount = catLotes.filter(l => getDiasRestantes(l.fechaVencimiento) <= 3).length;
        return { ...cat, kg, lotesCount: catLotes.length, alertCount, pct: totalKg > 0 ? (kg / totalKg) * 100 : 0 };
    });

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryData.map(cat => (
                <Card key={cat.id} className="transition-all duration-200 hover:shadow-md">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{cat.icono}</span>
                                <span className="font-semibold text-sm">{cat.nombre}</span>
                            </div>
                            {cat.alertCount > 0 && (
                                <Badge variant="destructive" className="text-[10px]">
                                    {cat.alertCount} en alerta
                                </Badge>
                            )}
                        </div>
                        <p className="text-2xl font-bold text-foreground">{cat.kg.toLocaleString('es-CO')} kg</p>
                        <div className="mt-3 space-y-1.5">
                            <Progress value={cat.pct} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{cat.lotesCount} lotes activos</span>
                                <span>{cat.pct.toFixed(1)}% del total</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
