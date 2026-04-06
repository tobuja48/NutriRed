import { Card, CardContent } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';

export default function InventorySummary() {
    const { lotes } = useAppContext();

    const stats = [
        { label: 'Disponible', kg: lotes.filter(l => l.estado === 'Disponible').reduce((s, l) => s + l.cantidadKg, 0), color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Reservado', kg: lotes.filter(l => l.estado === 'Reservado').reduce((s, l) => s + l.cantidadKg, 0), color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Despachado', kg: lotes.filter(l => l.estado === 'Despachado').reduce((s, l) => s + l.cantidadKg, 0), color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Vencido', kg: lotes.filter(l => l.estado === 'Vencido').reduce((s, l) => s + l.cantidadKg, 0), color: 'text-red-600', bg: 'bg-red-50' },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map(s => (
                <Card key={s.label} className={`${s.bg} border-none`}>
                    <CardContent className="p-4 text-center">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.kg.toLocaleString('es-CO')} kg</p>
                        <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
