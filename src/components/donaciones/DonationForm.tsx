import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { useAppContext } from '@/contexts/AppContext';
import { categorias, productos, generarCodigoLote } from '@/data/mockData';
import { PackagePlus } from 'lucide-react';
import { useState } from 'react';

const schema = z.object({
    donanteId: z.string().min(1, 'Selecciona un donante'),
    fechaIngreso: z.string().min(1, 'Fecha de ingreso requerida'),
    categoriaId: z.string().min(1, 'Selecciona una categoría'),
    productoId: z.string().min(1, 'Selecciona un producto'),
    cantidadKg: z.coerce.number().min(1, 'Mínimo 1 kg').max(10000, 'Máximo 10,000 kg'),
    fechaVencimiento: z.string().min(1, 'Fecha de vencimiento requerida'),
    calidad: z.enum(['Óptima', 'Buena', 'Regular'], { required_error: 'Selecciona la calidad' }),
    observaciones: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function DonationForm() {
    const { lotes, allDonantes, addLote } = useAppContext();
    const [selectedCategoria, setSelectedCategoria] = useState<string>('');

    const filteredProductos = selectedCategoria
        ? productos.filter(p => p.categoriaId === Number(selectedCategoria))
        : [];

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            fechaIngreso: new Date().toISOString().split('T')[0],
            calidad: 'Buena',
            observaciones: '',
        },
    });

    const onSubmit = (data: FormValues) => {
        const codigo = generarCodigoLote(lotes);
        const newLote = {
            id: Math.max(0, ...lotes.map(l => l.id)) + 1,
            codigo,
            productoId: Number(data.productoId),
            donanteId: Number(data.donanteId),
            cantidadKg: data.cantidadKg,
            fechaIngreso: data.fechaIngreso,
            fechaVencimiento: data.fechaVencimiento,
            estado: 'Disponible' as const,
            calidad: data.calidad as 'Óptima' | 'Buena' | 'Regular',
        };
        addLote(newLote);
        toast.success(`Lote ${codigo} registrado exitosamente`, {
            description: `${data.cantidadKg} kg añadidos al inventario`,
        });
        reset();
        setSelectedCategoria('');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <PackagePlus className="w-5 h-5 text-primary-600" />
                    Registrar nueva donación
                </CardTitle>
                <CardDescription>Complete los datos del lote recibido</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Donante */}
                    <div className="space-y-2">
                        <Label>Donante *</Label>
                        <Controller
                            name="donanteId"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar donante..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {allDonantes.map(d => (
                                            <SelectItem key={d.id} value={String(d.id)}>
                                                {d.nombre} — {d.tipo} ({d.ciudad})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.donanteId && <p className="text-xs text-red-500">{errors.donanteId.message}</p>}
                    </div>

                    {/* Fecha ingreso */}
                    <div className="space-y-2">
                        <Label>Fecha de ingreso *</Label>
                        <Input type="date" {...register('fechaIngreso')} />
                        {errors.fechaIngreso && <p className="text-xs text-red-500">{errors.fechaIngreso.message}</p>}
                    </div>

                    {/* Categoría */}
                    <div className="space-y-2">
                        <Label>Categoría *</Label>
                        <Controller
                            name="categoriaId"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    onValueChange={(val) => {
                                        field.onChange(val);
                                        setSelectedCategoria(val);
                                        setValue('productoId', '');
                                    }}
                                    value={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar categoría..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categorias.map(c => (
                                            <SelectItem key={c.id} value={String(c.id)}>
                                                {c.icono} {c.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.categoriaId && <p className="text-xs text-red-500">{errors.categoriaId.message}</p>}
                    </div>

                    {/* Producto */}
                    <div className="space-y-2">
                        <Label>Producto *</Label>
                        <Controller
                            name="productoId"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCategoria}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={selectedCategoria ? 'Seleccionar producto...' : 'Primero selecciona categoría'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredProductos.map(p => (
                                            <SelectItem key={p.id} value={String(p.id)}>
                                                {p.nombre} ({p.unidadMedida})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.productoId && <p className="text-xs text-red-500">{errors.productoId.message}</p>}
                    </div>

                    {/* Cantidad */}
                    <div className="space-y-2">
                        <Label>Cantidad (kg) *</Label>
                        <Input type="number" step="0.1" min="1" max="10000" placeholder="0" {...register('cantidadKg')} />
                        {errors.cantidadKg && <p className="text-xs text-red-500">{errors.cantidadKg.message}</p>}
                    </div>

                    {/* Fecha vencimiento */}
                    <div className="space-y-2">
                        <Label>Fecha de vencimiento *</Label>
                        <Input type="date" {...register('fechaVencimiento')} />
                        {errors.fechaVencimiento && <p className="text-xs text-red-500">{errors.fechaVencimiento.message}</p>}
                    </div>

                    {/* Calidad */}
                    <div className="space-y-2 md:col-span-2">
                        <Label>Calidad *</Label>
                        <Controller
                            name="calidad"
                            control={control}
                            render={({ field }) => (
                                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-6">
                                    {[
                                        { value: 'Óptima', desc: 'Estado perfecto, sin daño' },
                                        { value: 'Buena', desc: 'Menor daño cosmético' },
                                        { value: 'Regular', desc: 'Apto para consumo pronto' },
                                    ].map(opt => (
                                        <label key={opt.value} className="flex items-start gap-2 cursor-pointer">
                                            <RadioGroupItem value={opt.value} className="mt-0.5" />
                                            <div>
                                                <span className="text-sm font-medium">{opt.value}</span>
                                                <p className="text-xs text-muted-foreground">{opt.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </RadioGroup>
                            )}
                        />
                        {errors.calidad && <p className="text-xs text-red-500">{errors.calidad.message}</p>}
                    </div>

                    {/* Observaciones */}
                    <div className="space-y-2 md:col-span-2">
                        <Label>Observaciones</Label>
                        <Textarea placeholder="Notas adicionales sobre el lote..." {...register('observaciones')} />
                    </div>

                    {/* Submit */}
                    <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => { reset(); setSelectedCategoria(''); }}>
                            Limpiar
                        </Button>
                        <Button type="submit">
                            <PackagePlus className="w-4 h-4 mr-2" />
                            Registrar lote
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
