import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Menu, Leaf, LayoutDashboard, HandHeart, Package, Truck, Users, BarChart3, Database, LogOut, Landmark } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAppContext } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { getLotesProximosVencer } from '@/data/mockData';
import { cn } from '@/lib/utils';

const bancoNavItems = [
    { path: '/banco', label: 'Panel de Control', icon: LayoutDashboard },
    { path: '/banco/donaciones', label: 'Donaciones', icon: HandHeart },
    { path: '/banco/inventario', label: 'Inventario', icon: Package, showBadge: true },
    { path: '/banco/despachos', label: 'Despachos', icon: Truck },
    { path: '/banco/donantes', label: 'Donantes', icon: Users },
    { path: '/banco/reportes', label: 'Reportes', icon: BarChart3 },
    { path: '/banco/sql', label: 'Consola SQL', icon: Database },
];

const clienteNavItems = [
    { path: '/cliente', label: 'Panel de Control', icon: LayoutDashboard },
    { path: '/cliente/mis-donaciones', label: 'Mis Donaciones', icon: HandHeart },
    { path: '/cliente/beneficios', label: 'Beneficios', icon: Landmark },
];

export default function MobileNav() {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { lotes } = useAppContext();
    const { user, logout } = useAuth();
    
    const alertCount = getLotesProximosVencer(lotes, 3).length;
    const navItems = user?.rol === 'banco' ? bancoNavItems : clienteNavItems;

    const handleLogout = () => {
        logout();
        setOpen(false);
        navigate('/login');
    };

    return (
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-border">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600 text-white">
                        <Leaf className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-foreground">NutriRed</span>
                </div>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-72 p-0 flex flex-col h-full">
                        <SheetHeader className="px-6 py-5">
                            <SheetTitle className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600 text-white">
                                    <Leaf className="w-4 h-4" />
                                </div>
                                <div className="text-left">
                                    <div>NutriRed</div>
                                    <div className="text-xs text-muted-foreground font-normal">
                                        {user?.rol === 'banco' ? 'Banco de alimentos' : 'Portal de Cliente'}
                                    </div>
                                </div>
                            </SheetTitle>
                        </SheetHeader>
                        <Separator />
                        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path ||
                                    (item.path !== '/banco' && item.path !== '/cliente' && location.pathname.startsWith(item.path));
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setOpen(false)}
                                        className={cn(
                                            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                                            isActive
                                                ? 'bg-primary-50 text-primary-700'
                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        )}
                                    >
                                        <Icon className={cn('w-5 h-5', isActive ? 'text-primary-600' : '')} />
                                        <span className="flex-1">{item.label}</span>
                                        {item.showBadge && alertCount > 0 && user?.rol === 'banco' && (
                                            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                                                {alertCount}
                                            </Badge>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                        <Separator />
                        <div className="p-4 space-y-3">
                            <div className="flex items-center gap-3 px-2">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
                                    {user?.nombre?.substring(0, 2) || 'US'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate">{user?.nombre}</p>
                                    <p className="text-[10px] text-slate-500 capitalize">{user?.rol}</p>
                                </div>
                            </div>
                            <Button 
                                variant="ghost" 
                                className="w-full justify-start text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Cerrar sesión
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
