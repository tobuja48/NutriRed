import { Routes, Route } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import Dashboard from '@/pages/Dashboard';
import Donaciones from '@/pages/Donaciones';
import Inventario from '@/pages/Inventario';
import Despachos from '@/pages/Despachos';
import Donantes from '@/pages/Donantes';
import Reportes from '@/pages/Reportes';
import ConsolaSQL from '@/pages/ConsolaSQL';
import Chatbot from '@/components/layout/Chatbot';

export default function App() {
    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Sidebar />
            <MobileNav />
            <main className="lg:ml-60 min-h-screen">
                <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 max-w-7xl">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/donaciones" element={<Donaciones />} />
                        <Route path="/inventario" element={<Inventario />} />
                        <Route path="/despachos" element={<Despachos />} />
                        <Route path="/donantes" element={<Donantes />} />
                        <Route path="/reportes" element={<Reportes />} />
                        <Route path="/sql" element={<ConsolaSQL />} />
                    </Routes>
                </div>
            </main>
            <Chatbot />
        </div>
    );
}
