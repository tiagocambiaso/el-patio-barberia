<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — Arquitectura y Reglas del Proyecto

## 1. Stack Tecnológico

- **Framework:** Next.js (App Router) con TypeScript estricto.
- **Gestor de paquetes:** `pnpm` (nunca usar `npm` ni `yarn`).
- **Estilos:** Tailwind CSS.
- **Base de datos (cuando aplique):** Drizzle ORM.

## 2. Arquitectura Feature-Based (dentro de `src/`)

El proyecto sigue una separación estricta por responsabilidades. Todo el código de la aplicación vive dentro de `src/` (con el alias `@/*` apuntando a `./src/*` en `tsconfig.json`):

- `src/app/`: **Únicamente enrutamiento, SEO técnico (`sitemap.ts`, `robots.ts`) y renderizado de páginas** (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`). No escribir lógica de negocio ni componentes complejos acá; solo importar vistas desde `features/` y `components/`.
- `src/features/`: **Módulos aislados por funcionalidad del negocio.** Cada feature contiene sus propios componentes, acciones, tipos y datos:
  - `src/features/hero/`: Portada principal, propuesta de valor y llamado a la acción (CTA).
  - `src/features/servicios/`: Listado de cortes, arreglos de barba, combos y precios.
  - `src/features/turnos/`: Formulario o selector rápido de reserva con redirección a WhatsApp (con mensaje prearmado) o persistencia.
  - `src/features/galeria/`: Grilla de fotos de cortes y trabajos realizados.
  - `src/features/contacto/`: Ubicación, mapa, horarios de atención y redes sociales.
- `src/components/`: **Componentes globales reutilizables** en toda la aplicación (ej. `Navbar.tsx`, `Footer.tsx`, botones genéricos, badges).
- `src/db/`: Conexión y esquemas de Drizzle ORM (solo si el proyecto requiere persistencia).
- `src/lib/`: Funciones auxiliares puras y constantes globales (ej. formateo de moneda ARS, links de WhatsApp, datos del comercio).

## 3. Reglas de Código y Dependencias

1. **Aislamiento entre features:** Una carpeta dentro de `src/features/` **nunca** debe importar archivos de otra carpeta dentro de `src/features/`. Si dos features necesitan compartir UI, mover el componente a `src/components/`; si necesitan compartir lógica, moverla a `src/lib/`.
2. **Imports limpios:** Usar siempre el alias `@/` (ej. `@/features/servicios/components/ListaServicios` o `@/components/Navbar`). Evitar rutas relativas largas (`../../`).
3. **Server vs Client Components:** Mantener los componentes como _Server Components_ por defecto. Agregar `'use client'` únicamente cuando se utilicen hooks de React (`useState`, `useEffect`), eventos del navegador (`onClick`, `onChange`) o formularios interactivos.
4. **Diseño y UX:** Mobile-first, estética moderna y limpia, contrastes altos, tipografía legible y botones de acción directos (WhatsApp / Turnos) siempre visibles.
5. **SEO Técnico y Local:** Mantener `metadata` completa en `src/app/layout.tsx` (título, descripción local, OpenGraph, canonical), archivos nativos `src/app/sitemap.ts` y `src/app/robots.ts`, jerarquía semántica correcta (`<h1>` único, `<h2>`, `<h3>`) y datos estructurados JSON-LD (`Schema.org` de negocio local) cuando corresponda.
6. **Documentación Actualizada:** Ante dudas sobre APIs recientes de Next.js, React, Tailwind o Drizzle, consultar los docs locales o usar el skill de Context7 antes de escribir código.

## 4. Flujo de Trabajo para el Agente

- Antes de crear un archivo nuevo, verificar en qué `feature` corresponde según su funcionalidad.
- No modificar archivos de otras `features` si la tarea pedida corresponde a una sección puntual.
- Mantener los textos de la interfaz en español (Argentina) con tono cercano y profesional.
- Antes de cerrar cualquier cambio, verificar compilación y tipos con `pnpm exec tsc --noEmit` y `pnpm lint`.
