import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAppContext } from '@/contexts/AppContext';
import { getDonacionesPorCategoria } from '@/data/mockData';

export default function CategoryChart() {
    const { lotes } = useAppContext();
    const data = getDonacionesPorCategoria(lotes);

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Donaciones por categoría este mes</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis
                                dataKey="categoria"
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                angle={-20}
                                textAnchor="end"
                                height={60}
                            />
                            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                    fontSize: '13px',
                                }}
                                formatter={(value: number) => [`${value.toLocaleString('es-CO')} kg`, 'Donado']}
                            />
                            <Bar dataKey="kg" radius={[6, 6, 0, 0]} maxBarSize={50}>
                                {data.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
