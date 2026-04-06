import { useState } from 'react';
import DonorCard from './DonorCard';
import DonorSheet from './DonorSheet';
import type { Donante } from '@/data/mockData';
import { useAppContext } from '@/contexts/AppContext';

export default function DonorGrid() {
    const { allDonantes } = useAppContext();
    const [selectedDonante, setSelectedDonante] = useState<Donante | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {allDonantes.map((d, i) => (
                    <DonorCard key={d.id} donante={d} index={i} onViewDetail={setSelectedDonante} />
                ))}
            </div>
            <DonorSheet donante={selectedDonante} open={!!selectedDonante} onClose={() => setSelectedDonante(null)} />
        </>
    );
}
