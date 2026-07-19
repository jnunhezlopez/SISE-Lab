/**
 * Renderizador del GRAFCET.
 */
class Renderer {

    constructor(svgCanvas, diagram, engine) {

        this.svg = svgCanvas;
        this.diagram = diagram;
        this.engine = engine;

        this.layout = new Layout();

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
        // Inicializar posiciones por defecto

        this.diagram.steps.forEach((step, index) => {

            if (!this.layout.positionOf(step)) {

                const position = this.layout.stepPosition(index);

                this.layout.setPosition(
                    step,
                    position.x,
                    position.y
                );

            }

        });

        this.diagram.transitions.forEach((transition, index) => {

            if (!this.layout.positionOf(transition)) {

                const position = this.layout.transitionPosition(index);

                this.layout.setPosition(
                    transition,
                    position.x,
                    position.y
                );
            }
        });        
        this.stepMap.clear();
        this.transitionMap.clear();

        // Dibujar todas las etapas
        this.diagram.steps.forEach(step => {

            //const position = this.layout.stepPosition(this.stepViews.length);
            const position = this.layout.positionOf(step);
            const view = new StepView(step, position.x, position.y);
            this.stepViews.push(view);
            this.stepMap.set(step, view);
            view.draw(this.svg.svg);
            
        });

        // Dibujar todas las transiciones
        this.diagram.transitions.forEach(transition => {

            // const position = this.layout.transitionPosition(
            //     this.transitionViews.length
            // );
            const position = this.layout.positionOf(transition);
            const view = new TransitionView(
                transition,
                position.x,
                position.y
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
        // Refrescar las vistas para reflejar el estado actual del modelo
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