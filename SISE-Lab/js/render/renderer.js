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
        this.connectionViews = [];
    }

    render() {

        // Limpiar el SVG
        this.svg.svg.replaceChildren();
        this.stepViews = [];
        this.transitionViews = [];
        this.connectionViews = [];
        // Inicializar posiciones por defecto
        this.layout.build(this.diagram);
        const tree = this.layout.tree();
        //console.log(tree);
        this.drawLayoutTree(tree);

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
            view.onMove = () => {

                this.refreshConnections();

            };
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
            view.onMove = () => {

                this.refreshConnections();

            };
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

            let x1;
            let y1;
            let x2;
            let y2;

            if (arc.source instanceof Step) {

                x1 = sourceView.x + sourceView.width / 2;
                y1 = sourceView.y + sourceView.height;

                x2 = targetView.x;
                y2 = targetView.y;

            } else {

                x1 = sourceView.x;
                y1 = sourceView.y + sourceView.height;

                x2 = targetView.x + targetView.width / 2;
                y2 = targetView.y;

            }

            const connection = new ConnectionView(
                this.svg.svg,
                x1,
                y1,
                x2,
                y2
            );

            this.connectionViews.push(connection);

        });
        // Refrescar las vistas para reflejar el estado actual del modelo
        this.refresh();
    }
    refreshConnections() {

        this.diagram.arcs.forEach((arc, index) => {

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

            let x1;
            let y1;
            let x2;
            let y2;

            if (arc.source instanceof Step) {

                x1 = sourceView.x + sourceView.width / 2;
                y1 = sourceView.y + sourceView.height;

                x2 = targetView.x;
                y2 = targetView.y;

            } else {

                x1 = sourceView.x;
                y1 = sourceView.y + sourceView.height;

                x2 = targetView.x + targetView.width / 2;
                y2 = targetView.y;

            }

            this.connectionViews[index].update(

                x1,
                y1,
                x2,
                y2

            );

        });

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
    drawLayoutTree(node, x = 500, y = 40) {

        if (!node) {

            return;

        }

        const NS = "http://www.w3.org/2000/svg";

        // Nodo
        const circle = document.createElementNS(NS, "circle");

        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", "18");

        circle.setAttribute("fill", "white");
        circle.setAttribute("stroke", "#0080ff");
        circle.setAttribute("stroke-width", "2");

        this.svg.svg.appendChild(circle);

        // Texto
        const text = document.createElementNS(NS, "text");

        text.setAttribute("x", x);
        text.setAttribute("y", y + 5);

        text.setAttribute("text-anchor", "middle");
        text.setAttribute("font-size", "12");

        //console.log(node.modelNode);

        text.textContent =
            node.modelNode.name ||
            node.modelNode.receptivity;

        this.svg.svg.appendChild(text);

        const spacing = 120;

        node.children.forEach((child, index) => {

            const offset = (index - (node.children.length - 1) / 2) * spacing;

            this.drawLine(

                x,
                y + 18,

                x + offset,
                y + 80 - 18

            );

            this.drawLayoutTree(

                child,

                x + offset,
                y + 80

            );

        });

    }    
}