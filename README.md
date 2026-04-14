# NutriRed 🍃

NutriRed es una plataforma web desarrollada para la gestión inteligente de donaciones de alimentos en Colombia (especialmente para Bancos de Alimentos). La aplicación permite hacer un seguimiento integral de las donaciones entrantes, categorizar el inventario con fechas de caducidad, y optimizar el despacho de raciones hacia municipios colombianos prioritarios basado en métricas de vulnerabilidad (IPM) y urgencia de consumo.

## 🚀 Características Principales

*   **Panel Principal (Dashboard)**: Visualización en tiempo real con KPIs dinámicos que indican el estado del inventario, total de raciones suministradas e impacto ambiental.
*   **Gestión de Donaciones y Lotes**: Sistema de registro riguroso que agrupa las donaciones en "Lotes" y asigna un indicador de vida útil (Crítica, Alta, Media) para priorizar su uso.
*   **Algoritmo de Ruteo y Despacho**: Lógica automatizada que sugiere despachos basándose en la proximidad de caducidad de los alimentos, dirigiéndolos hacia los municipios con mayor Índice de Pobreza Multidimensional para evitar el desperdicio.
*   **Gestor de Donantes**: Directorio completo de donantes con tablas de métricas de impacto individual.
*   **Laboratorio de Bases de Datos SQL**: Consola SQL interactiva integrada (`alasql`) que se conecta en tiempo real al estado de la aplicación React. Incluye un explorador y diagrama de Entidad-Relación (ER) para análisis de datos y educación.
*   **Asistente Virtual con IA (Groq & Llama-3)**: Chatbot flotante interactivo, pre-entrenado para brindar soporte sobre el funcionamiento de la plataforma, consultas SQL y modelos ER.

## 💻 Tech Stack

*   **Core**: React 18, TypeScript, Vite
*   **Estilos y UI**: TailwindCSS v4, shadcn/ui, Radix UI, Lucide React
*   **Visualización de Datos**: Recharts
*   **Validación y Formularios**: React Hook Form con Zod
*   **Base de Datos en Memoria**: AlaSQL
*   **AI y LLMs**: Groq API (modelo Llama-3)

## ⚙️ Prerrequisitos

Antes de instalar este proyecto localmente, necesitas tener instalado:
*   [Node.js](https://nodejs.org/) (versión 18.x o superior recomendada)
*   [npm](https://www.npmjs.com/) (generalmente incluido con Node.js), `yarn` o `pnpm`
*   [Git](https://git-scm.com/)

Para habilitar las funciones del Asistente Virtual IA, se requiere de una API Key de Groq.

## 📥 Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tobuja48/NutriRed.git
    cd NutriRed
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Configura las variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto y añade tu API Key:
    ```env
    VITE_GROQ_API_KEY=tu_api_key_de_groq_aqui
    ```

4.  **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

5.  Abre la aplicación en tu navegador de preferencia:
    `http://localhost:5173`

*Nota: También puedes acceder a una versión pura por consola de Node ejecutando `node consola-sql.js` (si está en el repositorio).*

## 📂 Estructura del Proyecto y Cómo Funciona

*   `src/components/`: Componentes modulares y reutilizables de UI (ej. Dashboards de métricas, los campos de formularios, Componente de `Chatbot` con groq-sdk, navbars).
*   `src/pages/`: Vistas de alto nivel y configuración de rutas. Aquí residen páginas complejas integradas como `ConsolaSQL.tsx`, `Donantes.tsx`, `Inventario.tsx`.
*   `src/contexts/`: Manejo de estado global usando Context API. Particularmente `AppContext.tsx` actúa como origen de la verdad conectando toda la información que consulta el dashboard y las tablas de base de datos en vivio interactivas.
*   `src/data/`: Datos iniciales (`mockData.ts`) precargados para testear la aplicación y poblar la base de datos en alasql de la terminal.

## 👥 Colaboradores y Equipo de Desarrollo

Este proyecto ha sido desarrollado por:
*   **Tomas Buitrago** - tbuitragoj@eafit.edu.co
*   **Santiago Guerra** - sguerrav1@eafit.edu.co
*   **Miguel Munoz**

---
*Diseñado y desarrollado para construir soluciones sostenibles por un objetivo "Cero Hambre" y apoyar activamente a los Bancos de Alimentos 🥬.*
