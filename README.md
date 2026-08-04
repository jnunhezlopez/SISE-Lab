# SISE-Lab

SISE-Lab es un proyecto educativo desarrollado para la creación de un editor y simulador de GRAFCET orientado a la enseñanza de los sistemas secuenciales programables.

El proyecto nace con un doble objetivo:

- Facilitar la explicación del lenguaje GRAFCET en el aula.
- Servir como herramienta de experimentación para el desarrollo de software basado en modelos.

---

## Estado del proyecto

⚠️ Proyecto en desarrollo.

La versión actual es un prototipo funcional que incorpora:

- Modelo interno de GRAFCET (etapas, transiciones y arcos).
- Motor de evolución del marcado con **simulación manual**: se dispara una transición habilitada al hacer clic sobre ella (barra en verde cuando está habilitada).
- Representación gráfica en SVG con rejilla.
- Edición visual: añadir etapas y transiciones, conectarlas, arrastrar con ajuste a rejilla y auto-layout por niveles/columnas.
- **Selección y borrado** de elementos (tecla Supr o botón Borrar), eliminando también sus arcos.
- Guardado y carga de proyectos en **JSON**, con **sobrescritura** del archivo abierto y **"Guardar como"** (File System Access API en Chrome/Edge; descarga de copia como alternativa).
- Interfaz en español.

Limitaciones conocidas: el modo de simulación automática está declarado pero sin implementar, y no hay linter ni suite de pruebas configurados.

---

## Objetivos

- Representación gráfica de GRAFCET conforme a la norma IEC 60848.
- Simulación interactiva del marcado.
- Edición visual sencilla e intuitiva.
- Arquitectura modular y mantenible.
- Código completamente desarrollado en JavaScript nativo.

---

## Arquitectura

El proyecto se estructura en bloques independientes con patrón **Modelo–Vista**:

- **Modelo** (`js/grafcet/`): `Node`, `Step`, `Transition`, `Arc`, `Diagram`, `Engine`, `Layout`, `Simulation`.
- **Vista** (`js/render/`): `Renderer`, `StepView`, `TransitionView`, `ConnectionView`, `JumpConnectionView`.
- **Core** (`js/core/`): `SVGCanvas` (lienzo SVG y rejilla).
- **Persistencia** (`js/file/`): `Serializer` (JSON) y `FileManager` (guardar/cargar).
- **Orquestación**: `js/app.js` conecta modelo, motor y renderer con los botones de `index.html`.

La arquitectura mantiene separadas las responsabilidades de representación, simulación y almacenamiento. El editor se abre directamente desde `index.html`, sin build ni dependencias externas.

---

## Tecnologías utilizadas

- JavaScript (ES6)
- SVG
- HTML5
- CSS

No se emplea ningún framework externo.

---

## Licencia

Este proyecto se distribuye bajo la licencia MIT.

Consulta el archivo `LICENSE` en la raíz del proyecto para más información.

---

## Autor

Proyecto desarrollado con fines educativos para el módulo de Sistemas Secuenciales Programables del Ciclo Formativo de Grado Superior en Automatización y Robótica Industrial.
