# SISE-Lab

Editor gráfico y simulador de GRAFCET (autómatas programables) en JavaScript puro, sin dependencias ni build. Se abre directamente desde `index.html`.

## Ejecución

Abrir `index.html` en un navegador (no requiere servidor). Interfaz en español.

## Arquitectura

Patrón **Modelo–Vista** con clases globales (sin módulos). Cada archivo declara una clase `class X` en el `window`.

- **Modelo** (`js/grafcet/`): estructura del GRAFCET (etapas, transiciones, arcos) y la evolución del marcado.
- **Vista** (`js/render/`): elementos SVG y manejo de interacción (arrastre, clic, doble clic).
- **Core** (`js/core/`): lienzo SVG con rejilla.
- **File** (`js/file/`): persistencia JSON (guardar/cargar).
- **Orquestación**: `js/app.js` conecta modelo, motor y renderer con los botones de `index.html`.

## Mapa de archivos

### Modelo — `js/grafcet/`

| Archivo | Contenido |
|---|---|
| `node.js` | `Node`: clase base, asigna `id` secuencial. |
| `step.js` | `Step extends Node`: etapa con `initial`, `action`, `marked`. |
| `transition.js` | `Transition extends Node`: transición con `receptivity`. |
| `arc.js` | `Arc`: par `source`/`target` entre un Step y un Transition. |
| `diagram.js` | `Diagram`: contenedor de steps/transitions/arcs; `previousSteps`, `nextSteps`, `nextTransitions`, `previousTransitions`, `initialStep`, `incidenceMatrix`, `markingVector`; borrado (`removeStep`, `removeTransition`, `removeArc`, `removeArcsOf`). |
| `engine.js` | `Engine`: motor de evolución del marcado. `isEnabled`, `fire`, `nextMarking`, `evolve`, `applyMarking`, `isConsistent`, `buildFireVector`. |
| `simulation.js` | `Simulation`: modos `MANUAL_MODE`/`AUTOMATIC_MODE`; dispara transiciones al hacer clic en simulación. |
| `layout.js` | `Layout`: auto-layout por niveles/columnas (lineal, divergencia AND, toma OR), snap a rejilla, posiciones. |
| `layoutnode.js` | `LayoutNode`: nodo auxiliar del árbol de layout (no usado activamente). |

### Vista — `js/render/`

| Archivo | Contenido |
|---|---|
| `renderer.js` | `Renderer`: dibuja modelo en SVG, gestiona modos (`step`, `transition`, `connect`, `select`), edición/simulación, arrastre y conexiones. Punto central de interacción. Selección de nodos (`applySelection`) y borrado (`deleteSelected`, tecla Supr o botón Borrar). |
| `stepview.js` | `StepView`: rectángulo de etapa, marca de activación, bloque de acción, doble clic para renombrar/acción. |
| `transitionview.js` | `TransitionView`: línea + barra de transición, doble clic para receptividad, barra verde cuando habilitada, `onClick`/`removeClick` para simulación. |
| `connectionview.js` | `ConnectionView`: conector ortogonal (polilínea M-L-L-L) entre etapa y transición. |
| `jumpconnectionview.js` | `JumpConnectionView`: conector de salto hacia atrás con etiqueta del destino. |

### Core — `js/core/`

| Archivo | Contenido |
|---|---|
| `SVGCanvas.js` | `SVGCanvas`: crea el `<svg>` en un contenedor, `drawGrid` (rejilla 20px), `clear`. |

### Persistencia — `js/file/`

| Archivo | Contenido |
|---|---|
| `serializer.js` | `Serializer`: `serialize(diagram, renderer)` → JSON; `deserialize(data)` → `{ diagram, positions }`. Guarda **marcado inicial**, no el actual. |
| `filemanager.js` | `FileManager`: guardar/cargar JSON. Usa File System Access API (`showOpenFilePicker`/`showSaveFilePicker`) cuando está disponible: devuelve un `FileSystemFileHandle` que permite **sobrescribir** el archivo en guardados posteriores. Fallback: `<input type=file>` + descarga Blob (`<a download>`). |

### Orquestación

| Archivo | Contenido |
|---|---|
| `js/app.js` | Crea `SVGCanvas`, `Diagram`, `Engine`, `Renderer`, `Simulation`; enlaza botones Guardar/Guardar como/Abrir/Editar/Simular; `saveGrafcet`, `saveGrafcetAs`, `loadGrafcet` en `window`. |

### Otros

- `index.html`: página única, carga los scripts en orden (modelo → render → file → app). **El orden de los `<script>` importa** (no hay módulos).
- `css/sise.css`: estilos de interfaz.

## Flujo de datos clave

1. **Edición**: clic en "Etapa"/"Transición" fija `renderer.mode`; clic en lienzo añade nodo (pregunta si la etapa está inicialmente marcada). "Conectar" permite enlazar dos nodos (`nodeClicked` → `diagram.connect`).
2. **Simulación**: `Renderer.setEditMode(false)`; `Simulation.start()` asocia a cada `TransitionView` un handler que llama `engine.fire(t)` si la transición está habilitada; `renderer.refresh()` actualiza las marcas.
3. **Guardar/Cargar**: `FileManager.save` → `Serializer.serialize` (incluye posiciones de las vistas). Al cargar, `app.js` reconstruye `Diagram`, `Engine` y vuelve a colocar los nodos desde `positions` mediante `renderer.setDiagram` y `savedPositions`. Si la carga se hizo con File System Access API, `app.js` guarda el `FileSystemFileHandle` en `currentFileHandle` y Guardar **sobrescribe** ese archivo directamente; "Guardar como" (`saveGrafcetAs`) abre siempre el selector y pasa a apuntar al nuevo archivo; sin soporte se descarga una copia.

## Notas / peculiaridades

- Los nombres de etapa y las **receptividades se usan como clave** en el JSON y en `positions`; nombres/receptividades duplicados romperían la carga.
- Sin linter ni tests configurados. Verificación manual en navegador.
- Código con comentarios en español (docstrings de archivos).
- `simulation.js` tiene `cycle()` vacío y `AUTOMATIC_MODE` declarado pero sin implementación real.
- `layout.js` `build()` ignora `initialStep` (recorre todas las etapas por columnas).
