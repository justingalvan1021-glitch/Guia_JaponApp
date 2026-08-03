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
