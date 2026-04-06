# NutriRed 🍃

NutriRed es una plataforma web desarrollada para la gestión inteligente de donaciones de alimentos en Colombia (Bancos de Alimentos). La aplicación permite hacer un seguimiento de las donaciones entrantes, la categorización del inventario con fechas de caducidad, y el despacho optimizado de raciones hacia municipios colombianos prioritarios basado en factores como métricas de vulnerabilidad (IPM) y urgencia de fecha de vencimiento.

## Características Principales 🚀

- **Panel Principal (Dashboard)**: KPI dinámicos indicando el estado del inventario, total de raciones suministradas e impacto ambiental.
- **Entrada de Donaciones y Lotes**: Sistema de registro de donaciones con tipado riguroso, que separa las donaciones en "Lotes" con un indicador de vida útil (Crítica, Alta, Media).
- **Ruteo de Despacho (Algoritmo)**: Lógica automatizada que emite sugerencias de despachos basándose en la urgencia del alimento para evitar el desperdicio, enviándose a municipios necesitados.
- **Gestor de Donantes**: Directorio de los donantes con tablas de métricas individuales.
- **Laboratorio de Bases de Datos SQL**: Incluye una consola SQL interactiva embebida (usando `alasql`) conectada al estado real en vivo de las tablas transaccionales de React, incluyendo explorador y diagramado Entidad-Relación (ER) para comprender la normalización de la DB.
- **Asistente Virtual (IA)**: Chatbot flotante interactivo, accionado por la API de Groq (Llama-3), con conciencia pre-entrenada para dar soporte técnico rápido sobre SQL, Modelo ER o dudas operacionales.

## Stack Tecnológico 💻

- **Frontend Core**: React 18 + TypeScript + Vite.
- **Interfaz y UI**: TailwindCSS v4, shadcn/ui, Radix UI y Lucide React para iconografía.
- **Gráficos**: Recharts.
- **Formularios y Validación**: react-hook-form + zod.
- **Integraciones Nativas**: fetch API (Groq) y alaSQL (para Consola Virtual Local).
- **Desarrollo**: NPM, ESLint.

## Instalación y Uso Local ⚙️

1. Clonar este repositorio:
   ```bash
   git clone https://github.com/tobuja48/NutriRed.git
   ```
2. Entrar al directorio e instalar dependencias:
   ```bash
   cd NutriRed
   npm install
   ```
3. Levantar el proyecto en desarrollo:
   ```bash
   npm run dev
   ```
4. Abrir la URL local servida (usualmente `http://localhost:5173/`).

*Opcional: Contiene además el archivo `consola-sql.js` ejecutado nativamente en terminal NodeJS, que replica el estado de prueba relacional.*
```bash
node consola-sql.js
```

## Estructura del Código
La carpeta principal está dentro de `src/`, donde destacan:
- `components/`: Módulos visuales aislados (dashboard, inventario, formularios, `Chatbot`).
- `pages/`: Pantallas principales de interfaz donde reside el layout. Destaca `ConsolaSQL.tsx`.
- `data/`: `mockData.ts` provee una capa de datos fijos persistidos mediante memoria temporal.
- `contexts/`: React Context para el estado global (`AppContext.tsx`).

---
Elaborado para soluciones sostenibles Cero Hambre y soporte a Bancos de Alimentos 🥬.
