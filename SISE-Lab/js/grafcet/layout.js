/**
 * Calcula la disposición gráfica de un GRAFCET.
 */
class Layout {

    constructor() {
        this.positions = new Map();
        this.root = null;
        this.columns = new Map();
        // Constantes del layout
        this.STEP_X = 50;
        this.STEP_Y = 80;

        this.STEP_SPACING = 140;
        this.GRID_SPACING = this.STEP_SPACING / 2;
        this.COLUMN_SPACING = 140;
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

    gridPosition(column, row, offsetX = 0) {

        return {

            x: this.STEP_X + column * this.COLUMN_SPACING + offsetX,
            y: this.STEP_Y + row * this.GRID_SPACING

        };

    }   

    isAndSplit(transition, diagram) {

        if (!(transition instanceof Transition)) {

            return false;

        }

        return diagram.arcs.filter(arc =>
            arc.source === transition
        ).length > 1;

    }    
    isAndJoin(transition, diagram) {

        if (!(transition instanceof Transition)) {

            return false;

        }

        return diagram.arcs.filter(arc =>
            arc.target === transition
        ).length > 1;

    }    
    isOrSplit(step, diagram) {

        if (!(step instanceof Step)) {

            return false;

        }

        return diagram.arcs.filter(arc =>
            arc.source === step
        ).length > 1;

    }    
    isOrJoin(step, diagram) {

        if (!(step instanceof Step)) {

            return false;

        }

        return diagram.arcs.filter(arc =>
            arc.target === step
        ).length > 1;

    }  
    assignColumns(diagram) {

        // Todas las etapas empiezan en la columna central.

        diagram.steps.forEach(step => {

            this.columns.set(step, 0);

        });

        // Buscar divergencias AND.

        diagram.transitions.forEach(transition => {

            if (!this.isAndSplit(transition, diagram)) {

                return;

            }

            const outputs = diagram.arcs
                .filter(arc => arc.source === transition)
                .map(arc => arc.target);

            const firstColumn = -(outputs.length - 1) / 2;

            outputs.forEach((step, index) => {

                this.columns.set(
                    step,
                    firstColumn + index
                );

            });

        });
    }      
    traverse(diagram) {

        const initialStep = diagram.initialStep();

        if (!initialStep) {

            return;

        }

        this.root = new LayoutNode(initialStep);

        const transitions = diagram.nextTransitions(initialStep);

        if (transitions.length === 0) {

            return;

        }

        const transitionNode = new LayoutNode(transitions[0]);

        this.root.addChild(transitionNode);

        const nextSteps = diagram.nextSteps(transitions[0]);

        nextSteps.forEach(step => {

            transitionNode.addChild(
                new LayoutNode(step)
            );

        });

        console.log(this.root);

    }
    buildLinear(diagram) {

        this.positions.clear();
        this.columns.clear();

        diagram.steps.forEach((step, index) => {

        const column = this.columns.get(step) ?? 0;

/*         console.log(
            step.name,
            this.columns.get(step)
        ); */

        const p = this.gridPosition(
            column,
            index * 2
        );

            this.setPosition(step, p.x, p.y);

        });

        diagram.transitions.forEach((transition, index) => {

            //const p = this.transitionPosition(index);
            const p = this.gridPosition(
                0,
                index * 2 + 1,
                this.TRANSITION_OFFSET_X
            );

            this.setPosition(transition, p.x, p.y);

        });

    }
    build(diagram) {
        this.positions.clear();
        this.columns.clear();
        this.traverse(diagram);
        //this.assignColumns(diagram);
        this.buildLinear(diagram);

    }    
    tree() {

        return this.root;

    }    
}