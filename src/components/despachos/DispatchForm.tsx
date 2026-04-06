import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Truck } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '@/contexts/AppContext';
import { municipios, getProducto } from '@/data/mockData';

const schema = z.object({
    loteId: z.string().min(1, 'Selecciona un lote'),
    municipioId: z.string().min(1, 'Selecciona un municipio'),
    fechaDespacho: z.string().min(1, 'Fecha requerida'),
    transportador: z.string().min(1, 'Transportador requerido'),
    raciones: z.coerce.number().min(1, 'Mínimo 1 ración'),
    notas: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
    preselectedLoteId?: number;
    preselectedMunicipioId?: number;
}

export default function DispatchForm({ preselectedLoteId, preselectedMunicipioId }: Props) {
    const { lotes, despachos, addDespacho, updateLote } = useAppContext();
    const disponibles = lotes.filter(l => l.estado === 'Disponible');
    const municipiosSorted = [...municipios].sort((a, b) => b.ipm - a.ipm);

    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            loteId: preselectedLoteId ? String(preselectedLoteId) : '',
            municipioId: preselectedMunicipioId ? String(preselectedMunicipioId) : '',
            fechaDespacho: new Date().toISOString().split('T')[0],
            transportador: '',
            raciones: 0,
            notas: '',
        },
    });

    const selectedLoteId = watch('loteId');

    useEffect(() => {
        if (selectedLoteId) {
            const lote = lotes.find(l => l.id === Number(selectedLoteId));
            if (lote) {
                setValue('raciones', Math.round(lote.cantidadKg / 0.5));
            }
        }
    }, [selectedLoteId, lotes, setValue]);

    useEffect(() => {
        if (preselectedLoteId) {
            setValue('loteId', String(preselectedLoteId));
        }
        if (preselectedMunicipioId) {
            setValue('municipioId', String(preselectedMunicipioId));
        }
    }, [preselectedLoteId, preselectedMunicipioId, setValue]);

    const onSubmit = (data: FormValues) => {
        const newDespacho = {
            id: Math.max(0, ...despachos.map(d => d.id)) + 1,
            loteId: Number(data.loteId),
            municipioId: Number(data.municipioId),
            fechaDespacho: data.fechaDespacho,
            transportador: data.transportador,
            racionesEntregadas: data.raciones,
            estado: 'Programado' as const,
        };
        addDespacho(newDespacho);
        updateLote(Number(data.loteId), { estado: 'Reservado', municipioDestinoId: Number(data.municipioId) });
        toast.success('Despacho registrado exitosamente', {
            description: `${data.raciones} raciones programadas para envío`,
        });
        reset();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary-600" />
                    Registrar despacho
                </CardTitle>
                <CardDescription>Programa el envío de un lote a un municipio</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Lote */}
                    <div className="space-y-2">
                        <Label>Lote *</Label>
                        <Controller
                            name="loteId"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar lote..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {disponibles.map(l => {
                                            const prod = getProducto(l.productoId);
                                            return (
                                                <SelectItem key={l.id} value={String(l.id)}>
                                                    {l.codigo} — {prod?.nombre} ({l.cantidadKg} kg)
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.loteId && <p className="text-xs text-red-500">{errors.loteId.message}</p>}
                    </div>

                    {/* Municipio */}
                    <div className="space-y-2">
                        <Label>Municipio destino *</Label>
                        <Controller
                            name="municipioId"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar municipio..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {municipiosSorted.map(m => (
                                            <SelectItem key={m.id} value={String(m.id)}>
                                                {m.nombre} — IPM {m.ipm} ({m.departamento})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.municipioId && <p className="text-xs text-red-500">{errors.municipioId.message}</p>}
                    </div>

                    {/* Fecha */}
                    <div className="space-y-2">
                        <Label>Fecha de despacho *</Label>
                        <Input type="date" {...register('fechaDespacho')} />
                        {errors.fechaDespacho && <p className="text-xs text-red-500">{errors.fechaDespacho.message}</p>}
                    </div>

                    {/* Transportador */}
                    <div className="space-y-2">
                        <Label>Transportador *</Label>
                        <Input placeholder="Nombre del transportador" {...register('transportador')} />
                        {errors.transportador && <p className="text-xs text-red-500">{errors.transportador.message}</p>}
                    </div>

                    {/* Raciones */}
                    <div className="space-y-2">
                        <Label>Raciones estimadas</Label>
                        <Input type="number" {...register('raciones')} />
                        <p className="text-xs text-muted-foreground">Calculado: kg / 0.5 (editable)</p>
                        {errors.raciones && <p className="text-xs text-red-500">{errors.raciones.message}</p>}
                    </div>

                    {/* Notas */}
                    <div className="space-y-2">
                        <Label>Notas</Label>
                        <Textarea placeholder="Observaciones..." {...register('notas')} />
                    </div>

                    {/* Submit */}
                    <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => reset()}>Cancelar</Button>
                        <Button type="submit">
                            <Truck className="w-4 h-4 mr-2" />
                            Programar despacho
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
