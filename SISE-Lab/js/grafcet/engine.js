class Engine {

    constructor(diagram) {

        this.diagram = diagram;

    }
    /**
     * Construye un vector de disparo manual.
     * Solo la transición indicada tendrá valor 1.
     */
    buildFireVector(transition) {

        return this.diagram.transitions.map(t =>
            t === transition ? 1 : 0
        );

    }
    /**
     * Calcula el nuevo vector de marcado.
     */
    nextMarking(fireVector) {

        const C = this.diagram.incidenceMatrix();
        const M = this.diagram.markingVector();

        const next = [...M];

        for (let s = 0; s < this.diagram.steps.length; s++) {

            for (let t = 0; t < this.diagram.transitions.length; t++) {

                next[s] += C[s][t] * fireVector[t];

            }

        }

        return next;

    }   
    /**
     * Indica si una transición está habilitada.
     */
    isEnabled(transition) {

        const previousSteps = this.diagram.previousSteps(transition);

        return previousSteps.every(step => step.marked);

    }    
    /**
     * Intenta disparar una transición.
     * Devuelve el nuevo vector de marcado o null
     * si la transición no está habilitada.
     */
    fire(transition) {

        if (!this.isEnabled(transition)) {

            return null;

        }

        const fireVector = this.buildFireVector(transition);

        const marking = this.nextMarking(fireVector);

        this.applyMarking(marking);

        return true;

    }    
    /**
     * Aplica un vector de marcado al diagrama.
     */
    applyMarking(marking) {

        this.diagram.steps.forEach((step, index) => {

            step.marked = (marking[index] === 1);

        });

    }    
}