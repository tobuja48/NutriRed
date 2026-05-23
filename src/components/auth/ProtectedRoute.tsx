import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, Role } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
    allowedRoles?: Role[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirigir a login si no está autenticado
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.rol)) {
        // Si tiene sesión pero no tiene permiso para la ruta
        // Lo mandamos a su panel de control por defecto
        return <Navigate to="/" replace />;
    }

    // Si todo está bien, renderizamos las sub-rutas (Outlet)
    return <Outlet />;
}
