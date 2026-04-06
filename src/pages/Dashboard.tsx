import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import KpiCards from '@/components/dashboard/KpiCards';
import AlertsTable from '@/components/dashboard/AlertsTable';
import CategoryChart from '@/components/dashboard/CategoryChart';
import TopDonorsPanel from '@/components/dashboard/TopDonorsPanel';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { formatFechaLarga } from '@/data/mockData';

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <div>
            <PageHeader
                title="Panel de Control"
                subtitle={formatFechaLarga(new Date())}
                action={
                    <Button onClick={() => navigate('/donaciones')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Registrar donación
                    </Button>
                }
            />

            <div className="space-y-6">
                <KpiCards />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <CategoryChart />
                    </div>
                    <TopDonorsPanel />
                </div>

                <AlertsTable />
            </div>
        </div>
    );
}
