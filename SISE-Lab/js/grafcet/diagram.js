/**
 * Representa un diagrama GRAFCET.
 */
class Diagram {

    constructor() {

        this.steps = [];
        this.transitions = [];
        this.arcs = [];

    }

    addStep(name, initial = false) {

        const step = new Step(name, initial);

        this.steps.push(step);

        return step;

    }

    addTransition(receptivity = "") {

        const transition = new Transition(receptivity);

        this.transitions.push(transition);

        return transition;

    }
    connect(source, target) {

        const arc = new Arc(source, target);

        this.arcs.push(arc);

        return arc;

    }
    previousSteps(transition) {

        return this.arcs
            .filter(arc =>
                arc.target === transition &&
                arc.source instanceof Step
            )
            .map(arc => arc.source);

    }

    nextSteps(transition) {

        return this.arcs
            .filter(arc =>
                arc.source === transition &&
                arc.target instanceof Step
            )
            .map(arc => arc.target);

    }
    incidenceMatrix() {

        // Crear una matriz llena de ceros
        const matrix = this.steps.map(() =>
            this.transitions.map(() => 0)
        );

        // Recorrer todas las transiciones
        this.transitions.forEach((transition, t) => {

            // Etapas anteriores (-1)
            this.previousSteps(transition).forEach(step => {

                const s = this.steps.indexOf(step);
                matrix[s][t] = -1;

            });

            // Etapas posteriores (+1)
            this.nextSteps(transition).forEach(step => {

                const s = this.steps.indexOf(step);
                matrix[s][t] = 1;

            });

        });

        return matrix;

    }    
    markingVector() {

        return this.steps.map(step => step.marked ? 1 : 0);

    }    
}