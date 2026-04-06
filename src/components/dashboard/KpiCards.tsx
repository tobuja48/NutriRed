import { Package, AlertTriangle, MapPin, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/contexts/AppContext';
import { getKpiSummary } from '@/data/mockData';

export default function KpiCards() {
    const { lotes, despachos } = useAppContext();
    const kpi = getKpiSummary(lotes, despachos);

    const cards = [
        {
            label: 'Kg activos en inventario',
            value: kpi.totalKgActivos.toLocaleString('es-CO'),
            icon: Package,
            color: 'text-primary-600',
            bgColor: 'bg-primary-50',
            borderColor: 'border-primary-200',
        },
        {
            label: 'Lotes en alerta crítica',
            value: kpi.lotesEnAlerta.toString(),
            icon: AlertTriangle,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            pulse: kpi.lotesEnAlerta > 0,
        },
        {
            label: 'Municipios atendidos',
            value: kpi.municipiosCubiertos.toString(),
            icon: MapPin,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
        },
        {
            label: 'Raciones estimadas',
            value: kpi.racionesEstimadas.toLocaleString('es-CO'),
            icon: Users,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <Card key={card.label} className={cn('relative overflow-hidden transition-all duration-200 hover:shadow-md', card.borderColor)}>
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">{card.label}</p>
                                    <p className={cn('text-3xl font-bold mt-2 tracking-tight', card.color, card.pulse && 'animate-pulse-slow')}>
                                        {card.value}
                                    </p>
                                </div>
                                <div className={cn('flex items-center justify-center w-11 h-11 rounded-xl', card.bgColor)}>
                                    <Icon className={cn('w-6 h-6', card.color)} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
