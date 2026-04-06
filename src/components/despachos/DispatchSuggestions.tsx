import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { getPrioridadDespacho } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface Props {
    onConfirm: (loteId: number, municipioId: number) => void;
}

const prioridadVariant: Record<string, 'critical' | 'alta' | 'media'> = {
    'CRÍTICA': 'critical',
    'ALTA': 'alta',
    'MEDIA': 'media',
};

const diasColor = (dias: number): string => {
    if (dias <= 2) return 'text-red-600';
    if (dias <= 5) return 'text-orange-600';
    return 'text-yellow-600';
};

export default function DispatchSuggestions({ onConfirm }: Props) {
    const { lotes } = useAppContext();
    const suggestions = getPrioridadDespacho(lotes);

    if (suggestions.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <Clock className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>No hay despachos sugeridos en este momento</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((s) => (
                <Card key={s.lote.id} className="transition-all duration-200 hover:shadow-md">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <Badge variant={prioridadVariant[s.prioridad]} className="text-xs">
                                {s.prioridad}
                            </Badge>
                            <span className={cn('text-2xl font-bold', diasColor(s.diasRestantes))}>
                                {s.diasRestantes}d
                            </span>
                        </div>

                        <h3 className="font-semibold text-foreground">{s.producto.nombre}</h3>
                        <p className="text-xs text-muted-foreground font-mono">{s.lote.codigo}</p>

                        <div className="flex items-center gap-3 mt-4 p-3 bg-muted rounded-lg">
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Origen</p>
                                <p className="text-sm font-medium">{s.donante.nombre}</p>
                                <p className="text-xs text-muted-foreground">{s.lote.cantidadKg} kg</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 text-right">
                                <p className="text-xs text-muted-foreground">Destino sugerido</p>
                                <p className="text-sm font-medium">{s.municipioSugerido.nombre}</p>
                                <p className="text-xs text-muted-foreground">
                                    {s.municipioSugerido.departamento} · IPM {s.municipioSugerido.ipm}
                                </p>
                            </div>
                        </div>

                        <Button
                            className="w-full mt-4"
                            onClick={() => onConfirm(s.lote.id, s.municipioSugerido.id)}
                        >
                            Confirmar despacho
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
