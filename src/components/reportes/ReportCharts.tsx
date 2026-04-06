import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useAppContext } from '@/contexts/AppContext';
import { getEvolucionMensual, getDistribucionCategoria, getDonanteRanking } from '@/data/mockData';

const COLORS = ['#22c55e', '#3b82f6', '#eab308', '#ef4444', '#f97316', '#8b5cf6'];

export default function ReportCharts() {
    const { lotes } = useAppContext();
    const evolucion = getEvolucionMensual();
    const distribucion = getDistribucionCategoria(lotes);
    const topDonantes = getDonanteRanking(lotes).slice(0, 5);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Line chart */}
            <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Evolución mensual de donaciones</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={evolucion}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                <Line
                                    type="monotone"
                                    dataKey="kg"
                                    stroke="#16a34a"
                                    strokeWidth={3}
                                    dot={{ fill: '#16a34a', r: 5 }}
                                    activeDot={{ r: 7 }}
                                    name="Kg donados"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Pie chart */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Distribución por categoría</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={distribucion}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {distribucion.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Top donantes bar chart */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Top 5 donantes por volumen</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topDonantes.map(d => ({ nombre: d.donante.nombre.split(' ').slice(0, 2).join(' '), kg: d.totalKg }))} layout="vertical" margin={{ left: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis dataKey="nombre" type="category" tick={{ fontSize: 11, fill: '#64748b' }} width={100} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} formatter={(v: number) => [`${v.toLocaleString('es-CO')} kg`]} />
                                <Bar dataKey="kg" radius={[0, 6, 6, 0]} maxBarSize={30}>
                                    {topDonantes.map((_, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
