import PageHeader from '@/components/layout/PageHeader';
import DonationForm from '@/components/donaciones/DonationForm';
import DonationHistory from '@/components/donaciones/DonationHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Donaciones() {
    return (
        <div>
            <PageHeader
                title="Donaciones"
                subtitle="Registra nuevos lotes o consulta el historial de donaciones"
            />

            <Tabs defaultValue="nueva" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="nueva">Nueva donación</TabsTrigger>
                    <TabsTrigger value="historial">Historial</TabsTrigger>
                </TabsList>
                <TabsContent value="nueva">
                    <DonationForm />
                </TabsContent>
                <TabsContent value="historial">
                    <DonationHistory />
                </TabsContent>
            </Tabs>
        </div>
    );
}
