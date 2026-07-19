/**
 * Renderizador del GRAFCET.
 */
class Renderer {

    constructor(svgCanvas, diagram, engine) {

        this.svg = svgCanvas;
        this.diagram = diagram;
        this.engine = engine;
        
        // Vistas de las etapas
        this.stepViews = [];
        // Vistas de las transiciones
        this.transitionViews = [];  
        // Relación Modelo - Vista
        this.stepMap = new Map();
        this.transitionMap = new Map();
    }

    render() {

        // Limpiar el SVG
        this.svg.svg.replaceChildren();
        this.stepViews = [];
        this.transitionViews = [];
        this.stepMap.clear();
        this.transitionMap.clear();

        // Posición inicial
        //let x = 50;
        //let y = 80;
        // Constantes de layout
        const STEP_X = 50;
        const STEP_Y = 80;

        const STEP_SPACING = 140;

        const TRANSITION_OFFSET_X = 60;
        const TRANSITION_OFFSET_Y = 60;

        // Posición inicial
        let x = STEP_X;
        let y = STEP_Y;
        // Dibujar todas las etapas
        this.diagram.steps.forEach(step => {

            const view = new StepView(step, x, y);
            this.stepViews.push(view);
            this.stepMap.set(step, view);
            view.draw(this.svg.svg);

            y += STEP_SPACING;

        });


        this.diagram.transitions.forEach(transition => {

            const transitionX = STEP_X + TRANSITION_OFFSET_X;
            const transitionY = STEP_Y
                            + TRANSITION_OFFSET_Y
                            + this.transitionViews.length * STEP_SPACING;

            const view = new TransitionView(
                transition,
                transitionX,
                transitionY
            );

            this.transitionViews.push(view);
            this.transitionMap.set(transition, view);
            view.draw(this.svg.svg);

            view.transition = transition;

        });
        // Dibujar los enlaces a partir de los arcos del modelo

        this.diagram.arcs.forEach(arc => {

            let sourceView;
            let targetView;

            if (arc.source instanceof Step) {

                sourceView = this.stepMap.get(arc.source);

            } else {

                sourceView = this.transitionMap.get(arc.source);

            }

            if (arc.target instanceof Step) {

                targetView = this.stepMap.get(arc.target);

            } else {

                targetView = this.transitionMap.get(arc.target);

            }
            if (arc.source instanceof Step) {

                this.drawLine(

                    sourceView.x + sourceView.width / 2,
                    sourceView.y + sourceView.height,

                    targetView.x,
                    targetView.y

                );

            } else {

                this.drawLine(

                    sourceView.x,
                    sourceView.y + sourceView.height,

                    targetView.x + targetView.width / 2,
                    targetView.y

                );

            }
        }); 
      
        this.refresh();
    }
    /**
     * Actualiza todas las vistas a partir del modelo.
     */
    refresh() {

        this.stepViews.forEach(view => view.refresh());
        this.transitionViews.forEach(view => {

            view.enabled = this.engine.isEnabled(view.transition);

            view.refresh();

        });

    }
    drawLine(x1, y1, x2, y2) {

        const NS = "http://www.w3.org/2000/svg";

        const line = document.createElementNS(NS, "line");

        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);

        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);

        line.setAttribute("stroke", "#222");
        line.setAttribute("stroke-width", "2");
        // line.setAttribute("stroke", "red");
        // line.setAttribute("stroke-width", "5");

        this.svg.svg.appendChild(line);

    }    
}