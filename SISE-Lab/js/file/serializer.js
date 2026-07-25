class Serializer {

    //----------------------------------------------------------
    // Exportar GRAFCET
    //----------------------------------------------------------

    static serialize(diagram, renderer) {

        const data = {

            steps: [],
            transitions: [],
            arcs: [],
            positions: {}

        };

        //------------------------------------------------------
        // Etapas
        //------------------------------------------------------

        diagram.steps.forEach(step => {

            data.steps.push({

                name: step.name,
                initial: step.initial,
                //marked : step.marked,
                //si se descomenta lo anterior, se guarda el marcado actual
                //comentado, guarda el marcado inicial
                action: step.action
            });

        });

        //------------------------------------------------------
        // Transiciones
        //------------------------------------------------------

        diagram.transitions.forEach(transition => {

            data.transitions.push({

                receptivity: transition.receptivity

            });

        });

        //------------------------------------------------------
        // Arcos
        //------------------------------------------------------

        diagram.arcs.forEach(arc => {

            const source =
                arc.source instanceof Step
                    ? arc.source.name
                    : arc.source.receptivity;

            const target =
                arc.target instanceof Step
                    ? arc.target.name
                    : arc.target.receptivity;

            data.arcs.push({

                source,
                target

            });

        });

        //------------------------------------------------------
        // Posiciones de las etapas
        //------------------------------------------------------

        renderer.stepViews.forEach(view => {

            data.positions[view.step.name] = {

                x: view.x,
                y: view.y

            };

        });

        //------------------------------------------------------
        // Posiciones de las transiciones
        //------------------------------------------------------

        renderer.transitionViews.forEach(view => {

            data.positions[view.transition.receptivity] = {

                x: view.x,
                y: view.y

            };

        });

        return data;

    }

    //----------------------------------------------------------
    // Importar GRAFCET
    //----------------------------------------------------------

    static deserialize(data) {

        const diagram = new Diagram();

        const nodeMap = new Map();

        //------------------------------------------------------
        // Etapas
        //------------------------------------------------------

        data.steps.forEach(step => {

            const s = diagram.addStep(

                step.name,

                step.initial//step.marked
           //tal y como está recupera el marcado inicial
           //si se sustituye por lo comentado, recupera el 
           //marcado del momento de grabación
           //debe coordinarse con el método de grabación

            );
            s.setAction(step.action ?? "");
            nodeMap.set(step.name, s);

        });

        //------------------------------------------------------
        // Transiciones
        //------------------------------------------------------

        data.transitions.forEach(transition => {

            const t = diagram.addTransition(

                transition.receptivity

            );

            nodeMap.set(

                transition.receptivity,

                t

            );

        });

        //------------------------------------------------------
        // Arcos
        //------------------------------------------------------

        data.arcs.forEach(arc => {

            diagram.connect(

                nodeMap.get(arc.source),

                nodeMap.get(arc.target)

            );

        });

        return {

            diagram,

            positions: data.positions

        };

    }

}