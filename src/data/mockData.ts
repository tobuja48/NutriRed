import { differenceInDays, parseISO, format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';

// ============ INTERFACES ============

export interface Donante {
    id: number;
    nombre: string;
    tipo: "Supermercado" | "Productor" | "Restaurante" | "Industria" | "ONG" | "Persona natural";
    ciudad: string;
    contacto: string;
    telefono: string;
    totalDonacionesKg: number;
    donacionesCount: number;
}

export interface Categoria {
    id: number;
    nombre: "Frutas y verduras" | "Lácteos" | "Granos y legumbres" | "Proteínas" | "Panadería" | "Enlatados";
    icono: string;
    vidaUtilDias: number;
}

export interface Producto {
    id: number;
    categoriaId: number;
    nombre: string;
    unidadMedida: string;
}

export interface Municipio {
    id: number;
    nombre: string;
    departamento: string;
    ipm: number;
    poblacion: number;
    distanciaKm: number;
}

export interface Lote {
    id: number;
    codigo: string;
    productoId: number;
    donanteId: number;
    cantidadKg: number;
    fechaIngreso: string;
    fechaVencimiento: string;
    estado: "Disponible" | "Reservado" | "Despachado" | "Vencido";
    calidad: "Óptima" | "Buena" | "Regular";
    municipioDestinoId?: number;
}

export interface Despacho {
    id: number;
    loteId: number;
    municipioId: number;
    fechaDespacho: string;
    transportador: string;
    racionesEntregadas: number;
    estado: "Programado" | "En tránsito" | "Entregado";
}

// ============ MOCK DATA ============

export const donantes: Donante[] = [
    { id: 1, nombre: "Éxito Centro", tipo: "Supermercado", ciudad: "Bogotá", contacto: "Carlos Méndez", telefono: "+57 310 234 5678", totalDonacionesKg: 4520, donacionesCount: 18 },
    { id: 2, nombre: "Finca Santa Rosa", tipo: "Productor", ciudad: "Villa de Leyva", contacto: "María Rodríguez", telefono: "+57 315 876 4321", totalDonacionesKg: 3200, donacionesCount: 12 },
    { id: 3, nombre: "Restaurante El Cielo", tipo: "Restaurante", ciudad: "Medellín", contacto: "Juan Pablo Gómez", telefono: "+57 300 112 3344", totalDonacionesKg: 890, donacionesCount: 24 },
    { id: 4, nombre: "Alpina S.A.", tipo: "Industria", ciudad: "Sopó", contacto: "Laura Martínez", telefono: "+57 321 998 7766", totalDonacionesKg: 6800, donacionesCount: 8 },
    { id: 5, nombre: "Fundación Minuto de Dios", tipo: "ONG", ciudad: "Bogotá", contacto: "Andrés Patiño", telefono: "+57 318 445 6677", totalDonacionesKg: 2100, donacionesCount: 15 },
    { id: 6, nombre: "Hacienda La Esperanza", tipo: "Productor", ciudad: "Tuluá", contacto: "Fernando Caicedo", telefono: "+57 312 667 8899", totalDonacionesKg: 5400, donacionesCount: 10 },
    { id: 7, nombre: "Carulla Fresh Market", tipo: "Supermercado", ciudad: "Cali", contacto: "Diana Restrepo", telefono: "+57 316 223 4455", totalDonacionesKg: 3750, donacionesCount: 20 },
    { id: 8, nombre: "Pedro Hernández", tipo: "Persona natural", ciudad: "Bucaramanga", contacto: "Pedro Hernández", telefono: "+57 305 334 5566", totalDonacionesKg: 420, donacionesCount: 5 },
];

export const categorias: Categoria[] = [
    { id: 1, nombre: "Frutas y verduras", icono: "🍎", vidaUtilDias: 7 },
    { id: 2, nombre: "Lácteos", icono: "🥛", vidaUtilDias: 14 },
    { id: 3, nombre: "Granos y legumbres", icono: "🌾", vidaUtilDias: 180 },
    { id: 4, nombre: "Proteínas", icono: "🥩", vidaUtilDias: 5 },
    { id: 5, nombre: "Panadería", icono: "🍞", vidaUtilDias: 4 },
    { id: 6, nombre: "Enlatados", icono: "🥫", vidaUtilDias: 365 },
];

export const productos: Producto[] = [
    { id: 1, categoriaId: 1, nombre: "Banano", unidadMedida: "kg" },
    { id: 2, categoriaId: 1, nombre: "Tomate", unidadMedida: "kg" },
    { id: 3, categoriaId: 1, nombre: "Papa criolla", unidadMedida: "kg" },
    { id: 4, categoriaId: 2, nombre: "Leche entera", unidadMedida: "litros" },
    { id: 5, categoriaId: 2, nombre: "Yogur natural", unidadMedida: "kg" },
    { id: 6, categoriaId: 3, nombre: "Arroz blanco", unidadMedida: "kg" },
    { id: 7, categoriaId: 3, nombre: "Lenteja", unidadMedida: "kg" },
    { id: 8, categoriaId: 3, nombre: "Frijol rojo", unidadMedida: "kg" },
    { id: 9, categoriaId: 4, nombre: "Pollo entero", unidadMedida: "kg" },
    { id: 10, categoriaId: 4, nombre: "Huevo AA", unidadMedida: "unidades" },
    { id: 11, categoriaId: 5, nombre: "Pan tajado", unidadMedida: "kg" },
    { id: 12, categoriaId: 5, nombre: "Mogolla integral", unidadMedida: "kg" },
    { id: 13, categoriaId: 6, nombre: "Atún en lata", unidadMedida: "kg" },
    { id: 14, categoriaId: 6, nombre: "Sardina enlatada", unidadMedida: "kg" },
    { id: 15, categoriaId: 1, nombre: "Cebolla cabezona", unidadMedida: "kg" },
];

export const municipios: Municipio[] = [
    { id: 1, nombre: "Uribia", departamento: "La Guajira", ipm: 92.2, poblacion: 182898, distanciaKm: 1120 },
    { id: 2, nombre: "Manaure", departamento: "La Guajira", ipm: 89.5, poblacion: 109464, distanciaKm: 1085 },
    { id: 3, nombre: "Alto Baudó", departamento: "Chocó", ipm: 88.1, poblacion: 35840, distanciaKm: 650 },
    { id: 4, nombre: "Guapi", departamento: "Cauca", ipm: 78.3, poblacion: 30825, distanciaKm: 580 },
    { id: 5, nombre: "Tierralta", departamento: "Córdoba", ipm: 72.9, poblacion: 102897, distanciaKm: 420 },
    { id: 6, nombre: "El Charco", departamento: "Nariño", ipm: 70.1, poblacion: 38456, distanciaKm: 710 },
    { id: 7, nombre: "López de Micay", departamento: "Cauca", ipm: 68.5, poblacion: 21764, distanciaKm: 630 },
    { id: 8, nombre: "Tumaco", departamento: "Nariño", ipm: 65.2, poblacion: 229752, distanciaKm: 750 },
    { id: 9, nombre: "Quibdó", departamento: "Chocó", ipm: 62.8, poblacion: 130715, distanciaKm: 580 },
    { id: 10, nombre: "Riosucio", departamento: "Chocó", ipm: 60.4, poblacion: 30694, distanciaKm: 540 },
    { id: 11, nombre: "Buenaventura", departamento: "Valle del Cauca", ipm: 55.7, poblacion: 423927, distanciaKm: 490 },
    { id: 12, nombre: "Apartadó", departamento: "Antioquia", ipm: 48.3, poblacion: 195853, distanciaKm: 340 },
    { id: 13, nombre: "Turbo", departamento: "Antioquia", ipm: 52.1, poblacion: 171834, distanciaKm: 380 },
    { id: 14, nombre: "Maicao", departamento: "La Guajira", ipm: 58.9, poblacion: 162025, distanciaKm: 1050 },
    { id: 15, nombre: "Soledad", departamento: "Atlántico", ipm: 38.6, poblacion: 685584, distanciaKm: 960 },
];

// Helper: today reference
const hoy = new Date();

function dateStr(daysOffset: number): string {
    const d = new Date(hoy);
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split('T')[0];
}

function pastDateStr(daysAgo: number): string {
    return dateStr(-daysAgo);
}

export const lotes: Lote[] = [
    { id: 1, codigo: "LOT-2026-0001", productoId: 1, donanteId: 1, cantidadKg: 320, fechaIngreso: pastDateStr(5), fechaVencimiento: dateStr(1), estado: "Disponible", calidad: "Buena" },
    { id: 2, codigo: "LOT-2026-0002", productoId: 2, donanteId: 2, cantidadKg: 150, fechaIngreso: pastDateStr(3), fechaVencimiento: dateStr(2), estado: "Disponible", calidad: "Óptima" },
    { id: 3, codigo: "LOT-2026-0003", productoId: 9, donanteId: 3, cantidadKg: 80, fechaIngreso: pastDateStr(2), fechaVencimiento: dateStr(1), estado: "Disponible", calidad: "Buena" },
    { id: 4, codigo: "LOT-2026-0004", productoId: 4, donanteId: 4, cantidadKg: 500, fechaIngreso: pastDateStr(4), fechaVencimiento: dateStr(5), estado: "Disponible", calidad: "Óptima" },
    { id: 5, codigo: "LOT-2026-0005", productoId: 11, donanteId: 1, cantidadKg: 60, fechaIngreso: pastDateStr(1), fechaVencimiento: dateStr(2), estado: "Disponible", calidad: "Buena" },
    { id: 6, codigo: "LOT-2026-0006", productoId: 6, donanteId: 6, cantidadKg: 1200, fechaIngreso: pastDateStr(10), fechaVencimiento: dateStr(120), estado: "Disponible", calidad: "Óptima" },
    { id: 7, codigo: "LOT-2026-0007", productoId: 7, donanteId: 5, cantidadKg: 400, fechaIngreso: pastDateStr(8), fechaVencimiento: dateStr(90), estado: "Disponible", calidad: "Óptima" },
    { id: 8, codigo: "LOT-2026-0008", productoId: 13, donanteId: 7, cantidadKg: 250, fechaIngreso: pastDateStr(15), fechaVencimiento: dateStr(200), estado: "Disponible", calidad: "Óptima" },
    { id: 9, codigo: "LOT-2026-0009", productoId: 5, donanteId: 4, cantidadKg: 180, fechaIngreso: pastDateStr(6), fechaVencimiento: dateStr(4), estado: "Disponible", calidad: "Buena" },
    { id: 10, codigo: "LOT-2026-0010", productoId: 3, donanteId: 2, cantidadKg: 270, fechaIngreso: pastDateStr(4), fechaVencimiento: dateStr(3), estado: "Disponible", calidad: "Regular" },
    { id: 11, codigo: "LOT-2026-0011", productoId: 10, donanteId: 8, cantidadKg: 45, fechaIngreso: pastDateStr(2), fechaVencimiento: dateStr(8), estado: "Disponible", calidad: "Óptima" },
    { id: 12, codigo: "LOT-2026-0012", productoId: 12, donanteId: 3, cantidadKg: 35, fechaIngreso: pastDateStr(1), fechaVencimiento: dateStr(3), estado: "Disponible", calidad: "Buena" },
    { id: 13, codigo: "LOT-2026-0013", productoId: 8, donanteId: 6, cantidadKg: 800, fechaIngreso: pastDateStr(12), fechaVencimiento: dateStr(150), estado: "Reservado", calidad: "Óptima", municipioDestinoId: 1 },
    { id: 14, codigo: "LOT-2026-0014", productoId: 14, donanteId: 7, cantidadKg: 300, fechaIngreso: pastDateStr(20), fechaVencimiento: dateStr(180), estado: "Reservado", calidad: "Óptima", municipioDestinoId: 3 },
    { id: 15, codigo: "LOT-2026-0015", productoId: 1, donanteId: 1, cantidadKg: 200, fechaIngreso: pastDateStr(8), fechaVencimiento: pastDateStr(1), estado: "Vencido", calidad: "Regular" },
    { id: 16, codigo: "LOT-2026-0016", productoId: 9, donanteId: 3, cantidadKg: 120, fechaIngreso: pastDateStr(12), fechaVencimiento: pastDateStr(5), estado: "Despachado", calidad: "Buena", municipioDestinoId: 2 },
    { id: 17, codigo: "LOT-2026-0017", productoId: 6, donanteId: 6, cantidadKg: 950, fechaIngreso: pastDateStr(25), fechaVencimiento: dateStr(60), estado: "Despachado", calidad: "Óptima", municipioDestinoId: 5 },
    { id: 18, codigo: "LOT-2026-0018", productoId: 4, donanteId: 4, cantidadKg: 350, fechaIngreso: pastDateStr(18), fechaVencimiento: pastDateStr(3), estado: "Despachado", calidad: "Buena", municipioDestinoId: 4 },
    { id: 19, codigo: "LOT-2026-0019", productoId: 15, donanteId: 2, cantidadKg: 180, fechaIngreso: pastDateStr(3), fechaVencimiento: dateStr(4), estado: "Disponible", calidad: "Buena" },
    { id: 20, codigo: "LOT-2026-0020", productoId: 2, donanteId: 7, cantidadKg: 95, fechaIngreso: pastDateStr(2), fechaVencimiento: dateStr(5), estado: "Disponible", calidad: "Regular" },
    { id: 21, codigo: "LOT-2026-0021", productoId: 13, donanteId: 5, cantidadKg: 400, fechaIngreso: pastDateStr(5), fechaVencimiento: dateStr(250), estado: "Disponible", calidad: "Óptima" },
    { id: 22, codigo: "LOT-2026-0022", productoId: 7, donanteId: 8, cantidadKg: 150, fechaIngreso: pastDateStr(7), fechaVencimiento: dateStr(100), estado: "Despachado", calidad: "Óptima", municipioDestinoId: 9 },
    { id: 23, codigo: "LOT-2026-0023", productoId: 11, donanteId: 1, cantidadKg: 40, fechaIngreso: pastDateStr(4), fechaVencimiento: pastDateStr(1), estado: "Vencido", calidad: "Regular" },
    { id: 24, codigo: "LOT-2026-0024", productoId: 10, donanteId: 4, cantidadKg: 90, fechaIngreso: pastDateStr(3), fechaVencimiento: dateStr(12), estado: "Disponible", calidad: "Óptima" },
    { id: 25, codigo: "LOT-2026-0025", productoId: 5, donanteId: 4, cantidadKg: 220, fechaIngreso: pastDateStr(1), fechaVencimiento: dateStr(7), estado: "Disponible", calidad: "Buena" },
];

export const despachos: Despacho[] = [
    { id: 1, loteId: 16, municipioId: 2, fechaDespacho: pastDateStr(5), transportador: "TransCol S.A.S.", racionesEntregadas: 240, estado: "Entregado" },
    { id: 2, loteId: 17, municipioId: 5, fechaDespacho: pastDateStr(3), transportador: "Envía Express", racionesEntregadas: 1900, estado: "Entregado" },
    { id: 3, loteId: 18, municipioId: 4, fechaDespacho: pastDateStr(10), transportador: "Servientrega", racionesEntregadas: 700, estado: "Entregado" },
    { id: 4, loteId: 13, municipioId: 1, fechaDespacho: pastDateStr(1), transportador: "TransCol S.A.S.", racionesEntregadas: 1600, estado: "En tránsito" },
    { id: 5, loteId: 14, municipioId: 3, fechaDespacho: dateStr(0), transportador: "Coordinadora", racionesEntregadas: 600, estado: "Programado" },
    { id: 6, loteId: 22, municipioId: 9, fechaDespacho: pastDateStr(2), transportador: "TCC", racionesEntregadas: 300, estado: "Entregado" },
    { id: 7, loteId: 15, municipioId: 8, fechaDespacho: pastDateStr(7), transportador: "Envía Express", racionesEntregadas: 400, estado: "Entregado" },
    { id: 8, loteId: 23, municipioId: 11, fechaDespacho: pastDateStr(4), transportador: "Servientrega", racionesEntregadas: 80, estado: "Entregado" },
];

// ============ DERIVED FUNCTIONS ============

export function getProducto(id: number): Producto | undefined {
    return productos.find(p => p.id === id);
}

export function getCategoria(id: number): Categoria | undefined {
    return categorias.find(c => c.id === id);
}

export function getDonante(id: number): Donante | undefined {
    return donantes.find(d => d.id === id);
}

export function getMunicipio(id: number): Municipio | undefined {
    return municipios.find(m => m.id === id);
}

export function getCategoriaByProducto(productoId: number): Categoria | undefined {
    const producto = getProducto(productoId);
    if (!producto) return undefined;
    return getCategoria(producto.categoriaId);
}

export function getDiasRestantes(fechaVencimiento: string): number {
    return differenceInDays(parseISO(fechaVencimiento), new Date());
}

export function getLotesProximosVencer(allLotes: Lote[], diasLimite: number): Lote[] {
    return allLotes
        .filter(l => l.estado === "Disponible" || l.estado === "Reservado")
        .filter(l => getDiasRestantes(l.fechaVencimiento) <= diasLimite)
        .sort((a, b) => getDiasRestantes(a.fechaVencimiento) - getDiasRestantes(b.fechaVencimiento));
}

export interface PrioridadDespacho {
    lote: Lote;
    producto: Producto;
    donante: Donante;
    municipioSugerido: Municipio;
    diasRestantes: number;
    prioridad: "CRÍTICA" | "ALTA" | "MEDIA";
}

export function getPrioridadDespacho(allLotes: Lote[]): PrioridadDespacho[] {
    const disponibles = allLotes
        .filter(l => l.estado === "Disponible")
        .map(l => ({ lote: l, dias: getDiasRestantes(l.fechaVencimiento) }))
        .filter(item => item.dias <= 10)
        .sort((a, b) => a.dias - b.dias);

    const municipiosOrdenados = [...municipios].sort((a, b) => b.ipm - a.ipm);

    return disponibles.map((item, index) => {
        const producto = getProducto(item.lote.productoId)!;
        const donante = getDonante(item.lote.donanteId)!;
        const municipioSugerido = municipiosOrdenados[index % municipiosOrdenados.length];
        const prioridad: "CRÍTICA" | "ALTA" | "MEDIA" =
            item.dias <= 2 ? "CRÍTICA" : item.dias <= 5 ? "ALTA" : "MEDIA";

        return {
            lote: item.lote,
            producto,
            donante,
            municipioSugerido,
            diasRestantes: item.dias,
            prioridad,
        };
    });
}

export interface KpiSummary {
    totalKgActivos: number;
    lotesEnAlerta: number;
    municipiosCubiertos: number;
    racionesEstimadas: number;
    kgRescatadosMes: number;
}

export function getKpiSummary(allLotes: Lote[], allDespachos: Despacho[]): KpiSummary {
    const activos = allLotes.filter(l => l.estado === "Disponible" || l.estado === "Reservado");
    const totalKgActivos = activos.reduce((sum, l) => sum + l.cantidadKg, 0);
    const lotesEnAlerta = allLotes.filter(l =>
        (l.estado === "Disponible" || l.estado === "Reservado") &&
        getDiasRestantes(l.fechaVencimiento) <= 3
    ).length;

    const municipioIds = new Set(allDespachos.map(d => d.municipioId));
    const municipiosCubiertos = municipioIds.size;
    const racionesEstimadas = Math.round(totalKgActivos / 0.5);

    const mesActualInicio = startOfMonth(new Date());
    const mesActualFin = endOfMonth(new Date());
    const kgRescatadosMes = allLotes
        .filter(l => isWithinInterval(parseISO(l.fechaIngreso), { start: mesActualInicio, end: mesActualFin }))
        .reduce((sum, l) => sum + l.cantidadKg, 0);

    return { totalKgActivos, lotesEnAlerta, municipiosCubiertos, racionesEstimadas, kgRescatadosMes };
}

export interface DonanteRanking {
    donante: Donante;
    totalKg: number;
    porcentaje: number;
}

export function getDonanteRanking(allLotes: Lote[]): DonanteRanking[] {
    const kgPorDonante: Record<number, number> = {};
    allLotes.forEach(l => {
        kgPorDonante[l.donanteId] = (kgPorDonante[l.donanteId] || 0) + l.cantidadKg;
    });

    const totalKg = Object.values(kgPorDonante).reduce((s, v) => s + v, 0);

    return Object.entries(kgPorDonante)
        .map(([id, kg]) => ({
            donante: getDonante(Number(id))!,
            totalKg: kg,
            porcentaje: totalKg > 0 ? (kg / totalKg) * 100 : 0,
        }))
        .sort((a, b) => b.totalKg - a.totalKg);
}

export function getDonacionesPorCategoria(allLotes: Lote[]): Array<{ categoria: string; kg: number; color: string }> {
    const kgPorCategoria: Record<number, number> = {};
    const mesActualInicio = startOfMonth(new Date());
    const mesActualFin = endOfMonth(new Date());

    allLotes
        .filter(l => isWithinInterval(parseISO(l.fechaIngreso), { start: mesActualInicio, end: mesActualFin }))
        .forEach(l => {
            const producto = getProducto(l.productoId);
            if (producto) {
                kgPorCategoria[producto.categoriaId] = (kgPorCategoria[producto.categoriaId] || 0) + l.cantidadKg;
            }
        });

    const colores: Record<number, string> = {
        1: "#22c55e", 2: "#3b82f6", 3: "#eab308", 4: "#ef4444", 5: "#f97316", 6: "#8b5cf6",
    };

    return categorias.map(c => ({
        categoria: c.nombre,
        kg: kgPorCategoria[c.id] || 0,
        color: colores[c.id] || "#94a3b8",
    }));
}

export function getEvolucionMensual(): Array<{ mes: string; kg: number }> {
    const resultado = [];
    for (let i = 5; i >= 0; i--) {
        const mesDate = subMonths(new Date(), i);
        const mesNombre = format(mesDate, 'MMM yyyy', { locale: es });
        // Simulated data for past months
        const baseKg = 2500 + Math.round(Math.random() * 2000);
        resultado.push({
            mes: mesNombre, kg: i === 0 ? lotes.reduce((s, l) => {
                const ingreso = parseISO(l.fechaIngreso);
                if (isWithinInterval(ingreso, { start: startOfMonth(new Date()), end: endOfMonth(new Date()) })) {
                    return s + l.cantidadKg;
                }
                return s;
            }, 0) : baseKg
        });
    }
    return resultado;
}

export function getDistribucionCategoria(allLotes: Lote[]): Array<{ name: string; value: number; color: string }> {
    const kgPorCategoria: Record<number, number> = {};
    allLotes.forEach(l => {
        const producto = getProducto(l.productoId);
        if (producto) {
            kgPorCategoria[producto.categoriaId] = (kgPorCategoria[producto.categoriaId] || 0) + l.cantidadKg;
        }
    });

    const colores: Record<number, string> = {
        1: "#22c55e", 2: "#3b82f6", 3: "#eab308", 4: "#ef4444", 5: "#f97316", 6: "#8b5cf6",
    };

    return categorias.map(c => ({
        name: c.nombre,
        value: kgPorCategoria[c.id] || 0,
        color: colores[c.id] || "#94a3b8",
    }));
}

export function formatFechaCorta(fecha: string): string {
    return format(parseISO(fecha), 'dd MMM yyyy', { locale: es });
}

export function formatFechaLarga(fecha: Date): string {
    return format(fecha, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
}

export function generarCodigoLote(allLotes: Lote[]): string {
    const año = new Date().getFullYear();
    const maxNum = allLotes.reduce((max, l) => {
        const match = l.codigo.match(/LOT-\d+-(\d+)/);
        if (match) return Math.max(max, parseInt(match[1]));
        return max;
    }, 0);
    return `LOT-${año}-${String(maxNum + 1).padStart(4, '0')}`;
}
