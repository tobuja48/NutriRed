import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, MapPin, Eye } from 'lucide-react';
import type { Donante } from '@/data/mockData';

const typeColors: Record<string, string> = {
    Supermercado: 'bg-blue-100 text-blue-700',
    Productor: 'bg-green-100 text-green-700',
    Restaurante: 'bg-purple-100 text-purple-700',
    Industria: 'bg-orange-100 text-orange-700',
    ONG: 'bg-pink-100 text-pink-700',
    'Persona natural': 'bg-slate-100 text-slate-700',
};

const avatarColors = ['bg-primary-600', 'bg-blue-600', 'bg-purple-600', 'bg-amber-600', 'bg-pink-600', 'bg-teal-600', 'bg-rose-600', 'bg-cyan-600'];

function getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

interface Props {
    donante: Donante;
    index: number;
    onViewDetail: (donante: Donante) => void;
}

export default function DonorCard({ donante, index, onViewDetail }: Props) {
    return (
        <Card className="transition-all duration-200 hover:shadow-md">
            <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full ${avatarColors[index % avatarColors.length]} text-white flex items-center justify-center text-sm font-bold`}>
                        {getInitials(donante.nombre)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{donante.nombre}</h3>
                        <Badge className={`mt-1 text-[10px] ${typeColors[donante.tipo] || ''}`}>{donante.tipo}</Badge>
                    </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{donante.ciudad}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{donante.telefono}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t">
                    <div className="text-center">
                        <p className="text-xl font-bold text-primary-600">{donante.totalDonacionesKg.toLocaleString('es-CO')}</p>
                        <p className="text-[11px] text-muted-foreground">kg donados</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-bold text-foreground">{donante.donacionesCount}</p>
                        <p className="text-[11px] text-muted-foreground">donaciones</p>
                    </div>
                </div>

                <Button variant="outline" className="w-full mt-4" size="sm" onClick={() => onViewDetail(donante)}>
                    <Eye className="w-4 h-4 mr-2" />
                    Ver detalle
                </Button>
            </CardContent>
        </Card>
    );
}
