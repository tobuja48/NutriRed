import { HandHeart, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getLotesProximosVencer } from '@/data/mockData';

export default function ClienteDashboard() {
    const { user } = useAuth();
    const { lotes, allDonantes } = useAppContext();

    // Encontrar perfil y lotes
    const miDonante = allDonantes.find(d => d.nombre === user?.nombre);
    const misLotes = lotes.filter(l => l.donanteId === miDonante?.id);
    
    const totalAportesKg = misLotes.reduce((sum, l) => sum + l.cantidadKg, 0);
    const donacionesEnProgreso = misLotes.filter(l => l.estado === 'Disponible').length;
    const donacionesEntregadas = misLotes.filter(l => l.estado === 'Despachado').length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hola, {user?.nombre || 'Donante'}</h1>
                <p className="text-slate-500 mt-1">Bienvenido a tu panel de control de NutriRed.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-border shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">Mis Aportes</p>
                                <p className="text-3xl font-bold text-foreground">{totalAportesKg} kg</p>
                            </div>
                            <div className="p-2 bg-primary-50 rounded-lg">
                                <HandHeart className="w-5 h-5 text-primary-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                            <span className="text-emerald-500 font-medium">+15% </span>
                            <span className="text-muted-foreground ml-1">vs mes anterior</span>
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="border-border shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">En Progreso</p>
                                <p className="text-3xl font-bold text-foreground">{donacionesEnProgreso}</p>
                            </div>
                            <div className="p-2 bg-amber-50 rounded-lg">
                                <Clock className="w-5 h-5 text-amber-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-muted-foreground">
                            <span>Donaciones pendientes de recogida</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">Entregadas</p>
                                <p className="text-3xl font-bold text-foreground">{donacionesEntregadas}</p>
                            </div>
                            <div className="p-2 bg-emerald-50 rounded-lg">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-muted-foreground">
                            <span>Donaciones completadas con éxito</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Actividad Reciente</CardTitle>
                    <CardDescription>Tus últimas donaciones registradas en la plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {misLotes.slice(0, 3).map((lote) => (
                            <div key={lote.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-100 bg-slate-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-md shadow-sm border border-slate-100">
                                        <HandHeart className="w-4 h-4 text-primary-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">Lote {lote.codigo}</p>
                                        <p className="text-xs text-slate-500">{lote.fechaIngreso}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-medium text-slate-700">{lote.cantidadKg} kg</span>
                                    <Badge variant="outline" className={lote.estado === 'Disponible' ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}>
                                        {lote.estado}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                        {misLotes.length === 0 && (
                            <div className="text-center py-6 text-slate-500">
                                Aún no hay donaciones recientes.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
