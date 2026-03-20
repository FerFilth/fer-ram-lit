# Rick and Morty App con Lit

Aplicacion web construida con Lit para explorar personajes de Rick and Morty.
Incluye busqueda con debounce, paginacion, favoritos persistidos en localStorage, modal de detalle, tema claro/oscuro y pruebas unitarias con Web Test Runner.

## Demo funcional

- Ruta principal: /rick-and-morty
- Ruta alternativa: /rick-and-morty/home
- Ruta de error: /rick-and-morty/error

## Stack

- Lit 3
- Vite 8
- Web Test Runner
- Open WC Testing
- Sinon

## Funcionalidades

- Listado de personajes desde la API de Rick and Morty
- Busqueda por nombre con debounce
- Paginacion de resultados
- Modo favoritos
- Favoritos persistidos en localStorage
- Modal de detalle por personaje
- Tema claro/oscuro persistido
- Vista 404 para rutas no validas

## Estructura principal

- src/app/app.js: enrutamiento simple por pathname
- src/app/services/ram.service.js: store global de estado y logica de datos
- src/app/pages/home-list/home-list.js: pagina principal
- src/app/pages/error/error.js: pagina de error
- src/app/components/*: componentes reutilizables

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

## Instalacion

1. Instala dependencias:

   npm install

2. Instala navegador de Playwright (solo primera vez para tests):

   npx playwright install chromium


## Testing

La suite usa Web Test Runner + Open WC y cubre:

- Componentes:
  - paginator
  - ram-card
  - ram-grid
  - ram-input
  - ram-modal
- Paginas:
  - home-list
  - error
- Servicio/store:
  - ram.service

Archivos de pruebas en src/**/*.spec.js.

## Decisiones tecnicas

- Se usa un store singleton para centralizar estado de busqueda, pagina, loading y favoritos.
- Los favoritos se guardan en localStorage con la clave ram-favorites.
- La navegacion es interna (sin libreria de router), basada en history API.
- El tema se sincroniza con data-theme en documentElement.


## Autor

Fernando Gonzalez Zamora
