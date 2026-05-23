-- ============================================================
-- NutriRed — Scripts DDL (PostgreSQL / Supabase)
-- Actividad Final DatAI
-- Autores: Tomas Buitrago, Santiago Guerra, Miguel Muñoz
-- ============================================================

-- Eliminar tablas en orden inverso de dependencias (si existen)
DROP TABLE IF EXISTS despachos CASCADE;
DROP TABLE IF EXISTS lotes CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;
DROP TABLE IF EXISTS municipios CASCADE;
DROP TABLE IF EXISTS donantes CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- ============================================================
-- 1. DONANTES
-- Entidades que aportan alimentos al banco.
-- ============================================================
CREATE TABLE donantes (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(120)  NOT NULL,
    tipo        VARCHAR(30)   NOT NULL
                CHECK (tipo IN ('Supermercado','Productor','Restaurante','Industria','ONG','Persona natural')),
    ciudad      VARCHAR(80)   NOT NULL,
    contacto    VARCHAR(120)  NOT NULL,
    telefono    VARCHAR(30)   NOT NULL
);

COMMENT ON TABLE donantes IS 'Directorio de donantes de alimentos registrados en NutriRed.';

-- ============================================================
-- 2. CATEGORÍAS
-- Clasificación de alimentos por familia.
-- ============================================================
CREATE TABLE categorias (
    id              SERIAL PRIMARY KEY,
    nombre          VARCHAR(40)   NOT NULL UNIQUE
                    CHECK (nombre IN ('Frutas y verduras','Lácteos','Granos y legumbres','Proteínas','Panadería','Enlatados')),
    icono           VARCHAR(10)   NOT NULL,
    vida_util_dias  INT           NOT NULL CHECK (vida_util_dias > 0)
);

COMMENT ON TABLE categorias IS 'Familias de productos alimenticios con su vida útil promedio.';

-- ============================================================
-- 3. PRODUCTOS
-- Productos individuales dentro de cada categoría.
-- ============================================================
CREATE TABLE productos (
    id              SERIAL PRIMARY KEY,
    categoria_id    INT           NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
    nombre          VARCHAR(80)   NOT NULL,
    unidad_medida   VARCHAR(20)   NOT NULL
);

CREATE INDEX idx_productos_categoria ON productos(categoria_id);
COMMENT ON TABLE productos IS 'Catálogo de productos aceptados por el banco de alimentos.';

-- ============================================================
-- 4. MUNICIPIOS
-- Municipios colombianos vulnerables que reciben alimentos.
-- ============================================================
CREATE TABLE municipios (
    id              SERIAL PRIMARY KEY,
    nombre          VARCHAR(80)   NOT NULL,
    departamento    VARCHAR(60)   NOT NULL,
    ipm             DECIMAL(5,2)  NOT NULL CHECK (ipm >= 0 AND ipm <= 100),
    poblacion       INT           NOT NULL CHECK (poblacion > 0),
    distancia_km    DECIMAL(7,1)  NOT NULL CHECK (distancia_km >= 0)
);

COMMENT ON TABLE municipios IS 'Municipios con alto Índice de Pobreza Multidimensional (IPM) priorizados para envío de alimentos.';
COMMENT ON COLUMN municipios.ipm IS 'Índice de Pobreza Multidimensional (0-100). Mayor valor = mayor vulnerabilidad.';

-- ============================================================
-- 5. LOTES
-- Unidad central: cada donación se registra como un lote.
-- ============================================================
CREATE TABLE lotes (
    id                    SERIAL PRIMARY KEY,
    codigo                VARCHAR(20)   NOT NULL UNIQUE,
    producto_id           INT           NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
    donante_id            INT           NOT NULL REFERENCES donantes(id) ON DELETE RESTRICT,
    cantidad_kg           DECIMAL(10,2) NOT NULL CHECK (cantidad_kg > 0),
    fecha_ingreso         DATE          NOT NULL DEFAULT CURRENT_DATE,
    fecha_vencimiento     DATE          NOT NULL,
    estado                VARCHAR(20)   NOT NULL DEFAULT 'Disponible'
                          CHECK (estado IN ('Disponible','Reservado','Despachado','Vencido')),
    calidad               VARCHAR(10)   NOT NULL DEFAULT 'Buena'
                          CHECK (calidad IN ('Óptima','Buena','Regular')),
    municipio_destino_id  INT           REFERENCES municipios(id) ON DELETE SET NULL,

    CONSTRAINT chk_fechas CHECK (fecha_vencimiento >= fecha_ingreso)
);

CREATE INDEX idx_lotes_estado ON lotes(estado);
CREATE INDEX idx_lotes_donante ON lotes(donante_id);
CREATE INDEX idx_lotes_producto ON lotes(producto_id);
CREATE INDEX idx_lotes_vencimiento ON lotes(fecha_vencimiento);
COMMENT ON TABLE lotes IS 'Tabla central: cada lote representa una donación de alimentos recibida.';

-- ============================================================
-- 6. DESPACHOS
-- Envíos de lotes hacia municipios beneficiarios.
-- ============================================================
CREATE TABLE despachos (
    id                    SERIAL PRIMARY KEY,
    lote_id               INT           NOT NULL REFERENCES lotes(id) ON DELETE CASCADE,
    municipio_id          INT           NOT NULL REFERENCES municipios(id) ON DELETE RESTRICT,
    fecha_despacho        DATE          NOT NULL DEFAULT CURRENT_DATE,
    transportador         VARCHAR(80)   NOT NULL,
    raciones_entregadas   INT           NOT NULL CHECK (raciones_entregadas > 0),
    estado                VARCHAR(20)   NOT NULL DEFAULT 'Programado'
                          CHECK (estado IN ('Programado','En tránsito','Entregado'))
);

CREATE INDEX idx_despachos_municipio ON despachos(municipio_id);
CREATE INDEX idx_despachos_lote ON despachos(lote_id);
CREATE INDEX idx_despachos_fecha ON despachos(fecha_despacho);
COMMENT ON TABLE despachos IS 'Registros de envíos de lotes hacia municipios colombianos vulnerables.';

-- ============================================================
-- 7. USUARIOS (Autenticación de la aplicación web)
-- ============================================================
CREATE TABLE usuarios (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(120)  NOT NULL,
    email       VARCHAR(120)  NOT NULL UNIQUE,
    password    VARCHAR(255)  NOT NULL,
    rol         VARCHAR(20)   NOT NULL DEFAULT 'cliente'
                CHECK (rol IN ('banco','cliente')),
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_usuarios_email ON usuarios(email);
COMMENT ON TABLE usuarios IS 'Usuarios de la plataforma web NutriRed con roles diferenciados.';

-- ============================================================
-- FIN DDL
-- ============================================================
