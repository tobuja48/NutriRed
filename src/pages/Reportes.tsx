import PageHeader from '@/components/layout/PageHeader';
import ImpactNumbers from '@/components/reportes/ImpactNumbers';
import ReportCharts from '@/components/reportes/ReportCharts';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

export default function Reportes() {
    return (
        <div>
            <PageHeader
                title="Reportes e Impacto"
                subtitle="Métricas de impacto social y ambiental de las donaciones"
                action={
                    <Button variant="outline" onClick={() => toast.info('Función próximamente disponible', { description: 'Exportar PDF será habilitado en la próxima versión' })}>
                        <Download className="w-4 h-4 mr-2" />
                        Exportar PDF
                    </Button>
                }
            />

            <div className="space-y-6">
                <ImpactNumbers />
                <ReportCharts />
            </div>
        </div>
    );
}
