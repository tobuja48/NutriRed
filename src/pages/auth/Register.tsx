import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '@/lib/db';
import { Leaf, UserPlus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAppContext } from '@/contexts/AppContext';

export default function Register() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [rol, setRol] = useState<'banco' | 'cliente'>('cliente');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const { addDonante, allDonantes } = useAppContext();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 3) {
            toast.error('La contraseña debe tener al menos 3 caracteres');
            return;
        }

        setLoading(true);

        // Simular un pequeño delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const result = registerUser(nombre, email, password, rol);

        if (result.success) {
            if (rol === 'cliente') {
                const newDonanteId = allDonantes.length > 0 ? Math.max(...allDonantes.map(d => d.id)) + 1 : 1;
                addDonante({
                    id: newDonanteId,
                    nombre: nombre,
                    tipo: 'Persona natural',
                    ciudad: 'No especificada',
                    contacto: nombre,
                    telefono: 'No registrado',
                    totalDonacionesKg: 0,
                    donacionesCount: 0
                });
            }
            toast.success('¡Cuenta creada exitosamente! Ya puedes iniciar sesión.');
            navigate('/login');
        } else {
            toast.error(result.message || 'Error al registrar');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Hero */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-emerald-600 via-primary-600 to-teal-500">
                {/* Decorative circles */}
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 animate-float"></div>
                <div className="absolute bottom-32 -left-10 w-48 h-48 rounded-full bg-white/10 animate-float" style={{ animationDelay: '1.5s' }}></div>

                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
                    <div className="flex items-center gap-3 mb-8 animate-fade-in">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
                            <Leaf className="w-7 h-7" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">NutriRed</span>
                    </div>

                    <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight mb-6 animate-fade-in-up">
                        Únete a la<br/>
                        red que<br/>
                        <span className="text-emerald-200">salva alimentos</span>
                    </h1>

                    <p className="text-lg text-white/80 max-w-md animate-fade-in-up stagger-2">
                        Crea tu cuenta y comienza a hacer la diferencia. 
                        Cada donación cuenta para combatir el hambre en Colombia.
                    </p>
                </div>
            </div>

            {/* Right Panel - Register Form */}
            <div className="flex-1 flex items-center justify-center bg-slate-50 p-6 sm:p-10">
                <div className="w-full max-w-md animate-scale-in">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2.5 mb-6">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-600 text-white">
                            <Leaf className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold text-slate-900">NutriRed</span>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Crear una cuenta</h2>
                        <p className="text-slate-500 text-sm mt-1">
                            Completa el formulario para registrarte en NutriRed
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700" htmlFor="reg-nombre">
                                Nombre completo
                            </label>
                            <input
                                id="reg-nombre"
                                type="text"
                                required
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                                placeholder="Juan Pérez"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700" htmlFor="reg-email">
                                Correo electrónico
                            </label>
                            <input
                                id="reg-email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700" htmlFor="reg-password">
                                    Contraseña
                                </label>
                                <input
                                    id="reg-password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                                    placeholder="••••••"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700" htmlFor="reg-confirm">
                                    Confirmar
                                </label>
                                <input
                                    id="reg-confirm"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                                    placeholder="••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">
                                Tipo de cuenta
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRol('cliente')}
                                    className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                                        rol === 'cliente' 
                                            ? 'border-primary-500 bg-primary-50 shadow-sm' 
                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                    }`}
                                >
                                    <p className="text-sm font-semibold text-slate-900">Donante</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Quiero donar alimentos</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRol('banco')}
                                    className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                                        rol === 'banco' 
                                            ? 'border-primary-500 bg-primary-50 shadow-sm' 
                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                    }`}
                                >
                                    <p className="text-sm font-semibold text-slate-900">Banco</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Gestionar donaciones</p>
                                </button>
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full h-11 text-sm font-semibold bg-primary-600 hover:bg-primary-700 rounded-xl transition-all duration-200 shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Creando cuenta...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <UserPlus className="w-4 h-4" />
                                    Crear cuenta
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-500">
                            ¿Ya tienes una cuenta?{' '}
                            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                                <ArrowLeft className="w-3.5 h-3.5 inline" /> Inicia sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
