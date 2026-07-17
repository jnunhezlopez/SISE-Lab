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
        let x = 50;
        let y = 80;

        // Dibujar todas las etapas
        this.diagram.steps.forEach(step => {

            const view = new StepView(step, x, y);
            this.stepViews.push(view);

            view.draw(this.svg.svg);

            y += 140;

        });
        const tx = 110;
        let ty = 140;

        this.diagram.transitions.forEach(transition => {

            const view = new TransitionView(transition, tx, ty);

            this.transitionViews.push(view);

            view.draw(this.svg.svg);

            view.transition = transition;

            ty += 140;

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