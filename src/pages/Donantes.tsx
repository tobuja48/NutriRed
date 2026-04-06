import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import DonorGrid from '@/components/donantes/DonorGrid';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '@/contexts/AppContext';

export default function Donantes() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { allDonantes, addDonante } = useAppContext();
    const [nombre, setNombre] = useState('');
    const [tipo, setTipo] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [contacto, setContacto] = useState('');
    const [telefono, setTelefono] = useState('');

    const handleSubmit = () => {
        if (!nombre || !tipo || !ciudad || !contacto || !telefono) {
            toast.error('Todos los campos son obligatorios');
            return;
        }
        const newDonante = {
            id: Math.max(0, ...allDonantes.map(d => d.id)) + 1,
            nombre,
            tipo: tipo as any,
            ciudad,
            contacto,
            telefono,
            totalDonacionesKg: 0,
            donacionesCount: 0,
        };
        addDonante(newDonante);
        toast.success(`Donante "${nombre}" registrado exitosamente`);
        setDialogOpen(false);
        setNombre(''); setTipo(''); setCiudad(''); setContacto(''); setTelefono('');
    };

    return (
        <div>
            <PageHeader
                title="Donantes"
                subtitle="Gestión del perfil de donantes registrados"
                action={
                    <Button onClick={() => setDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar donante
                    </Button>
                }
            />

            <DonorGrid />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Registrar nuevo donante</DialogTitle>
                        <DialogDescription>Complete la información del donante</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Nombre *</Label>
                            <Input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre completo o razón social" />
                        </div>
                        <div className="space-y-2">
                            <Label>Tipo *</Label>
                            <Select value={tipo} onValueChange={setTipo}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar tipo..." /></SelectTrigger>
                                <SelectContent>
                                    {['Supermercado', 'Productor', 'Restaurante', 'Industria', 'ONG', 'Persona natural'].map(t => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Ciudad *</Label>
                            <Input value={ciudad} onChange={e => setCiudad(e.target.value)} placeholder="Ciudad" />
                        </div>
                        <div className="space-y-2">
                            <Label>Persona de contacto *</Label>
                            <Input value={contacto} onChange={e => setContacto(e.target.value)} placeholder="Nombre del contacto" />
                        </div>
                        <div className="space-y-2">
                            <Label>Teléfono *</Label>
                            <Input value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="+57 3XX XXX XXXX" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSubmit}>Registrar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
