import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { getDonanteRanking } from '@/data/mockData';

const typeColors: Record<string, string> = {
    Supermercado: 'bg-blue-100 text-blue-700',
    Productor: 'bg-green-100 text-green-700',
    Restaurante: 'bg-purple-100 text-purple-700',
    Industria: 'bg-orange-100 text-orange-700',
    ONG: 'bg-pink-100 text-pink-700',
    'Persona natural': 'bg-slate-100 text-slate-700',
};

const avatarColors = ['bg-primary-600', 'bg-blue-600', 'bg-purple-600', 'bg-amber-600', 'bg-pink-600'];

function getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

export default function TopDonorsPanel() {
    const { lotes } = useAppContext();
    const ranking = getDonanteRanking(lotes).slice(0, 5);

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    Top donantes del mes
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {ranking.map((item, i) => (
                    <div key={item.donante.id} className="flex items-center gap-3">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${avatarColors[i % avatarColors.length]} text-white flex items-center justify-center text-xs font-bold`}>
                            {getInitials(item.donante.nombre)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold truncate">{item.donante.nombre}</span>
                                <Badge className={`text-[10px] px-1.5 py-0 ${typeColors[item.donante.tipo] || ''}`}>
                                    {item.donante.tipo}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <Progress value={item.porcentaje} className="h-1.5 flex-1" />
                                <span className="text-xs text-muted-foreground font-medium w-16 text-right">
                                    {item.totalKg.toLocaleString('es-CO')} kg
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
