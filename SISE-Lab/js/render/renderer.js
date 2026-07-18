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

    }

    render() {

        // Limpiar el SVG
        this.svg.svg.replaceChildren();
        this.stepViews = [];
        this.transitionViews = [];

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

            view.draw(this.svg.svg);

            view.transition = transition;

        });
        // Dibujar los enlaces entre etapas y transiciones

        for (let i = 0; i < this.transitionViews.length; i++) {
            
            const step1 = this.stepViews[i];
            const transition = this.transitionViews[i];
            const step2 = this.stepViews[i + 1];

            // Etapa -> Transición

            this.drawLine(

                step1.x + step1.width / 2,
                step1.y + step1.height,

                transition.x,
                transition.y

            );

            // Transición -> Etapa

            this.drawLine(

                transition.x,
                transition.y + transition.height,

                step2.x + step2.width / 2,
                step2.y

            );

        }
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