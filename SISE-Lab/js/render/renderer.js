/**
 * Renderizador del GRAFCET.
 */
class Renderer {

    constructor(svgCanvas, diagram, engine) {

        this.svg = svgCanvas;
        this.diagram = diagram;
        this.engine = engine;

        this.layout = new Layout();
        this.savedPositions = null;
        // Vistas de las etapas
        this.stepViews = [];
        // Vistas de las transiciones
        this.transitionViews = [];  
        // Relación Modelo - Vista
        this.stepMap = new Map();
        this.transitionMap = new Map();
        this.connectionViews = [];
        this.mode = "select";
        this.editMode = true;

        this.selectedNode = null;


        document
            .getElementById("btnStep")
            .addEventListener("click", () => {
                if (!this.editMode) {

                    return;

                }
                this.mode = "step";
                document.getElementById("modeIndicator")
                    .textContent = "➕ AÑADIR ETAPA: haz clic en el lienzo";

             });
        document
            .getElementById("btnTransition")
            .addEventListener("click", () => {
                if (!this.editMode) {

                    return;

                }
                this.mode = "transition";
                document.getElementById("modeIndicator")
                    .textContent = "━ AÑADIR TRANSICIÓN: haz clic en el lienzo";

            });   
        document
            .getElementById("btnConnect")
            .addEventListener("click", () => {
                if (!this.editMode) {

                    return;

                }
                this.mode = "connect";
                this.selectedNode = null;
                document.getElementById("modeIndicator")
                    .textContent = "🔗 CONECTAR: selecciona el origen";

            });  
        document
            .getElementById("btnDelete")
            .addEventListener("click", () => {
                if (!this.editMode) {

                    return;

                }
                this.deleteSelected();

            });
        // Tecla Supr: borra el nodo seleccionado
        document.addEventListener("keydown", event => {

            if (!this.editMode) {

                return;

            }

            if (event.key !== "Delete" && event.key !== "Supr") {

                return;

            }

            event.preventDefault();

            this.deleteSelected();

        });
        // Botón click en Etapa crea una etapa             
        this.svg.svg.addEventListener("click", event => {

            if (this.mode === "step") {

                const marked = confirm(
                    "¿Etapa inicialmente marcada?"
                );

                const step = this.diagram.addStep(

                    "S" + this.diagram.steps.length,

                    marked

                );

                this.layout.updatePosition(
                    step,
                    event.offsetX,
                    event.offsetY
                );

                this.mode = "select";

                this.render();

                return;

            }

            if (this.mode === "transition") {

                const transition = this.diagram.addTransition(
                    "T" + this.diagram.transitions.length
                );

                this.layout.updatePosition(
                    transition,
                    event.offsetX,
                    event.offsetY
                );

                this.mode = "select";

                this.render();

                return;

            }

            // Clic en el lienzo vacío: deseleccionar
            if (this.mode === "select") {

                this.selectedNode = null;

                this.applySelection();

            }

        });              
    }
    setEditMode(editMode) {

        this.editMode = editMode;

        this.stepViews.forEach(view => {

            view.draggable = editMode;

        });

        this.transitionViews.forEach(view => {

            view.draggable = editMode;

        });

        // Al pasar a simulación se descarta la selección
        if (!editMode) {

            this.selectedNode = null;

        }

        this.applySelection();

        // Recalcular transiciones habilitadas (barra verde)
        this.refresh();

    }
    render() {
        // Limpiar el SVG
        //this.svg.svg.replaceChildren();
        //console.count("Renderer.render");
        this.svg.clear();
        this.stepViews = [];
        this.transitionViews = [];
        this.connectionViews = [];
        // Inicializar posiciones por defecto
        //this.layout.build(this.diagram);
        if (this.savedPositions ===null){
            this.layout.build(this.diagram);
        }

        this.stepMap.clear();
        this.transitionMap.clear();
        //console.log(this.diagram.steps.length);
        // Dibujar todas las etapas
        this.diagram.steps.forEach(step => {
            //console.log(step.name);
            //const position = this.layout.stepPosition(this.stepViews.length);

            //const position = this.layout.positionOf(step);

            let position;
            if (this.savedPositions && this.savedPositions[step.name]) {
                position = this.savedPositions[step.name];
            } else {
                position = this.layout.positionOf(step);
            }

            //console.log(position);
            const view = new StepView(step, position.x, position.y);
            this.stepViews.push(view);
            //console.log(this.stepViews.length);
            this.stepMap.set(step, view);
            view.onSelect = stepView => {

                this.nodeClicked(stepView.step);

            };   

            view.onDoubleClick = stepView => {

                const name = prompt(

                    "Nombre de la etapa:",

                    stepView.step.name

                );

                if (name !== null) {

                    stepView.step.name = name;

                }

                const action = prompt(

                    "Acción:",

                    stepView.step.action ?? ""

                );

                if (action !== null) {

                    stepView.step.action = action;

                }

                //this.render();
                stepView.refreshText();
                this.refreshConnections();

            };           
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
        });

        // Dibujar todas las transiciones
        this.diagram.transitions.forEach(transition => {

            // const position = this.layout.transitionPosition(
            //     this.transitionViews.length
            // );
            //const position = this.layout.positionOf(transition);
            let position;
            if (this.savedPositions && this.savedPositions[transition.receptivity]) {
                position = this.savedPositions[transition.receptivity];
            } else {
                position = this.layout.positionOf(transition);
            }

            const view = new TransitionView(
                transition,
                position.x,
                position.y
            );

            this.transitionViews.push(view);
            this.transitionMap.set(transition, view);
            view.onSelect = transitionView => {

                this.nodeClicked(transitionView.transition);

            };     
            view.onDoubleClick = transitionView => {

                const receptivity = prompt(

                    "Receptividad:",

                    transitionView.transition.receptivity

                );

                if (receptivity !== null) {

                    transitionView.transition.receptivity = receptivity;

                }

                transitionView.text.textContent =
                    transitionView.transition.receptivity;

            };                   
            view.draw(this.svg.svg);
            view.onMove = () => {
                this.layout.updatePosition(

                    transition,

                    view.x,
                    view.y

                );
                this.refreshConnections();

            };
            view.transition = transition;

        });

        // Contar saltos por origen para espaciar las etiquetas

        const jumpCounts = new Map();
        this.diagram.arcs.forEach(arc => {
            const isJump =
                (() => {
                    const targetView = arc.target instanceof Step
                        ? this.stepMap.get(arc.target)
                        : this.transitionMap.get(arc.target);
                    const sourceView = arc.source instanceof Step
                        ? this.stepMap.get(arc.source)
                        : this.transitionMap.get(arc.source);
                    if (!sourceView || !targetView) return false;
                    return targetView.y < sourceView.y ||
                        Math.abs(targetView.y - sourceView.y) > 280;
                })();
            if (isJump && arc.target instanceof Step) {
                const key = arc.source instanceof Step
                    ? "S:" + arc.source.name
                    : "T:" + arc.source.receptivity;
                jumpCounts.set(key, (jumpCounts.get(key) || 0) + 1);
            }
        });
        const jumpOffsets = new Map();

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

            const isJump =

                targetView.y < sourceView.y ||

                Math.abs(targetView.y - sourceView.y) > 280;

            if (isJump && arc.target instanceof Step) {

                const key = arc.source instanceof Step
                    ? "S:" + arc.source.name
                    : "T:" + arc.source.receptivity;
                const total = jumpCounts.get(key) || 1;
                const idx = jumpOffsets.get(key) || 0;
                jumpOffsets.set(key, idx + 1);
                const centre = (total - 1) / 2;
                connection = new JumpConnectionView(

                    this.svg.svg,

                    sourceView,
                    targetView,

                    arc.target,
                    idx - centre

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
        this.refresh();
        if (this.simulation) {
            this.simulation.start();
        }
        this.savedPositions = null;
        this.applySelection();
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
   nodeClicked(node) {

        if (this.mode === "select") {

            // En simulación no se selecciona, solo se dispara
            if (!this.editMode) {

                return;

            }

            this.selectedNode = node;

            this.applySelection();

            return;

        }

        if (this.mode !== "connect") {

            return;

        }

        if (this.selectedNode === null) {

            this.selectedNode = node;
            document.getElementById("modeIndicator")
                .textContent = "🔗 CONECTAR: selecciona el destino";
            return;

        }

        this.diagram.connect(

            this.selectedNode,

            node

        );

        this.selectedNode = null;

        this.mode = "select";

        document.getElementById("modeIndicator")
            .textContent = "⚪ EDICIÓN";

        this.render();

    } 
    applySelection() {

        this.stepViews.forEach(view => view.setSelected(false));
        this.transitionViews.forEach(view => view.setSelected(false));

        if (!this.selectedNode) {

            return;

        }

        const view = this.stepMap.get(this.selectedNode) ||
            this.transitionMap.get(this.selectedNode);

        if (view) {

            view.setSelected(true);

        }

    }
    deleteSelected() {

        if (this.mode !== "select" || !this.selectedNode) {

            return;

        }

        if (this.selectedNode instanceof Step) {

            this.diagram.removeStep(this.selectedNode);

        }
        else if (this.selectedNode instanceof Transition) {

            this.diagram.removeTransition(this.selectedNode);

        }

        this.selectedNode = null;

        document.getElementById("modeIndicator")
            .textContent = "⚪ EDICIÓN";

        this.render();

    }
    setSavedPositions(positions) {

        this.savedPositions = positions;

    }
    setDiagram(diagram, engine, savedPositions) {

        this.diagram = diagram;
        this.engine = engine;
        this.layout = new Layout();

        if (savedPositions) {

            diagram.steps.forEach(step => {
                const p = savedPositions[step.name];
                if (p) this.layout.setPosition(step, p.x, p.y);
            });
            diagram.transitions.forEach(t => {
                const p = savedPositions[t.receptivity];
                if (p) this.layout.setPosition(t, p.x, p.y);
            });

        }

        this.setSavedPositions(savedPositions);

    }
}