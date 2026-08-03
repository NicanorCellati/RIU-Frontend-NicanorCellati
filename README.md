# RIU-Frontend-Nicanor-Cellati

Prueba técnica Frontend — Mantenimiento de Super Héroes, desarrollada en **Angular 22 (última versión estable)**,
100% standalone (sin NgModules), zoneless, con programación reactiva (RxJs + Signals) y **Tailwind CSS** para todos los estilos.

## Sobre Tailwind CSS

Todos los componentes usan utilidades de Tailwind directamente en el template — no hay archivos `.css` por componente.

Configuración: `tailwindcss` + `@tailwindcss/postcss` (Tailwind v4, sin necesidad de `tailwind.config.js` — la detección de contenido es automática), con `.postcssrc.json` en la raíz y `@use 'tailwindcss';` en `src/styles.css`.

## Sobre la versión de Angular

El proyecto usa Angular 22, la versión estable más reciente al momento de la entrega. Algunas decisiones puntuales sobre las novedades de esta versión:

## Cómo correrlo

```bash
npm install
npm start        # http://localhost:4200
npm test         # tests unitarios (Karma + Jasmine)
```

No hace falta backend: los datos se sirven en memoria mediante [`angular-in-memory-web-api`](https://github.com/angular/in-memory-web-api), detrás de un `HttpClient` real. Esto permite:

- Usar `HttpClient` genuino (no un mock manual), con manejo de errores HTTP real.
- Que el `loadingInterceptor` funcione exactamente igual que contra un backend real.
- La ventaja principal de seguir esta solución es que si algún en algún futuro se implementa un backend real, el único cambio será quitar `provideInMemoryWebApi()` de `app.config.ts` — el resto del código (servicio, componentes) no cambia.

### Con Docker

```bash
docker build -t riu-frontend-nicanor-cellati .
docker run -p 8080:80 riu-frontend-nicanor-cellati   # http://localhost:8080
```

El `Dockerfile` es multi-stage: una etapa `node:24-alpine` compila el bundle de producción (`npm run build`) y una segunda etapa `nginx:alpine` lo sirve como archivos estáticos. `nginx.conf` resuelve las rutas del Angular Router (`/heroes/nuevo`, etc.) redirigiendo cualquier ruta desconocida a `index.html`, ya que esas rutas no existen como archivos físicos.

## Estructura del proyecto

```
src/app/
├── core/                        # Todo lo transversal, sin lógica de UI
│   ├── models/                  # SuperHero, tipos del dominio
│   ├── services/                # SuperHeroService (CRUD + búsqueda), LoadingService
│   ├── interceptors/             # loadingInterceptor
│   └── directives/               # UppercaseDirective
├── shared/components/            # Reutilizables, sin conocimiento de negocio
│   ├── confirm-dialog/           # Diálogo de confirmación genérico (comunicación por eventos)
│   ├── loading-bar/               # Barra de carga global
│   └── pagination/                # Paginador genérico (Signal Inputs/Outputs)
└── features/heroes/              # Feature de negocio
    ├── hero-list/                 # Listado paginado + filtro + acciones
    └── hero-form/                  # Alta/edición con Reactive Forms
```

## Decisiones técnicas y por qué

- **Standalone Components + Signal Inputs/Outputs**: es el enfoque recomendado desde Angular 17+, evita el boilerplate de NgModules y mejora el tree-shaking.
- **`OnPush` en todos los componentes**, configurado incluso como default del schematic en `angular.json`, para que cualquier componente nuevo lo herede automáticamente.
- **Reactive Forms** (no Template-driven): el formulario necesita validaciones explícitas y es más testeable sin depender del DOM — la misma razón que aplicaría a un formulario con campos dinámicos.
- **RxJs para búsqueda reactiva**: el input de filtro usa `debounceTime + distinctUntilChanged + switchMap`, evitando llamadas de más mientras el usuario escribe y cancelando búsquedas obsoletas.
- **`takeUntilDestroyed()`** en vez de gestionar manualmente un `Subject` de destrucción — evita memory leaks de forma más declarativa.
- **Comunicación por eventos**: `ConfirmDialogComponent` y `PaginationComponent` no conocen nada del dominio de héroes, se comunican exclusivamente vía `@Output`/`output()`.
- **Modelo de datos**: se separó `SuperHero` (con `id` opcional) de `SuperHeroFormValue` (sin `id`), para que el formulario nunca dependa de un id que todavía no existe en el alta.

## Autor

Nicanor Cellati
