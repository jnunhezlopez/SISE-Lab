/**
 * Calcula la disposición gráfica de un GRAFCET.
 */
class Layout {

    constructor() {
        this.positions = new Map();
        // Constantes del layout
        this.STEP_X = 50;
        this.STEP_Y = 80;

        this.STEP_SPACING = 140;

        this.TRANSITION_OFFSET_X = 60;
        this.TRANSITION_OFFSET_Y = 60;

    }
    setPosition(node, x, y) {

        this.positions.set(node, { x, y });

    }
    clearPositions() {

        this.positions.clear();
    }
    positionOf(node) {

        return this.positions.get(node);

    }    
    /**
     * Devuelve la posición de una etapa.
     */
    stepPosition(index) {

        return {

            x: this.STEP_X,
            y: this.STEP_Y + index * this.STEP_SPACING

        };

    }

    /**
     * Devuelve la posición de una transición.
     */
    transitionPosition(index) {

        return {

            x: this.STEP_X + this.TRANSITION_OFFSET_X,
            y: this.STEP_Y
                + this.TRANSITION_OFFSET_Y
                + index * this.STEP_SPACING

        };

    }
    buildLinear(diagram) {

        this.positions.clear();

        diagram.steps.forEach((step, index) => {

            const p = this.stepPosition(index);

            this.setPosition(step, p.x, p.y);

        });

        diagram.transitions.forEach((transition, index) => {

            const p = this.transitionPosition(index);

            this.setPosition(transition, p.x, p.y);

        });

    }
}