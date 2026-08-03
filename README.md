# JP26 — Japan Adventure

Guía web personalizada para el viaje a Japón de octubre de 2026.

## Estructura

- `index.html`: estructura y contenido.
- `css/style.css`: estilos visuales.
- `js/app.js`: guardado local de checklists y funciones generales.
- `js/japanese.js`: copiar, voz y favoritas de frases japonesas.
- `js/maps.js`: mapa interactivo de Asakusa.
- `assets/images/`: imágenes organizadas por ciudad y categoría.
- `assets/icons/`: iconos de la futura PWA.
- `manifest.json`: configuración básica para instalar JP26 como app web.

## Publicación

GitHub Pages debe usar:

- Branch: `main`
- Folder: `/ (root)`

No elimines `.nojekyll`.

## v3.1

Se integraron mapas, imágenes y rutas visuales dentro de las 17 Master Cards de Tokio, Osaka y Kioto.

## v4.1

- Nuevo Home premium.
- Barra superior con hora de Tokio.
- Countdown dinámico.
- Timeline horizontal generado desde `data/itinerary.json`.
- Tarjetas visuales de Tokio, Osaka y Kioto.
- Primer paso para separar contenido y presentación.

## v4.2

Mission Control completo para las siete actividades principales. Consulta `docs/EXPLICACION_PROYECTO.md`.

## v4.3

- Hora en tiempo real de Tokio y Salt Lake City.
- Diferencia horaria calculada automáticamente, incluyendo cambios de horario de verano.
- Clima actual de Tokio, Osaka, Kioto y SLC.
- Consejos de JP26 según lluvia, viento y temperatura.
- Respaldo de los últimos datos mediante `localStorage`.
- Actualización automática cada 15 minutos.
