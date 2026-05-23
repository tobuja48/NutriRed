import { Landmark, TrendingUp, ShieldCheck, FileText, ArrowRight, Leaf, Recycle, Users, Building, HeartHandshake, Award, Package, Truck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Beneficios() {
    const handleDownload = () => {
        toast.promise(
            new Promise((resolve) => {
                setTimeout(() => {
                    const element = document.createElement("a");
                    element.href = "/Beneficios_Rentabilidad_Donacion_Alimentos.pdf";
                    element.download = "Beneficios_Tributarios_NutriRed.pdf";
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                    resolve(true);
                }, 800);
            }),
            {
                loading: 'Preparando el portafolio corporativo...',
                success: '¡Portafolio descargado exitosamente!',
                error: 'Error al descargar'
            }
        );
    };

    return (
        <div className="space-y-12 animate-fade-in pb-12">
            {/* Header Area */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 sm:p-12 text-white shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-transparent"></div>
                <div className="absolute -right-20 -top-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl"></div>
                <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-emerald-300 text-sm font-medium">
                        <TrendingUp className="w-4 h-4" />
                        Solidaridad Rentable
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                        Más que donar: Una estrategia corporativa inteligente
                    </h1>
                    <p className="text-lg text-slate-300 leading-relaxed">
                        Transformar tus excedentes y productos de baja rotación en donaciones no solo impacta miles de vidas, sino que optimiza tus finanzas, fortalece tu marca y promueve la sostenibilidad.
                    </p>
                </div>
            </div>

            {/* Beneficios Tributarios - Highlight */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                        <Landmark className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Beneficios Financieros y Tributarios</h2>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-6">
                    <Card className="border-emerald-200 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-emerald-50/30">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2 text-slate-900">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white text-sm font-bold">1</span>
                                Descuento en Renta (25%)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-600 space-y-3">
                            <p>Según los artículos 257 y 125 del Estatuto Tributario, tu empresa tiene derecho a descontar directamente del impuesto de renta el <strong>25% del valor de la donación</strong>.</p>
                            <p className="text-sm bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">
                                💡 <em>Nota:</em> Este es un descuento directo sobre el impuesto a pagar, lo que genera un retorno financiero inmediato mayor que una simple deducción de la base gravable.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-emerald-200 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-emerald-50/30">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2 text-slate-900">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white text-sm font-bold">2</span>
                                Exención del IVA
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-600 space-y-3">
                            <p>Los alimentos donados a través de bancos de alimentos autorizados que se destinen a consumo humano <strong>no causan Impuesto sobre las Ventas (IVA)</strong>.</p>
                            <p className="text-sm bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">
                                💡 <em>Nota:</em> Te evitas el pago de impuestos adicionales sobre productos que ya no podrás comercializar, aliviando la carga fiscal de tu inventario obsoleto.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Reducción de Costos y Eficiencia */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                        <Building className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Optimización de Costos Logísticos</h2>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all group">
                        <CardHeader className="pb-3">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <FileText className="w-6 h-6" />
                            </div>
                            <CardTitle className="text-lg">Ahorro en Destrucción</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600 text-sm">Elimina los altos costos asociados a la contratación de empresas para la destrucción certificada y disposición final de excedentes.</p>
                        </CardContent>
                    </Card>
                    <Card className="border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all group">
                        <CardHeader className="pb-3">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <Package className="w-6 h-6" />
                            </div>
                            <CardTitle className="text-lg">Liberación de Almacén</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600 text-sm">Libera espacio valioso en tus bodegas o centros de distribución rápidamente, reduciendo los costos de almacenamiento por m².</p>
                        </CardContent>
                    </Card>
                    <Card className="border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all group">
                        <CardHeader className="pb-3">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <Truck className="w-6 h-6" />
                            </div>
                            <CardTitle className="text-lg">Logística Inversa</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600 text-sm">Disminuye los costos y la complejidad de retornar productos desde el punto de venta a tus bodegas principales.</p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Sostenibilidad y RSC */}
            <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-white to-orange-50/50">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
                                <HeartHandshake className="w-5 h-5" />
                            </div>
                            <CardTitle className="text-xl text-slate-900">Impacto Corporativo (RSC)</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4">
                            <div className="shrink-0 mt-1"><Award className="w-5 h-5 text-orange-400" /></div>
                            <div>
                                <h4 className="font-semibold text-slate-900">Reputación y Valor de Marca</h4>
                                <p className="text-sm text-slate-600 mt-1">Los consumidores prefieren marcas comprometidas. Refuerza tu imagen pública como una empresa solidaria y ética.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="shrink-0 mt-1"><Users className="w-5 h-5 text-orange-400" /></div>
                            <div>
                                <h4 className="font-semibold text-slate-900">Clima y Orgullo Laboral</h4>
                                <p className="text-sm text-slate-600 mt-1">Los colaboradores se sienten más motivados y comprometidos al trabajar para una empresa que contribuye activamente a la sociedad y lucha contra el hambre.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-white to-green-50/50">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 bg-green-100 text-green-600 rounded-xl">
                                <Leaf className="w-5 h-5" />
                            </div>
                            <CardTitle className="text-xl text-slate-900">Economía Circular y Ambiental</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4">
                            <div className="shrink-0 mt-1"><Recycle className="w-5 h-5 text-green-500" /></div>
                            <div>
                                <h4 className="font-semibold text-slate-900">Reducción de Huella de Carbono</h4>
                                <p className="text-sm text-slate-600 mt-1">Evitas las emisiones de gases de efecto invernadero asociadas a la descomposición de alimentos en vertederos o su incineración.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="shrink-0 mt-1"><ShieldCheck className="w-5 h-5 text-green-500" /></div>
                            <div>
                                <h4 className="font-semibold text-slate-900">Cumplimiento ODS</h4>
                                <p className="text-sm text-slate-600 mt-1">Alineas directamente la operación de tu empresa con los Objetivos de Desarrollo Sostenible (ODS 2: Hambre Cero, ODS 12: Producción y Consumo Responsables).</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Certificación Section */}
            <Card className="bg-slate-50 border-dashed border-2 border-slate-300">
                <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-slate-200">
                        <ShieldCheck className="w-8 h-8 text-slate-700" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-xl font-bold text-slate-900">Certificación Oficial Garantizada</h3>
                        <p className="text-slate-600 mt-2">
                            NutriRed, en alianza con bancos de alimentos autorizados (ABACO), emite el <strong>Certificado de Donación</strong> formal que tu departamento contable necesita para aplicar los beneficios tributarios ante la DIAN con total seguridad jurídica y trazabilidad.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* CTA */}
            <div className="flex flex-col items-center justify-center pt-8">
                <Button 
                    onClick={handleDownload}
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 py-6 h-auto text-lg font-semibold shadow-xl shadow-emerald-600/20 group"
                >
                    Descargar Portafolio de Beneficios Corporativos
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <p className="text-sm text-slate-500 mt-4">
                    Documento PDF (2.4 MB) • Incluye simulador tributario detallado
                </p>
            </div>
        </div>
    );
}
