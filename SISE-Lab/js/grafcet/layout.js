/**
 * Calcula la disposición gráfica de un GRAFCET.
 */
/**
 * Layout
 * ------
 * Calcula automáticamente la disposición gráfica del GRAFCET.
 *
 * Filosofía:
 *
 *  Diagram
 *      ↓
 *  Análisis estructural
 *      ↓
 *  Nivel / Columna
 *      ↓
 *  Coordenadas
 */

class Layout {

    constructor() {

        //------------------------------------------------------
        // Posiciones finales entregadas al Renderer
        //------------------------------------------------------

        this.positions = new Map();

        //------------------------------------------------------
        // Nivel lógico de cada nodo
        //------------------------------------------------------

        this.levels = new Map();

        //------------------------------------------------------
        // Columna lógica de cada nodo
        //------------------------------------------------------

        this.columns = new Map();

        //------------------------------------------------------
        // Nodos ya recorridos
        //------------------------------------------------------

        this.visited = new Set();

        //------------------------------------------------------
        // Datos auxiliares para convergencias
        //------------------------------------------------------

        this.pendingInputs = new Map();

        //------------------------------------------------------
        // Constantes gráficas
        //------------------------------------------------------

        this.STEP_X = 80;
        this.STEP_Y = 80;

        this.COLUMN_SPACING = 180;
        this.ROW_SPACING = 140;
        //------------------------------------------------------
        // Rejilla de edición
        //------------------------------------------------------

        this.GRID_SPACING = 20;
        this.TRANSITION_OFFSET_X = 60;
        this.TRANSITION_OFFSET_Y = 60;

    }

    //----------------------------------------------------------
    // Limpia todas las estructuras internas
    //----------------------------------------------------------

    reset() {

        this.positions.clear();
        this.levels.clear();
        this.columns.clear();
        this.visited.clear();
        this.pendingInputs.clear();

    }

    //----------------------------------------------------------
    // Devuelve la posición final de un nodo
    //----------------------------------------------------------

    positionOf(node) {

        return this.positions.get(node);

    }

    //----------------------------------------------------------
    // Guarda una posición
    //----------------------------------------------------------

    setPosition(node, x, y) {

        this.positions.set(node, { x, y });

    }
    //----------------------------------------------------------
    // Actualiza la posición de un nodo tras moverlo
    //----------------------------------------------------------

    updatePosition(node, x, y) {

        this.positions.set(node, { x, y });

    }
    //----------------------------------------------------------
    // Convierte columna/nivel en coordenadas SVG
    //----------------------------------------------------------

    gridPosition(column, level, offsetX = 0) {

        const p = {

            x:
                this.STEP_X +
                column * this.COLUMN_SPACING +
                offsetX,

            y:
                this.STEP_Y +
                level * this.ROW_SPACING

        };
        return this.snapToGrid(p.x, p.y);
    }
    //----------------------------------------------------------
    // Ajusta un punto a la rejilla
    //----------------------------------------------------------

    snapToGrid(x, y) {

        return {

            x:
                Math.round(x / this.GRID_SPACING) *
                this.GRID_SPACING,

            y:
                Math.round(y / this.GRID_SPACING) *
                this.GRID_SPACING

        };

    }

    //----------------------------------------------------------
    // Punto de entrada del algoritmo de AutoLayout
    //----------------------------------------------------------

    build(diagram) {

        // Reiniciar todas las estructuras internas
        this.reset();

        // Buscar la etapa inicial
        const initialStep = diagram.initialStep();

        if (!initialStep) {

            return;

        }

        // La etapa inicial siempre comienza aquí
        this.levels.set(initialStep, 0);
        this.columns.set(initialStep, 0);

        // Comenzar recorrido
        this.visitStep(initialStep, diagram);

        // Una vez calculados niveles y columnas,
        // convertirlos en coordenadas gráficas.

        this.computeCoordinates(diagram);

    }
    //----------------------------------------------------------
    // Obtiene el nivel de un nodo
    //----------------------------------------------------------

    levelOf(node) {

        return this.levels.get(node);

    }

    //----------------------------------------------------------
    // Obtiene la columna de un nodo
    //----------------------------------------------------------

    columnOf(node) {

        return this.columns.get(node);

    }

    //----------------------------------------------------------
    // Convierte nivel/columna en posiciones SVG
    //----------------------------------------------------------

    computeCoordinates(diagram) {

        //--------------------------------------------------
        // Etapas
        //--------------------------------------------------

        diagram.steps.forEach(step => {
/*             console.log(
                step.name,
                this.levelOf(step),
                this.columnOf(step)
            ); */
            const p = this.gridPosition(

                this.columnOf(step),
                this.levelOf(step)

            );

            this.setPosition(step, p.x, p.y);

        });

        //--------------------------------------------------
        // Transiciones
        //--------------------------------------------------

        diagram.transitions.forEach(transition => {

            const p = this.gridPosition(

                this.columnOf(transition),
                this.levelOf(transition),

                this.TRANSITION_OFFSET_X

            );

            this.setPosition(transition, p.x, p.y);

        });

    }   
    //----------------------------------------------------------
    // Recorre una etapa
    //----------------------------------------------------------

    visitStep(step, diagram) {

        // Evitar recorrer la misma etapa varias veces
        if (this.visited.has(step)) {

            return;

        }

        this.visited.add(step);

        //--------------------------------------------------
        // Transiciones que salen de esta etapa
        //--------------------------------------------------

        const transitions = diagram.nextTransitions(step);

        if (transitions.length === 0) {

            return;

        }

        //--------------------------------------------------
        // Caso lineal
        //--------------------------------------------------

        if (transitions.length === 1) {

            const transition = transitions[0];

            this.levels.set(
                transition,
                this.levelOf(step) + 1
            );

            this.columns.set(
                transition,
                this.columnOf(step)
            );

            this.visitTransition(
                transition,
                diagram
            );

            return;

        }

        //--------------------------------------------------
        // Toma de decisiones (OR)
        //--------------------------------------------------

        const centre = this.columnOf(step);

        const first = centre - (transitions.length - 1) / 2;

        transitions.forEach((transition, index) => {

            this.levels.set(
                transition,
                this.levelOf(step) + 1
            );

            this.columns.set(
                transition,
                first + index
            );

            this.visitTransition(
                transition,
                diagram
            );

        });

    } 
    //----------------------------------------------------------
    // Recorre una transición
    //----------------------------------------------------------

    visitTransition(transition, diagram) {

        //--------------------------------------------------
        // Etapas que salen de esta transición
        //--------------------------------------------------

        const steps = diagram.nextSteps(transition);

        if (steps.length === 0) {

            return;

        }

        //--------------------------------------------------
        // Caso lineal
        //--------------------------------------------------

        if (steps.length === 1) {

            const step = steps[0];

            //--------------------------------------------------
            // Primera vez que encontramos esta etapa
            //--------------------------------------------------

            if (!this.levels.has(step)) {

                this.levels.set(
                    step,
                    this.levelOf(transition) + 1
                );

                this.columns.set(
                    step,
                    this.columnOf(transition)
                );

            }

            //--------------------------------------------------
            // Continuar recorrido
            //--------------------------------------------------

            this.visitStep(step, diagram);

            return;

        }

        //--------------------------------------------------
        // Divergencia AND
        //--------------------------------------------------

        const centre = this.columnOf(transition);

        const first = centre - (steps.length - 1) / 2;

        steps.forEach((step, index) => {

            //--------------------------------------------------
            // Asignar posición lógica únicamente
            // la primera vez.
            //--------------------------------------------------

            if (!this.levels.has(step)) {

                this.levels.set(
                    step,
                    this.levelOf(transition) + 1
                );

                this.columns.set(
                    step,
                    first + index
                );

            }

            this.visitStep(step, diagram);

        });

    }        
}