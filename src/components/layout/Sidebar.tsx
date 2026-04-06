import { useLocation, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    HandHeart,
    Package,
    Truck,
    Users,
    BarChart3,
    Leaf,
    Database,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAppContext } from '@/contexts/AppContext';
import { getLotesProximosVencer } from '@/data/mockData';
import { cn } from '@/lib/utils';

const navItems = [
    { path: '/', label: 'Panel de Control', icon: LayoutDashboard },
    { path: '/donaciones', label: 'Donaciones', icon: HandHeart },
    { path: '/inventario', label: 'Inventario', icon: Package, showBadge: true },
    { path: '/despachos', label: 'Despachos', icon: Truck },
    { path: '/donantes', label: 'Donantes', icon: Users },
    { path: '/reportes', label: 'Reportes', icon: BarChart3 },
    { path: '/sql', label: 'Consola SQL', icon: Database },
];

export default function Sidebar() {
    const location = useLocation();
    const { lotes } = useAppContext();
    const alertCount = getLotesProximosVencer(lotes, 3).length;

    return (
        <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-white border-r border-border fixed left-0 top-0 z-30">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-6 py-5">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-600 text-white">
                    <Leaf className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-foreground tracking-tight">NutriRed</h1>
                    <p className="text-[10px] text-muted-foreground leading-none">Banco de alimentos</p>
                </div>
            </div>

            <Separator />

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path ||
                        (item.path !== '/' && location.pathname.startsWith(item.path));
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                                isActive
                                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                        >
                            <Icon className={cn('w-5 h-5', isActive ? 'text-primary-600' : '')} />
                            <span className="flex-1">{item.label}</span>
                            {item.showBadge && alertCount > 0 && (
                                <Badge variant="destructive" className="text-[10px] px-1.5 py-0 min-w-[20px] text-center">
                                    {alertCount}
                                </Badge>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <Separator />

            {/* Footer */}
            <div className="px-6 py-4">
                <p className="text-[11px] text-muted-foreground">v1.0.0 · Datos simulados</p>
            </div>
        </aside>
    );
}
