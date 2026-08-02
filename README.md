# SISE-Lab

SISE-Lab es un proyecto educativo desarrollado para la creación de un editor y simulador de GRAFCET orientado a la enseñanza de los sistemas secuenciales programables.

El proyecto nace con un doble objetivo:

- Facilitar la explicación del lenguaje GRAFCET en el aula.
- Servir como herramienta de experimentación para el desarrollo de software basado en modelos.

---

## Estado del proyecto

⚠️ Proyecto en desarrollo.

La versión actual constituye un primer prototipo funcional que incorpora:

- Modelo interno de GRAFCET.
- Motor de simulación.
- Representación gráfica mediante SVG.
- Edición básica de etapas y transiciones.
- Guardado y carga de proyectos en formato JSON.

El editor gráfico presenta todavía limitaciones importantes y no debe considerarse una versión estable para uso docente continuado.

---

## Objetivos

- Representación gráfica de GRAFCET conforme a la norma IEC 60848.
- Simulación interactiva del marcado.
- Edición visual sencilla e intuitiva.
- Arquitectura modular y mantenible.
- Código completamente desarrollado en JavaScript nativo.

---

## Arquitectura

El proyecto se estructura en varios bloques independientes:

- Modelo (`Diagram`, `Step`, `Transition`, `Arc`)
- Motor de simulación (`Engine`)
- Renderizado SVG (`Renderer` y vistas gráficas)
- Persistencia (`FileManager`)
- Interfaz de usuario

La arquitectura pretende mantener separadas las responsabilidades de representación, simulación y almacenamiento.

---

## Tecnologías utilizadas

- JavaScript (ES6)
- SVG
- HTML5
- CSS

No se emplea ningún framework externo.

---

## Estado actual

El modelo y el motor de simulación son funcionales.

El editor gráfico continúa en evolución y está previsto un rediseño arquitectónico para mejorar:

- Renderizado.
- Gestión de eventos.
- Edición gráfica.
- Conexiones complejas.
- Mantenibilidad del código.

---

## Licencia

Este proyecto se distribuye bajo la licencia MIT.

Consulta el archivo LICENSE para más información.

---

## Autor

Proyecto desarrollado con fines educativos para el módulo de Sistemas Secuenciales Programables del Ciclo Formativo de Grado Superior en Automatización y Robótica Industrial.
