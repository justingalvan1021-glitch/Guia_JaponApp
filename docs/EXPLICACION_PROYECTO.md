# JP26 v4.2 — Explicación del proyecto

## 1. Arquitectura general

JP26 ahora combina una página principal con páginas independientes para las actividades.

- `index.html`: Home, itinerario, ciudades, Survival Guide y tablero de actividades.
- `activities/*.html`: una página independiente por actividad.
- `data/activities/*.json`: contenido de cada actividad.
- `js/missions.js`: componente reutilizable que construye todas las páginas.
- `css/missions.css`: diseño compartido de las páginas de actividades.
- `css/mission-hub.css`: diseño del tablero de actividades.

## 2. Cómo se genera una actividad

Cada archivo HTML de `activities/` contiene la misma estructura vacía.

El atributo:

```html
<body data-activity="disneysea">
```

le indica a `missions.js` qué archivo JSON debe cargar:

```text
data/activities/disneysea.json
```

El JavaScript toma los datos y construye:

- Portada.
- Métricas.
- Timeline.
- Prioridades.
- Mapa.
- Checklist.
- Presupuesto.
- Tips.
- Diario del Crew.

## 3. Ventaja de usar JSON

Para cambiar contenido no necesitas modificar HTML ni JavaScript.

Ejemplo:

```json
{
  "title": "Tokyo DisneySea",
  "budget": "¥18,000–25,000"
}
```

Cambiar esos valores actualiza automáticamente la página.

## 4. Guardado local

Los checklists, la misión completada y las notas usan `localStorage`.

Las claves tienen este formato:

```text
jp26:mission-check:disneysea:0
jp26:mission-complete:disneysea
jp26:mission-note:disneysea:bestMoment
```

El contenido permanece en el navegador del dispositivo.

## 5. Mapas

Cada JSON contiene una lista de paradas con:

```json
["Fantasy Springs", 35.6301, 139.8780, "🏰", "Primera prioridad"]
```

`missions.js` usa Leaflet y OpenStreetMap para crear:

- Marcadores.
- Popups.
- Línea visual.
- Ajuste automático del zoom.

Google Maps se usa para navegación real.

## 6. Cómo agregar una actividad nueva

1. Copia uno de los HTML dentro de `activities/`.
2. Cambia `data-activity`.
3. Crea un JSON con el mismo nombre dentro de `data/activities/`.
4. Agrega una tarjeta en el tablero de `index.html`.

## 7. Flujo de trabajo

```text
VS Code
↓
Auto Save o Ctrl + S
↓
Live Server
↓
GitHub Desktop
↓
Commit
↓
Push
↓
GitHub Pages
```

## 8. Recomendación

Edita contenido en JSON y diseño en CSS. Evita poner información nueva directamente dentro del JavaScript.

## 9. Clima y relojes mundiales — v4.3

El módulo `js/weather.js` realiza tres trabajos:

1. Calcula la hora de Tokio y Salt Lake City con `Intl.DateTimeFormat`.
2. Consulta el clima actual usando Open-Meteo.
3. Guarda la respuesta más reciente en `localStorage` para mostrar un respaldo sin conexión.

Las ubicaciones están separadas en:

```text
data/locations.json
```

La aplicación pide estas variables:

- Temperatura.
- Sensación térmica.
- Humedad.
- Precipitación.
- Código meteorológico.
- Velocidad del viento.
- Día o noche.

La interfaz se actualiza cada segundo para los relojes y cada 15 minutos para el clima.

## 10. Conversión JPY → USD — v4.4

El archivo `js/currency.js` consulta el tipo de cambio diario JPY/USD desde Frankfurter.

La tasa se guarda en:

```text
jp26:fx:jpy-usd
```

Cuando la API no está disponible, la app usa la última tasa guardada. Si nunca hubo una consulta exitosa, usa una tasa de respaldo.

El módulo busca elementos con precios en yenes o con el atributo:

```html
data-yen="12000"
```

y agrega el equivalente en dólares automáticamente.

## 11. Itinerary OS — v4.5

El itinerario completo vive en:

```text
data/itinerary-os.json
```

Cada día contiene:

- Título.
- Ciudad.
- Horarios.
- Transporte.
- Presupuesto.
- Actividades.
- Comida.
- Estado.
- Imagen.
- Enlace a la guía relacionada.

`js/itinerary-os.js` genera la navegación por fechas, el día seleccionado y el resumen completo.

El estado de cada día se guarda en `localStorage`:

```text
jp26:itinerary-complete:day-03
```
