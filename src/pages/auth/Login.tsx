import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Leaf, LogIn, ArrowRight, Heart, Users, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            toast.success('Inicio de sesión exitoso');
            navigate('/');
        } else {
            toast.error(result.message || 'Error al iniciar sesión');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Hero */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-emerald-500">
                {/* Decorative circles */}
                <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/10 animate-float"></div>
                <div className="absolute bottom-20 -right-10 w-56 h-56 rounded-full bg-white/10 animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-white/5 animate-float" style={{ animationDelay: '1s' }}></div>

                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
                    <div className="flex items-center gap-3 mb-8 animate-fade-in">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
                            <Leaf className="w-7 h-7" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">NutriRed</span>
                    </div>

                    <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight mb-6 animate-fade-in-up">
                        Transformando<br/>
                        donaciones en<br/>
                        <span className="text-emerald-200">esperanza</span>
                    </h1>

                    <p className="text-lg text-white/80 mb-10 max-w-md animate-fade-in-up stagger-2">
                        Plataforma inteligente de gestión para bancos de alimentos. 
                        Conectamos donantes con comunidades vulnerables en toda Colombia.
                    </p>

                    <div className="space-y-4">
                        {[
                            { icon: Heart, text: '+27,000 kg de alimentos rescatados', delay: 'stagger-3' },
                            { icon: Users, text: '15 municipios beneficiados', delay: 'stagger-4' },
                            { icon: Truck, text: 'Logística inteligente en tiempo real', delay: 'stagger-5' },
                        ].map((item, i) => (
                            <div key={i} className={`flex items-center gap-3 text-white/90 animate-fade-in ${item.delay}`}>
                                <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                                    <item.icon className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 flex items-center justify-center bg-slate-50 p-6 sm:p-10">
                <div className="w-full max-w-md animate-scale-in">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2.5 mb-8">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-600 text-white">
                            <Leaf className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold text-slate-900">NutriRed</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">Bienvenido de vuelta</h2>
                        <p className="text-slate-500 text-sm mt-1">
                            Ingresa tus credenciales para acceder a la plataforma
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700" htmlFor="login-email">
                                Correo electrónico
                            </label>
                            <input
                                id="login-email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700" htmlFor="login-password">
                                Contraseña
                            </label>
                            <input
                                id="login-password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                                placeholder="••••••••"
                            />
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full h-11 text-sm font-semibold bg-primary-600 hover:bg-primary-700 rounded-xl transition-all duration-200 shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Verificando...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <LogIn className="w-4 h-4" />
                                    Iniciar sesión
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-500">
                            ¿No tienes una cuenta?{' '}
                            <Link to="/registro" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                                Regístrate aquí <ArrowRight className="w-3.5 h-3.5 inline" />
                            </Link>
                        </p>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <div className="bg-slate-100/80 p-4 rounded-xl text-xs text-slate-600 space-y-1.5 mb-4">
                            <p className="font-semibold text-slate-700">Credenciales de prueba:</p>
                            <p><span className="inline-block w-16 font-medium text-primary-700">Banco:</span> admin@nutrired.com / 123</p>
                            <p><span className="inline-block w-16 font-medium text-primary-700">Cliente:</span> cliente@nutrired.com / 123</p>
                        </div>
                        <Button 
                            type="button"
                            variant="outline"
                            className="w-full text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                            onClick={() => {
                                localStorage.clear();
                                window.location.reload();
                            }}
                        >
                            Restaurar base de datos de fábrica
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
