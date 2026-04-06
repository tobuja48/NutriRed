import PageHeader from '@/components/layout/PageHeader';
import InventorySummary from '@/components/inventario/InventorySummary';
import CategoryGrid from '@/components/inventario/CategoryGrid';
import InventoryTable from '@/components/inventario/InventoryTable';

export default function Inventario() {
    return (
        <div>
            <PageHeader
                title="Inventario"
                subtitle="Estado actual del banco de alimentos"
            />

            <div className="space-y-6">
                <InventorySummary />
                <CategoryGrid />
                <InventoryTable />
            </div>
        </div>
    );
}
