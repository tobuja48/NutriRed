# NutriRed 🍃
### Plataforma de Gestión Inteligente de Donaciones de Alimentos

**Actividad Final — Curso DatAI**  
**Autores:** Tomas Buitrago · Santiago Guerra · Miguel Muñoz  
**Universidad EAFIT** — Mayo 2026

---

## 📋 Descripción del Proyecto

NutriRed es una plataforma web que gestiona la cadena de donaciones de alimentos para bancos de alimentos en Colombia. Permite registrar donaciones como lotes trazables, priorizar despachos hacia municipios con alto Índice de Pobreza Multidimensional (IPM), y prevenir el desperdicio alimentario mediante alertas inteligentes.

**Plataforma de base de datos:** Supabase (PostgreSQL Serverless)  
**Aplicación web:** React + TypeScript + Vite + TailwindCSS v4 + alasql (motor SQL in-browser)

---

## 🔗 Conexión a la Base de Datos

### Supabase (PostgreSQL en producción)

| Dato | Valor |
|------|-------|
| **URL del proyecto** | *(agregar URL de tu proyecto Supabase)* |
| **Acceso SQL Editor** | Panel de Supabase → SQL Editor |
| **Credenciales de solo lectura** | *(crear rol read-only si es necesario)* |

> **Nota:** Para reproducir la base de datos desde cero, ejecutar los scripts SQL en el orden indicado abajo.

### Aplicación Web (demo local)

```bash
git clone https://github.com/tobuja48/NutriRed.git
cd NutriRed
npm install
echo "VITE_GROQ_API_KEY=<tu_api_key_groq>" > .env
npm run dev
```

Credenciales de prueba (aplicación web):
- **Banco:** `admin@nutrired.com` / `123`
- **Cliente:** `cliente@nutrired.com` / `123`

---

## 📂 Archivos Entregados

| Archivo | Propósito |
|---------|-----------|
| `sql/01_ddl.sql` | Scripts DDL (CREATE TABLE) en PostgreSQL para las 7 tablas del modelo. |
| `sql/02_seed_data.sql` | Datos de prueba: ~800+ filas (500 lotes, 200 despachos, 30 donantes, 30 municipios, etc.) |
| `sql/03_consultas_negocio.sql` | 6 consultas de negocio con JOIN, GROUP BY, Window Functions (RANK), CTEs y análisis. |
| `docs/informe.md` | Informe de 3-5 páginas con las 8 secciones requeridas. |
| `README.md` | Este archivo — guía de navegación del entregable. |
| `src/` | Código fuente completo de la aplicación web (React + TypeScript). |
| `src/pages/ConsolaSQL.tsx` | Laboratorio SQL interactivo con diagrama ER integrado en la UI. |
| `src/data/mockData.ts` | Datos simulados usados en la versión in-browser de la aplicación. |

---

## 🔍 Instrucciones para Ejecutar las Consultas

### Opción A: En Supabase (recomendado)

1. Ingresar al proyecto en [supabase.com](https://supabase.com).
2. Ir a **SQL Editor** en el menú lateral.
3. **Paso 1:** Pegar y ejecutar el contenido de `sql/01_ddl.sql`.
4. **Paso 2:** Pegar y ejecutar el contenido de `sql/02_seed_data.sql`.
5. **Paso 3:** Abrir `sql/03_consultas_negocio.sql` y ejecutar cada consulta individualmente para ver los resultados.

### Opción B: En la Aplicación Web (alasql in-browser)

1. Ejecutar `npm run dev` y abrir `http://localhost:5173`.
2. Iniciar sesión como **Banco** (`admin@nutrired.com` / `123`).
3. En el menú lateral ir a **"Lab SQL"**.
4. Usar la consola SQL interactiva o seleccionar los ejemplos predefinidos.

> **Nota:** La consola in-browser usa `alasql` (motor SQL JavaScript) con datos reducidos. Para las consultas completas con Window Functions y CTEs, usar Supabase (PostgreSQL real).

---

## 🚀 Características Principales de la Aplicación

- **Panel Principal (Dashboard)**: KPIs en tiempo real del inventario, raciones y huella ambiental.
- **Gestión de Lotes**: Registro con fechas de caducidad, indicadores de vida útil y calidad.
- **Algoritmo de Ruteo**: Despacho priorizado por IPM del municipio y urgencia de consumo.
- **Laboratorio SQL**: Consola interactiva + Explorador de Datos + Diagrama ER visual.
- **Chatbot con IA**: Asistente virtual (Groq + Llama-3) que ejecuta consultas SQL en lenguaje natural.
- **Roles Diferenciados**: Interfaces separadas para Banco (administrador) y Cliente (donante).
- **Autenticación**: Login/registro con base de datos local y sesión persistente.

---

## 💻 Tech Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Estilos | TailwindCSS v4, shadcn/ui, Radix UI |
| Visualización | Recharts |
| BD en memoria | alasql (consola SQL in-browser) |
| BD producción | Supabase (PostgreSQL) |
| IA | Groq API (Llama-3.1-8b-instant) |
| Validación | React Hook Form, Zod |

---

## 👥 Equipo de Desarrollo

| Nombre | Correo |
|--------|--------|
| Tomas Buitrago | tbuitragoj@eafit.edu.co |
| Santiago Guerra | sguerrav1@eafit.edu.co |
| Miguel Muñoz | mmunozj4@eafit.edu.co |

---

*Diseñado para construir soluciones sostenibles por un objetivo "Cero Hambre" y apoyar activamente a los Bancos de Alimentos en Colombia 🥬*
