-- ============================================================
-- NutriRed — Consultas de Negocio (PostgreSQL / Supabase)
-- Mínimo 5 consultas con JOIN, Agregación, Window Function,
-- CTE y análisis de negocio.
-- Autores: Tomas Buitrago, Santiago Guerra, Miguel Muñoz
-- ============================================================


-- ============================================================
-- CONSULTA 1: JOIN MÚLTIPLE
-- Pregunta: ¿Cuáles son los 10 donantes que más kg han despachado
--           hacia municipios con IPM > 70 (alta vulnerabilidad)?
-- ============================================================

SELECT
    d.nombre            AS donante,
    d.tipo              AS tipo_donante,
    d.ciudad            AS ciudad_donante,
    m.nombre            AS municipio_destino,
    m.ipm               AS indice_pobreza,
    SUM(l.cantidad_kg)  AS total_kg_enviados,
    COUNT(l.id)         AS num_lotes
FROM lotes l
    JOIN donantes   d ON l.donante_id = d.id
    JOIN despachos  dp ON dp.lote_id = l.id
    JOIN municipios m ON dp.municipio_id = m.id
WHERE l.estado = 'Despachado'
  AND m.ipm > 70
GROUP BY d.nombre, d.tipo, d.ciudad, m.nombre, m.ipm
ORDER BY total_kg_enviados DESC
LIMIT 10;

/*
INTERPRETACIÓN:
Esta consulta cruza 4 tablas para identificar los donantes que más
impacto real generan al enviar alimentos a comunidades con alta pobreza
multidimensional (IPM > 70). Permite al banco de alimentos reconocer
y priorizar relaciones con estos donantes estratégicos.
*/


-- ============================================================
-- CONSULTA 2: AGREGACIÓN (GROUP BY + HAVING)
-- Pregunta: ¿Cuál es la distribución porcentual de kg por
--           categoría de alimento en el inventario actual?
-- ============================================================

SELECT
    c.nombre                                    AS categoria,
    c.icono,
    COUNT(l.id)                                 AS num_lotes,
    SUM(l.cantidad_kg)                          AS total_kg,
    ROUND(
        SUM(l.cantidad_kg) * 100.0
        / SUM(SUM(l.cantidad_kg)) OVER (),
        2
    )                                           AS porcentaje
FROM lotes l
    JOIN productos  p ON l.producto_id = p.id
    JOIN categorias c ON p.categoria_id = c.id
WHERE l.estado IN ('Disponible', 'Reservado')
GROUP BY c.id, c.nombre, c.icono
ORDER BY total_kg DESC;

/*
INTERPRETACIÓN:
Permite al equipo de logística ver qué familias de alimentos dominan
el inventario actual. Si los "Granos y legumbres" representan >60%
mientras que "Proteínas" está en <5%, se puede orientar la campaña
de donaciones para equilibrar la dieta de las raciones.
*/


-- ============================================================
-- CONSULTA 3: WINDOW FUNCTION (RANK)
-- Pregunta: ¿Cuál es el ranking de municipios por total de
--           raciones recibidas, incluyendo posición y acumulado?
-- ============================================================

SELECT
    m.nombre                                                AS municipio,
    m.departamento,
    m.ipm,
    m.poblacion,
    SUM(dp.raciones_entregadas)                             AS total_raciones,
    RANK() OVER (ORDER BY SUM(dp.raciones_entregadas) DESC) AS ranking,
    ROUND(
        SUM(dp.raciones_entregadas) * 100.0
        / SUM(SUM(dp.raciones_entregadas)) OVER (),
        2
    )                                                       AS pct_del_total,
    SUM(SUM(dp.raciones_entregadas)) OVER (
        ORDER BY SUM(dp.raciones_entregadas) DESC
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    )                                                       AS acumulado_raciones
FROM despachos dp
    JOIN municipios m ON dp.municipio_id = m.id
WHERE dp.estado = 'Entregado'
GROUP BY m.id, m.nombre, m.departamento, m.ipm, m.poblacion
ORDER BY ranking;

/*
INTERPRETACIÓN:
Usando RANK() y funciones de ventana se genera un ranking de impacto
por municipio. El acumulado permite ver, por ejemplo, que los primeros
5 municipios concentran el 60% de las raciones — útil para evaluar si
la distribución es equitativa o hay que diversificar.
*/


-- ============================================================
-- CONSULTA 4: CTE + ANALÍTICA (Tendencia Mensual)
-- Pregunta: ¿Cuál es la tendencia mensual de kg recibidos vs
--           kg despachados en los últimos 6 meses?
-- ============================================================

WITH ingresos_mensuales AS (
    SELECT
        DATE_TRUNC('month', fecha_ingreso)  AS mes,
        SUM(cantidad_kg)                    AS kg_ingresados,
        COUNT(*)                            AS lotes_ingresados
    FROM lotes
    WHERE fecha_ingreso >= CURRENT_DATE - INTERVAL '6 months'
    GROUP BY DATE_TRUNC('month', fecha_ingreso)
),
despachos_mensuales AS (
    SELECT
        DATE_TRUNC('month', dp.fecha_despacho)  AS mes,
        SUM(l.cantidad_kg)                       AS kg_despachados,
        COUNT(*)                                 AS lotes_despachados
    FROM despachos dp
        JOIN lotes l ON dp.lote_id = l.id
    WHERE dp.fecha_despacho >= CURRENT_DATE - INTERVAL '6 months'
    GROUP BY DATE_TRUNC('month', dp.fecha_despacho)
)
SELECT
    TO_CHAR(COALESCE(i.mes, d.mes), 'YYYY-MM')   AS periodo,
    COALESCE(i.kg_ingresados, 0)                  AS kg_ingresados,
    COALESCE(d.kg_despachados, 0)                 AS kg_despachados,
    COALESCE(i.kg_ingresados, 0)
        - COALESCE(d.kg_despachados, 0)           AS balance_kg,
    COALESCE(i.lotes_ingresados, 0)               AS lotes_in,
    COALESCE(d.lotes_despachados, 0)              AS lotes_out
FROM ingresos_mensuales i
    FULL OUTER JOIN despachos_mensuales d ON i.mes = d.mes
ORDER BY periodo;

/*
INTERPRETACIÓN:
Con dos CTEs y un FULL OUTER JOIN visualizamos la "salud" del banco:
- Si balance_kg es positivo → se acumula inventario (riesgo de vencimiento).
- Si es negativo → se despacha más de lo que entra (posible desabastecimiento).
Permite planificar campañas de donación en meses de bajo ingreso.
*/


-- ============================================================
-- CONSULTA 5: NEGOCIO — Alerta de Desperdicio
-- Pregunta: ¿Cuáles lotes disponibles vencen en los próximos
--           5 días y aún no tienen despacho asignado?
-- ============================================================

SELECT
    l.codigo,
    p.nombre                                AS producto,
    c.nombre                                AS categoria,
    d.nombre                                AS donante,
    l.cantidad_kg,
    l.fecha_vencimiento,
    (l.fecha_vencimiento - CURRENT_DATE)    AS dias_restantes,
    l.calidad,
    CASE
        WHEN (l.fecha_vencimiento - CURRENT_DATE) <= 1 THEN '🔴 CRÍTICO'
        WHEN (l.fecha_vencimiento - CURRENT_DATE) <= 3 THEN '🟠 URGENTE'
        ELSE '🟡 PRÓXIMO'
    END                                     AS nivel_alerta
FROM lotes l
    JOIN productos  p ON l.producto_id = p.id
    JOIN categorias c ON p.categoria_id = c.id
    JOIN donantes   d ON l.donante_id = d.id
WHERE l.estado = 'Disponible'
  AND l.fecha_vencimiento <= CURRENT_DATE + 5
  AND l.municipio_destino_id IS NULL
ORDER BY dias_restantes ASC, l.cantidad_kg DESC;

/*
INTERPRETACIÓN:
Esta es la consulta más crítica para el negocio: identifica alimentos
que están a punto de perderse. Los lotes marcados 🔴 CRÍTICO necesitan
despacho inmediato. Reducir el desperdicio es el objetivo principal
de NutriRed y esta consulta es el insumo para el algoritmo de ruteo.
*/


-- ============================================================
-- CONSULTA 6 (BONUS): Eficiencia por Transportador
-- Pregunta: ¿Cuál es la eficiencia de cada transportador
--           medida en raciones entregadas y tasa de entrega?
-- ============================================================

SELECT
    dp.transportador,
    COUNT(*)                                                AS total_envios,
    COUNT(*) FILTER (WHERE dp.estado = 'Entregado')         AS entregados,
    COUNT(*) FILTER (WHERE dp.estado = 'En tránsito')       AS en_transito,
    COUNT(*) FILTER (WHERE dp.estado = 'Programado')        AS programados,
    SUM(dp.raciones_entregadas)                             AS total_raciones,
    ROUND(
        COUNT(*) FILTER (WHERE dp.estado = 'Entregado') * 100.0
        / NULLIF(COUNT(*), 0),
        1
    )                                                       AS tasa_entrega_pct
FROM despachos dp
GROUP BY dp.transportador
ORDER BY tasa_entrega_pct DESC, total_raciones DESC;

/*
INTERPRETACIÓN:
Permite evaluar qué empresas de transporte cumplen mejor con las
entregas. Si "Servientrega" tiene 95% de tasa de entrega pero "TCC"
solo 60%, el banco puede renegociar contratos o reasignar rutas.
Usa la función FILTER de PostgreSQL para contar condicionalmente.
*/

-- ============================================================
-- FIN CONSULTAS
-- ============================================================
