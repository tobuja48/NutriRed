import { Card, CardContent } from '@/components/ui/card';
import { Droplets, Leaf, MapPin, Package, Users } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

export default function ImpactNumbers() {
    const { lotes, despachos } = useAppContext();

    const totalKgRescatados = lotes.reduce((s, l) => s + l.cantidadKg, 0);
    const racionesEntregadas = despachos.reduce((s, d) => s + d.racionesEntregadas, 0);
    const litrosAgua = totalKgRescatados * 214;
    const municipiosAlcanzados = new Set(despachos.map(d => d.municipioId)).size;
    const co2Evitado = totalKgRescatados * 0.58;

    const impacts = [
        { label: 'Kg rescatados', value: totalKgRescatados.toLocaleString('es-CO'), icon: Package, color: 'text-primary-600', bg: 'bg-primary-50' },
        { label: 'Raciones entregadas', value: racionesEntregadas.toLocaleString('es-CO'), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Litros de agua salvados', value: litrosAgua.toLocaleString('es-CO'), icon: Droplets, color: 'text-cyan-600', bg: 'bg-cyan-50' },
        { label: 'Municipios alcanzados', value: municipiosAlcanzados.toString(), icon: MapPin, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Kg CO₂ evitados', value: co2Evitado.toLocaleString('es-CO', { maximumFractionDigits: 0 }), icon: Leaf, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {impacts.map(item => {
                const Icon = item.icon;
                return (
                    <Card key={item.label} className="text-center transition-all duration-200 hover:shadow-md">
                        <CardContent className="p-5">
                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${item.bg} mb-3`}>
                                <Icon className={`w-6 h-6 ${item.color}`} />
                            </div>
                            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                            <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
