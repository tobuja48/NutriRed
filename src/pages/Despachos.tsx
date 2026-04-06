import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import DispatchSuggestions from '@/components/despachos/DispatchSuggestions';
import DispatchForm from '@/components/despachos/DispatchForm';
import DispatchHistory from '@/components/despachos/DispatchHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Despachos() {
    const location = useLocation();
    const state = location.state as { loteId?: number } | null;
    const [preselectedLoteId, setPreselectedLoteId] = useState<number | undefined>(state?.loteId);
    const [preselectedMunicipioId, setPreselectedMunicipioId] = useState<number | undefined>();
    const [activeTab, setActiveTab] = useState(state?.loteId ? 'registrar' : 'sugerencias');

    const handleConfirmSuggestion = (loteId: number, municipioId: number) => {
        setPreselectedLoteId(loteId);
        setPreselectedMunicipioId(municipioId);
        setActiveTab('registrar');
    };

    return (
        <div>
            <PageHeader
                title="Despachos"
                subtitle="Gestiona el envío de alimentos a municipios prioritarios"
            />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="sugerencias">Sugerencias automáticas</TabsTrigger>
                    <TabsTrigger value="registrar">Registrar despacho</TabsTrigger>
                    <TabsTrigger value="historial">Historial</TabsTrigger>
                </TabsList>
                <TabsContent value="sugerencias">
                    <DispatchSuggestions onConfirm={handleConfirmSuggestion} />
                </TabsContent>
                <TabsContent value="registrar">
                    <DispatchForm
                        preselectedLoteId={preselectedLoteId}
                        preselectedMunicipioId={preselectedMunicipioId}
                    />
                </TabsContent>
                <TabsContent value="historial">
                    <DispatchHistory />
                </TabsContent>
            </Tabs>
        </div>
    );
}
