-- ============================================================
-- NutriRed — Datos de Prueba (PostgreSQL / Supabase)
-- ~800+ filas totales distribuidas en todas las tablas
-- Autores: Tomas Buitrago, Santiago Guerra, Miguel Muñoz
-- ============================================================

-- ============================================================
-- USUARIOS (5 filas)
-- ============================================================
INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Administrador Banco', 'admin@nutrired.com', '123', 'banco'),
('Coordinador Logístico', 'logistica@nutrired.com', '123', 'banco'),
('Juan Pérez', 'cliente@nutrired.com', '123', 'cliente'),
('María López', 'maria.lopez@email.com', '123', 'cliente'),
('Carlos Ruiz', 'carlos.ruiz@email.com', '123', 'cliente');

-- ============================================================
-- CATEGORÍAS (6 filas)
-- ============================================================
INSERT INTO categorias (id, nombre, icono, vida_util_dias) VALUES
(1, 'Frutas y verduras', '🍎', 7),
(2, 'Lácteos', '🥛', 14),
(3, 'Granos y legumbres', '🌾', 180),
(4, 'Proteínas', '🥩', 5),
(5, 'Panadería', '🍞', 4),
(6, 'Enlatados', '🥫', 365);

-- ============================================================
-- PRODUCTOS (30 filas)
-- ============================================================
INSERT INTO productos (id, categoria_id, nombre, unidad_medida) VALUES
(1,  1, 'Banano', 'kg'),
(2,  1, 'Tomate', 'kg'),
(3,  1, 'Papa criolla', 'kg'),
(4,  1, 'Cebolla cabezona', 'kg'),
(5,  1, 'Zanahoria', 'kg'),
(6,  1, 'Manzana roja', 'kg'),
(7,  1, 'Naranja', 'kg'),
(8,  1, 'Lechuga', 'kg'),
(9,  2, 'Leche entera', 'litros'),
(10, 2, 'Yogur natural', 'kg'),
(11, 2, 'Queso campesino', 'kg'),
(12, 2, 'Kumis', 'litros'),
(13, 3, 'Arroz blanco', 'kg'),
(14, 3, 'Lenteja', 'kg'),
(15, 3, 'Frijol rojo', 'kg'),
(16, 3, 'Garbanzo', 'kg'),
(17, 3, 'Avena en hojuelas', 'kg'),
(18, 4, 'Pollo entero', 'kg'),
(19, 4, 'Huevo AA', 'unidades'),
(20, 4, 'Carne de res', 'kg'),
(21, 4, 'Pescado tilapia', 'kg'),
(22, 5, 'Pan tajado', 'kg'),
(23, 5, 'Mogolla integral', 'kg'),
(24, 5, 'Arepa de maíz', 'kg'),
(25, 5, 'Galleta de soda', 'kg'),
(26, 6, 'Atún en lata', 'kg'),
(27, 6, 'Sardina enlatada', 'kg'),
(28, 6, 'Maíz enlatado', 'kg'),
(29, 6, 'Salsa de tomate', 'kg'),
(30, 6, 'Mermelada', 'kg');

-- ============================================================
-- DONANTES (30 filas)
-- ============================================================
INSERT INTO donantes (id, nombre, tipo, ciudad, contacto, telefono) VALUES
(1,  'Éxito Centro', 'Supermercado', 'Bogotá', 'Carlos Méndez', '+57 310 234 5678'),
(2,  'Finca Santa Rosa', 'Productor', 'Villa de Leyva', 'María Rodríguez', '+57 315 876 4321'),
(3,  'Restaurante El Cielo', 'Restaurante', 'Medellín', 'Juan Pablo Gómez', '+57 300 112 3344'),
(4,  'Alpina S.A.', 'Industria', 'Sopó', 'Laura Martínez', '+57 321 998 7766'),
(5,  'Fundación Minuto de Dios', 'ONG', 'Bogotá', 'Andrés Patiño', '+57 318 445 6677'),
(6,  'Hacienda La Esperanza', 'Productor', 'Tuluá', 'Fernando Caicedo', '+57 312 667 8899'),
(7,  'Carulla Fresh Market', 'Supermercado', 'Cali', 'Diana Restrepo', '+57 316 223 4455'),
(8,  'Pedro Hernández', 'Persona natural', 'Bucaramanga', 'Pedro Hernández', '+57 305 334 5566'),
(9,  'Colanta', 'Industria', 'Medellín', 'Roberto Ochoa', '+57 310 778 9900'),
(10, 'D1 Tiendas', 'Supermercado', 'Bogotá', 'Luisa Fernández', '+57 311 556 7788'),
(11, 'Finca El Paraíso', 'Productor', 'Armenia', 'Jorge Aristizábal', '+57 314 889 0011'),
(12, 'Restaurante Crepes & Waffles', 'Restaurante', 'Bogotá', 'Beatriz Fernández', '+57 300 667 8899'),
(13, 'Grupo Nutresa', 'Industria', 'Medellín', 'Alejandro Gómez', '+57 320 445 6677'),
(14, 'Olímpica', 'Supermercado', 'Barranquilla', 'Martha Salazar', '+57 315 334 5566'),
(15, 'Fundación Éxito', 'ONG', 'Medellín', 'Carolina Uribe', '+57 318 223 4455'),
(16, 'Finca La Montaña', 'Productor', 'Manizales', 'Hernán Grajales', '+57 312 112 3344'),
(17, 'Restaurante Wok', 'Restaurante', 'Bogotá', 'Benjamín Villegas', '+57 300 998 7766'),
(18, 'Postobón', 'Industria', 'Bogotá', 'Sandra Velásquez', '+57 321 876 5432'),
(19, 'Jumbo Cencosud', 'Supermercado', 'Bogotá', 'Ricardo Ramírez', '+57 310 765 4321'),
(20, 'Ana María Torres', 'Persona natural', 'Pereira', 'Ana María Torres', '+57 305 654 3210'),
(21, 'Mercadería Justo y Bueno', 'Supermercado', 'Cali', 'Iván Castro', '+57 316 543 2109'),
(22, 'Finca Los Nogales', 'Productor', 'Boyacá', 'Gustavo Nieto', '+57 314 432 1098'),
(23, 'Restaurante Andrés D.C.', 'Restaurante', 'Bogotá', 'Andrés Carne', '+57 300 321 0987'),
(24, 'Meals de Colombia', 'Industria', 'Bogotá', 'Patricia León', '+57 320 210 9876'),
(25, 'Fundación Compartir', 'ONG', 'Bogotá', 'Eduardo Silva', '+57 318 109 8765'),
(26, 'Finca San Martín', 'Productor', 'Santander', 'Ramiro Pérez', '+57 312 098 7654'),
(27, 'Cosechas', 'Restaurante', 'Medellín', 'Valentina Duque', '+57 300 987 6543'),
(28, 'Alquería', 'Industria', 'Cajicá', 'Natalia Herrera', '+57 321 876 5431'),
(29, 'Ara Tiendas', 'Supermercado', 'Pereira', 'Óscar Montoya', '+57 310 765 4320'),
(30, 'Luis Carlos Mejía', 'Persona natural', 'Bogotá', 'Luis Carlos Mejía', '+57 305 654 3211');

-- ============================================================
-- MUNICIPIOS (30 filas — datos basados en DANE Colombia)
-- ============================================================
INSERT INTO municipios (id, nombre, departamento, ipm, poblacion, distancia_km) VALUES
(1,  'Uribia', 'La Guajira', 92.20, 182898, 1120),
(2,  'Manaure', 'La Guajira', 89.50, 109464, 1085),
(3,  'Alto Baudó', 'Chocó', 88.10, 35840, 650),
(4,  'Guapi', 'Cauca', 78.30, 30825, 580),
(5,  'Tierralta', 'Córdoba', 72.90, 102897, 420),
(6,  'El Charco', 'Nariño', 70.10, 38456, 710),
(7,  'López de Micay', 'Cauca', 68.50, 21764, 630),
(8,  'Tumaco', 'Nariño', 65.20, 229752, 750),
(9,  'Quibdó', 'Chocó', 62.80, 130715, 580),
(10, 'Riosucio', 'Chocó', 60.40, 30694, 540),
(11, 'Buenaventura', 'Valle del Cauca', 55.70, 423927, 490),
(12, 'Apartadó', 'Antioquia', 48.30, 195853, 340),
(13, 'Turbo', 'Antioquia', 52.10, 171834, 380),
(14, 'Maicao', 'La Guajira', 58.90, 162025, 1050),
(15, 'Soledad', 'Atlántico', 38.60, 685584, 960),
(16, 'Riohacha', 'La Guajira', 61.30, 285600, 1075),
(17, 'Istmina', 'Chocó', 75.40, 25800, 600),
(18, 'Barbacoas', 'Nariño', 71.80, 39200, 720),
(19, 'Roberto Payán', 'Nariño', 69.30, 18500, 700),
(20, 'Sipí', 'Chocó', 85.20, 4200, 670),
(21, 'Bojayá', 'Chocó', 83.70, 11200, 590),
(22, 'Bahía Solano', 'Chocó', 64.50, 10500, 610),
(23, 'Nuquí', 'Chocó', 66.80, 8400, 640),
(24, 'San Andrés de Tumaco', 'Nariño', 63.10, 215000, 760),
(25, 'Timbiquí', 'Cauca', 76.20, 22300, 620),
(26, 'Magüí Payán', 'Nariño', 73.50, 19800, 690),
(27, 'Mosquera', 'Nariño', 67.90, 15600, 680),
(28, 'Olaya Herrera', 'Nariño', 72.40, 32100, 730),
(29, 'Santa Bárbara', 'Nariño', 68.10, 12400, 710),
(30, 'Condoto', 'Chocó', 59.80, 15900, 560);

-- ============================================================
-- LOTES (500 filas)
-- Generados con distribución realista de fechas, productos y estados
-- ============================================================

-- Función auxiliar para generar lotes masivos
-- Usamos generate_series de PostgreSQL para crear 500 lotes
INSERT INTO lotes (codigo, producto_id, donante_id, cantidad_kg, fecha_ingreso, fecha_vencimiento, estado, calidad, municipio_destino_id)
SELECT
    'LOT-2026-' || LPAD(s::TEXT, 4, '0'),
    -- Producto aleatorio (1-30)
    (MOD(s * 7 + 3, 30) + 1),
    -- Donante aleatorio (1-30)
    (MOD(s * 13 + 5, 30) + 1),
    -- Cantidad entre 20 y 1500 kg
    ROUND((20 + MOD(s * 37, 1480))::NUMERIC, 1),
    -- Fecha ingreso: últimos 6 meses
    CURRENT_DATE - (MOD(s * 11 + 7, 180))::INT,
    -- Fecha vencimiento: ingreso + vida útil variable
    CURRENT_DATE - (MOD(s * 11 + 7, 180))::INT + (MOD(s * 3 + 1, 60) + 3)::INT,
    -- Estado distribuido: ~50% Disponible, 15% Reservado, 25% Despachado, 10% Vencido
    CASE
        WHEN MOD(s, 20) < 10 THEN 'Disponible'
        WHEN MOD(s, 20) < 13 THEN 'Reservado'
        WHEN MOD(s, 20) < 18 THEN 'Despachado'
        ELSE 'Vencido'
    END,
    -- Calidad distribuida
    CASE
        WHEN MOD(s, 10) < 5 THEN 'Óptima'
        WHEN MOD(s, 10) < 8 THEN 'Buena'
        ELSE 'Regular'
    END,
    -- Municipio destino (solo para Reservado y Despachado)
    CASE
        WHEN MOD(s, 20) >= 10 AND MOD(s, 20) < 18 THEN (MOD(s * 17, 30) + 1)
        ELSE NULL
    END
FROM generate_series(1, 500) AS s;

-- ============================================================
-- DESPACHOS (200 filas)
-- Solo para lotes que tienen estado 'Despachado' o 'Reservado'
-- ============================================================
INSERT INTO despachos (lote_id, municipio_id, fecha_despacho, transportador, raciones_entregadas, estado)
SELECT
    l.id,
    COALESCE(l.municipio_destino_id, (MOD(l.id * 7, 30) + 1)),
    l.fecha_ingreso + (MOD(l.id * 3, 10) + 1),
    CASE MOD(l.id, 6)
        WHEN 0 THEN 'TransCol S.A.S.'
        WHEN 1 THEN 'Envía Express'
        WHEN 2 THEN 'Servientrega'
        WHEN 3 THEN 'Coordinadora'
        WHEN 4 THEN 'TCC'
        ELSE 'Deprisa'
    END,
    GREATEST(ROUND(l.cantidad_kg / 0.5)::INT, 1),
    CASE
        WHEN l.estado = 'Despachado' THEN
            CASE WHEN MOD(l.id, 3) = 0 THEN 'Entregado' ELSE 'En tránsito' END
        ELSE 'Programado'
    END
FROM lotes l
WHERE l.estado IN ('Despachado', 'Reservado')
LIMIT 200;

-- ============================================================
-- RESUMEN DE DATOS CARGADOS
-- ============================================================
-- Tabla           | Filas esperadas
-- ----------------+----------------
-- usuarios        |   5
-- categorias      |   6
-- productos       |  30
-- donantes        |  30
-- municipios      |  30
-- lotes           | 500
-- despachos       | ~200
-- ----------------+----------------
-- TOTAL           | ~801 filas
-- ============================================================
