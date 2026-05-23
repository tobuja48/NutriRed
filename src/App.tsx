import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import Chatbot from '@/components/layout/Chatbot';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

// Pages - Auth
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import NotFound from '@/pages/NotFound';

// Pages - Banco
import Dashboard from '@/pages/Dashboard';
import Donaciones from '@/pages/Donaciones';
import Inventario from '@/pages/Inventario';
import Despachos from '@/pages/Despachos';
import Donantes from '@/pages/Donantes';
import Reportes from '@/pages/Reportes';
import ConsolaSQL from '@/pages/ConsolaSQL';

// Pages - Cliente
import ClienteDashboard from '@/pages/cliente/ClienteDashboard';
import MisDonaciones from '@/pages/cliente/MisDonaciones';
import Beneficios from '@/pages/cliente/Beneficios';
import InventarioEmpresa from '@/pages/cliente/InventarioEmpresa';

function AnimatedPage({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    return (
        <div key={location.pathname} className="animate-fade-in">
            {children}
        </div>
    );
}

function Layout() {
    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Sidebar />
            <MobileNav />
            <main className="lg:ml-60 min-h-screen">
                <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 max-w-7xl">
                    <AnimatedPage>
                        <Routes>
                            {/* Rutas para Banco */}
                            <Route element={<ProtectedRoute allowedRoles={['banco']} />}>
                                <Route path="/banco" element={<Dashboard />} />
                                <Route path="/banco/donaciones" element={<Donaciones />} />
                                <Route path="/banco/inventario" element={<Inventario />} />
                                <Route path="/banco/despachos" element={<Despachos />} />
                                <Route path="/banco/donantes" element={<Donantes />} />
                                <Route path="/banco/reportes" element={<Reportes />} />
                                <Route path="/banco/sql" element={<ConsolaSQL />} />
                            </Route>

                            {/* Rutas para Cliente */}
                            <Route element={<ProtectedRoute allowedRoles={['cliente']} />}>
                                <Route path="/cliente" element={<ClienteDashboard />} />
                                <Route path="/cliente/mis-donaciones" element={<MisDonaciones />} />
                                <Route path="/cliente/beneficios" element={<Beneficios />} />
                                <Route path="/cliente/inventario" element={<InventarioEmpresa />} />
                            </Route>

                            {/* Redirect en base al rol si estamos en la raíz */}
                            <Route path="/" element={<RootRedirect />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </AnimatedPage>
                </div>
            </main>
            <Chatbot />
        </div>
    );
}

function RootRedirect() {
    const { user } = useAuth();
    if (user?.rol === 'banco') return <Navigate to="/banco" replace />;
    if (user?.rol === 'cliente') return <Navigate to="/cliente" replace />;
    return <Navigate to="/login" replace />;
}

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/*" element={<Layout />} />
        </Routes>
    );
}

