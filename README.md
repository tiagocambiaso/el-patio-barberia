# El Patio Barbería — Sistema de Gestión y Reserva de Turnos

Aplicación web full-stack para la reserva de turnos online y gestión de agenda de **El Patio Barbería**. Combina una landing page de alto impacto visual con persistencia en PostgreSQL, validación estricta en servidor, autogestión de cancelaciones mediante códigos únicos y un panel de administración protegido.

🔗 **Demo en vivo:** `[https://el-patio-barberia.vercel.app](https://el-patio-barberia.vercel.app)` _(actualizar tras deploy en Vercel)_

---

## Funcionalidades Principales

- **Reserva de Turnos en Tiempo Real:** Selección interactiva de servicio, barbero, día y franja horaria con bloqueo instantáneo de horarios ocupados.
- **Prevención de Concurrencia:** Restricciones a nivel de base de datos mediante índices únicos compuestos (`uniqueIndex`) para evitar dobles reservas simultáneas en un mismo horario y barbero.
- **Código Único de Reserva (`PT-XXXX`):** Generación automática de comprobante con código identificador y exportación directa a mensaje prearmado de WhatsApp.
- **Autogestión de Cancelaciones:** Flujo para que el cliente cancele su turno validando simultáneamente su código de reserva y teléfono, liberando el horario al instante.
- **Panel de Administración (`/admin`):** Vista protegida por PIN con sesión mediante cookies `httpOnly`, filtros por barbero y día, métricas de recaudación estimada y control de estados (`confirmado`, `completado`, `cancelado`).
- **SEO Técnico y Rendimiento:** Metadatos dinámicos, datos estructurados JSON-LD (`HairSalon`), `sitemap.ts`, `robots.ts` con exclusión de rutas privadas y renderizado híbrido con Server Components.

---

## Stack Tecnológico

- **Framework:** Next.js (App Router) + React + TypeScript
- **Estilos:** Tailwind CSS
- **Base de Datos:** PostgreSQL Serverless (Neon)
- **ORM y Migraciones:** Drizzle ORM + Drizzle Kit
- **Validación:** Zod (esquemas en cliente y Server Actions)
- **Gestor de Paquetes:** pnpm

---

## Arquitectura del Proyecto

El código fuente sigue una arquitectura modular orientada a **features** dentro de `src/`, manteniendo desacoplada la capa de enrutamiento de la lógica de negocio y el acceso a datos:

```text
src/
├── app/                 # Rutas del App Router, layouts, metadata, sitemap y robots
├── components/          # Componentes de UI compartidos globalmente (Navbar, Footer, etc.)
├── db/                  # Conexión a Neon y definición del esquema relacional en Drizzle
├── features/
│   ├── admin/           # Lógica, Server Actions y componentes del panel privado (/admin)
│   └── turnos/          # Esquemas Zod, mutaciones y flujo completo de reserva/cancelación
└── lib/                 # Constantes centralizadas, catálogos y utilidades puras
```
