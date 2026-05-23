import { useState } from 'react';
import { Package, Upload, AlertCircle, FileSpreadsheet, Plus, CheckCircle2, ArrowRightLeft, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

// Mock data
const mockInventory = [
    { id: '1', sku: 'PRD-773', name: 'Yogurt Griego Fresa', stock: 450, unit: 'kg', expiryDays: 12, status: 'warning' },
    { id: '2', sku: 'PRD-892', name: 'Pan de Molde Integral', stock: 120, unit: 'kg', expiryDays: 5, status: 'critical' },
    { id: '3', sku: 'PRD-104', name: 'Cereal de Avena (Cajas dañadas)', stock: 85, unit: 'kg', expiryDays: 45, status: 'ok' },
    { id: '4', sku: 'PRD-551', name: 'Queso Mozzarella', stock: 300, unit: 'kg', expiryDays: 8, status: 'critical' },
];

export default function InventarioEmpresa() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleUploadCSV = () => {
        setIsUploading(true);
        setUploadProgress(0);
        
        // Simular carga
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setIsUploading(false);
                        toast.success('Inventario sincronizado', {
                            description: 'Se han actualizado 450 referencias desde tu ERP.'
                        });
                    }, 500);
                    return 100;
                }
                return prev + 15;
            });
        }, 300);
    };

    const handleDonate = (productName: string) => {
        toast.success('Lote trasladado a Donación', {
            description: `${productName} ha sido marcado para recolección por el Banco de Alimentos.`
        });
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Control de Excedentes</h1>
                    <p className="text-slate-500 mt-1">Sincroniza y gestiona tu inventario con riesgo de merma.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button variant="outline" className="flex-1 sm:flex-none bg-white border-slate-200">
                        <Plus className="w-4 h-4 mr-2" />
                        Añadir Manual
                    </Button>
                    <Button 
                        onClick={handleUploadCSV}
                        disabled={isUploading}
                        className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    >
                        {isUploading ? (
                            <div className="flex items-center gap-2">
                                <span className="animate-spin border-2 border-white/20 border-t-white rounded-full w-4 h-4" />
                                Sincronizando...
                            </div>
                        ) : (
                            <>
                                <FileSpreadsheet className="w-4 h-4 mr-2" />
                                Sincronizar ERP
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Upload Progress Indicator */}
            {isUploading && (
                <Card className="border-blue-100 bg-blue-50/50">
                    <CardContent className="py-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-900">Analizando lotes próximos a vencer...</span>
                            <span className="text-sm font-bold text-blue-700">{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-2 bg-blue-100" indicatorClassName="bg-blue-600" />
                    </CardContent>
                </Card>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-5">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-slate-500">Valor de Merma en Riesgo</p>
                                <p className="text-2xl font-bold text-slate-900">$12.5M <span className="text-sm font-normal text-slate-500">COP</span></p>
                            </div>
                            <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                                <TrendingDown className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardContent className="p-5 relative z-10">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-slate-500">Donaciones (Mes)</p>
                                <p className="text-2xl font-bold text-slate-900">1,250 <span className="text-sm font-normal text-slate-500">kg</span></p>
                            </div>
                            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                                <Package className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-5">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-slate-500">Ahorro Estimado (Destrucción)</p>
                                <p className="text-2xl font-bold text-slate-900">$2.1M <span className="text-sm font-normal text-slate-500">COP</span></p>
                            </div>
                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Inventory List */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Excedentes Críticos</CardTitle>
                            <CardDescription>Productos sugeridos para donación inmediata por fecha de vencimiento</CardDescription>
                        </div>
                        <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
                            Acción Requerida
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                        {mockInventory.map((item) => (
                            <div key={item.id} className="p-4 sm:p-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={`mt-1 p-2 rounded-lg shrink-0 ${
                                        item.status === 'critical' ? 'bg-red-100 text-red-600' :
                                        item.status === 'warning' ? 'bg-amber-100 text-amber-600' :
                                        'bg-slate-100 text-slate-600'
                                    }`}>
                                        <AlertCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{item.name}</h3>
                                        <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                                            <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{item.sku}</span>
                                            <span>•</span>
                                            <span>{item.stock} {item.unit} disponibles</span>
                                        </div>
                                        {item.status === 'critical' && (
                                            <p className="text-xs font-medium text-red-600 mt-2">
                                                Vence en {item.expiryDays} días. Riesgo alto de pérdida total.
                                            </p>
                                        )}
                                        {item.status === 'warning' && (
                                            <p className="text-xs font-medium text-amber-600 mt-2">
                                                Vence en {item.expiryDays} días. Considerar donación.
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="w-full sm:w-auto mt-2 sm:mt-0 flex justify-end">
                                    <Button 
                                        onClick={() => handleDonate(item.name)}
                                        className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
                                    >
                                        <ArrowRightLeft className="w-4 h-4 mr-2" />
                                        Trasladar a Donación
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
