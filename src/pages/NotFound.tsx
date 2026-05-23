import { Link } from 'react-router-dom';
import { Leaf, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
            <div className="animate-scale-in">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 mx-auto mb-6">
                    <Leaf className="w-8 h-8" />
                </div>

                <h1 className="text-7xl font-extrabold text-slate-900 mb-2">404</h1>
                <h2 className="text-xl font-semibold text-slate-700 mb-2">Página no encontrada</h2>
                <p className="text-slate-500 max-w-md mx-auto mb-8">
                    Lo sentimos, la página que buscas no existe o ha sido movida. 
                    Verifica la URL o regresa al inicio.
                </p>

                <div className="flex gap-3 justify-center">
                    <Link to="/">
                        <Button className="bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-600/20">
                            <Home className="w-4 h-4 mr-2" />
                            Ir al inicio
                        </Button>
                    </Link>
                    <Button variant="outline" className="rounded-xl" onClick={() => window.history.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver atrás
                    </Button>
                </div>
            </div>
        </div>
    );
}
