import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Leaf, LayoutDashboard, HandHeart, Package, Truck, Users, BarChart3, Database } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
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

export default function MobileNav() {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const { lotes } = useAppContext();
    const alertCount = getLotesProximosVencer(lotes, 3).length;

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
                    <SheetContent side="left" className="w-72 p-0">
                        <SheetHeader className="px-6 py-5">
                            <SheetTitle className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600 text-white">
                                    <Leaf className="w-4 h-4" />
                                </div>
                                NutriRed
                            </SheetTitle>
                        </SheetHeader>
                        <Separator />
                        <nav className="px-3 py-4 space-y-1">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path ||
                                    (item.path !== '/' && location.pathname.startsWith(item.path));
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
                                        {item.showBadge && alertCount > 0 && (
                                            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                                                {alertCount}
                                            </Badge>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
