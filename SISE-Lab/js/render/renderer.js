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


        this.stepMap.clear();
        this.transitionMap.clear();
        //console.log(this.diagram.steps.length);
        // Dibujar todas las etapas
        this.diagram.steps.forEach(step => {
            console.log(step.name);
            //const position = this.layout.stepPosition(this.stepViews.length);
            const position = this.layout.positionOf(step);
            console.log(position);
            const view = new StepView(step, position.x, position.y);
            this.stepViews.push(view);
            //console.log(this.stepViews.length);
            this.stepMap.set(step, view);
            view.draw(this.svg.svg);
            //------------------------------------------------------
            // La etapa ha cambiado de posición
            //------------------------------------------------------

            view.onMove = (stepView) => {

                //--------------------------------------------------
                // Actualizar Layout
                //--------------------------------------------------

                this.layout.updatePosition(

                    stepView.step,

                    stepView.x,
                    stepView.y

                );

                //--------------------------------------------------
                // Redibujar conexiones
                //--------------------------------------------------

                this.refreshConnections();

            };            
/*             view.onMove = () => {

                this.refreshConnections();

            }; */
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

/*             const connection = new ConnectionView(

                this.svg.svg,

                sourceView,
                targetView,

                arc.source,
                arc.target

            );

            this.connectionViews.push(connection); */
            let connection;

            //------------------------------------------------------
            // ¿Es un salto?
            //------------------------------------------------------

            const isJump =

                targetView.y < sourceView.y ||

                Math.abs(targetView.y - sourceView.y) > 280;

            //------------------------------------------------------
            // Crear la vista adecuada
            //------------------------------------------------------

            if (isJump && arc.target instanceof Step) {

                connection = new JumpConnectionView(

                    this.svg.svg,

                    sourceView,
                    targetView,

                    arc.target

                );

            }
            else {

                connection = new ConnectionView(

                    this.svg.svg,

                    sourceView,
                    targetView,

                    arc.source,
                    arc.target

                );

            }

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
    
}